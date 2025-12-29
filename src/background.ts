// src/background.ts

import type { Tool, ToolKind } from "./data/tools"
import { TOOLS } from "./data/tools"

type GetRecsRequest = {
  type: "SCOUT_GET_RECS"
  query: string
}

type GetRecsResponse = {
  sponsoredTool: Tool | null
  freeTool: Tool | null
  trialTool: Tool | null
}

function scoreTool(tool: Tool, query: string): number {
  const q = (query || "").toLowerCase().trim()
  if (!q) return 0

  const hay = [
    tool.name,
    tool.tagline,
    ...(tool.keywords ?? []),
    ...(tool.features ?? [])
  ]
    .join(" ")
    .toLowerCase()

  const tokens = q.split(/\s+/).filter(Boolean)

  let score = 0
  for (const t of tokens) {
    if (t.length <= 2) continue
    if (hay.includes(t)) score += 2
  }

  // mild rating bias if present
  if (typeof tool.rating === "number") {
    score += Math.max(0, Math.min(1.5, (tool.rating - 4.5) * 1.0))
  }

  return score
}

function pickBest(kind: ToolKind, query: string, excludeIds = new Set<string>()): Tool | null {
  const pool = TOOLS.filter((t) => t.kind === kind && !excludeIds.has(t.id))
  if (!pool.length) return null

  const ranked = pool
    .map((t) => ({ t, s: scoreTool(t, query) }))
    .sort((a, b) => b.s - a.s)

  return ranked[0]?.t ?? null
}

chrome.runtime.onMessage.addListener(
  (msg: unknown, _sender: chrome.runtime.MessageSender, sendResponse) => {
    const m = msg as Partial<GetRecsRequest>
    if (m?.type !== "SCOUT_GET_RECS") return

    const query = String(m.query ?? "").trim()
    const exclude = new Set<string>()

    const sponsoredTool = pickBest("sponsored", query, exclude)
    if (sponsoredTool) exclude.add(sponsoredTool.id)

    const freeTool = pickBest("free", query, exclude)
    if (freeTool) exclude.add(freeTool.id)

    // fallback allowed if trial not separated later
    const trialTool = pickBest("trial", query, exclude) ?? null

    const res: GetRecsResponse = {
      sponsoredTool,
      freeTool,
      trialTool
    }

    sendResponse(res)
    return true
  }
)
