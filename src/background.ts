import { tools, type Tool } from "~data/tools"

type GetRecsMsg = {
  type: "SCOUT_GET_RECS"
  query: string
}

type RecsResponse =
  | {
      ok: true
      query: string
      sponsoredOrTrial: Tool
      freeOrFreemium: Tool
      aiBlurb: string
    }
  | { ok: false; error: string }

// ------------------------------
// Gemini Nano-ready integration
// ------------------------------
// This code is structured so that when `window.ai.languageModel` becomes available
// in Chrome, you can swap `generateBlurb` to call the on-device model.
// IMPORTANT: background service workers do not have a DOM, so we keep this pure.
async function generateBlurb(query: string, freeTool: Tool, paidTool: Tool): Promise<string> {
  try {
    // If you later move this to an offscreen document, you can call window.ai there.
    // For now we return a deterministic blurb.
    return `Based on your search for "${query}", Scout recommends a free option (${freeTool.name}) and a trial/sponsored option (${paidTool.name}) tailored to your intent.`
  } catch {
    return `Scout recommendations for: ${query}`
  }
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

function scoreTool(query: string, tool: Tool): number {
  const q = normalize(query)
  if (!q) return 0

  const tokens = new Set(q.split(" ").filter(Boolean))
  let score = 0

  for (const cat of tool.categories) {
    if (tokens.has(normalize(cat))) score += 3
  }

  for (const kw of tool.keywords) {
    const nkw = normalize(kw)
    if (!nkw) continue

    // exact token
    if (tokens.has(nkw)) score += 4

    // phrase containment
    if (q.includes(nkw)) score += 2
  }

  // gentle tie-breaker for higher ratings
  score += Math.round(tool.rating * 10) / 100

  return score
}

function pickBest(query: string, pool: Tool[]): Tool {
  let best: Tool | null = null
  let bestScore = -Infinity

  for (const t of pool) {
    const s = scoreTool(query, t)
    if (s > bestScore) {
      bestScore = s
      best = t
    }
  }

  // Hard fallback: first tool
  return best ?? pool[0]
}

function pickDualTools(query: string): { sponsoredOrTrial: Tool; freeOrFreemium: Tool } {
  const sponsoredOrTrialPool = tools.filter((t) => t.tier === "SPONSORED" || t.tier === "TRIAL")
  const freeOrFreemiumPool = tools.filter((t) => t.tier === "FREE" || t.tier === "FREEMIUM")

  const sponsoredOrTrial = pickBest(query, sponsoredOrTrialPool)
  const freeOrFreemium = pickBest(query, freeOrFreemiumPool)

  return { sponsoredOrTrial, freeOrFreemium }
}

chrome.runtime.onMessage.addListener((msg: unknown, _sender, sendResponse) => {
  ;(async () => {
    const m = msg as Partial<GetRecsMsg>
    if (m?.type !== "SCOUT_GET_RECS") return

    const query = (m.query ?? "").toString().trim()
    if (!query) {
      const resp: RecsResponse = { ok: false, error: "Missing query" }
      sendResponse(resp)
      return
    }

    const { sponsoredOrTrial, freeOrFreemium } = pickDualTools(query)
    const aiBlurb = await generateBlurb(query, freeOrFreemium, sponsoredOrTrial)

    const resp: RecsResponse = {
      ok: true,
      query,
      sponsoredOrTrial,
      freeOrFreemium,
      aiBlurb
    }
    sendResponse(resp)
  })().catch((e) => {
    const resp: RecsResponse = { ok: false, error: e instanceof Error ? e.message : "Unknown error" }
    sendResponse(resp)
  })

  // Keep channel open for async response
  return true
})
