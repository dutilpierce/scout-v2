import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import React, { useEffect, useMemo, useState } from "react"
import cssText from "data-text:~style.css"
import { ScoutPanel } from "~components/ScoutPanel"
import type { Tool } from "~data/tools"

export const config: PlasmoCSConfig = {
  matches: ["https://www.google.com/search*"],
  all_frames: false
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")

  // CRITICAL FIX: Tailwind v4 variable hoisting inside Shadow DOM.
  // Tailwind emits vars on :root; Shadow DOM doesn't see :root.
  // We rewrite to :host so the vars are visible.
  style.textContent = cssText.replaceAll(":root", ":host")
  style.setAttribute("data-scout-tailwind", "true")
  return style
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

function readGoogleQuery(): string {
  try {
    const u = new URL(window.location.href)
    return (u.searchParams.get("q") ?? "").trim()
  } catch {
    return ""
  }
}

function installSpaListeners(onChange: () => void) {
  const handler = () => onChange()

  // Required: popstate listener (Google uses History API + ajax)
  window.addEventListener("popstate", handler)

  // Additional hardening: wrap pushState/replaceState so we catch SPA changes.
  const { pushState, replaceState } = history
  ;(history as any).pushState = function (...args: any[]) {
    const ret = pushState.apply(this, args as any)
    window.dispatchEvent(new Event("popstate"))
    return ret
  }
  ;(history as any).replaceState = function (...args: any[]) {
    const ret = replaceState.apply(this, args as any)
    window.dispatchEvent(new Event("popstate"))
    return ret
  }

  return () => {
    window.removeEventListener("popstate", handler)
    ;(history as any).pushState = pushState
    ;(history as any).replaceState = replaceState
  }
}

async function fetchRecs(query: string): Promise<RecsResponse> {
  return await chrome.runtime.sendMessage({ type: "SCOUT_GET_RECS", query })
}

export default function ScoutContentRoot() {
  const [isOpen, setIsOpen] = useState(true)
  const [query, setQuery] = useState(() => readGoogleQuery())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sponsoredOrTrial, setSponsoredOrTrial] = useState<Tool | null>(null)
  const [freeOrFreemium, setFreeOrFreemium] = useState<Tool | null>(null)
  const [aiBlurb, setAiBlurb] = useState<string>("")

  // Detect SPA query changes
  useEffect(() => {
    const cleanup = installSpaListeners(() => {
      const next = readGoogleQuery()
      if (next && next !== query) setQuery(next)
    })
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!query) return
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchRecs(query)
      .then((resp) => {
        if (cancelled) return
        if (!resp.ok) {
          setError(resp.error)
          setSponsoredOrTrial(null)
          setFreeOrFreemium(null)
          setAiBlurb("")
          return
        }
        setSponsoredOrTrial(resp.sponsoredOrTrial)
        setFreeOrFreemium(resp.freeOrFreemium)
        setAiBlurb(resp.aiBlurb)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Unknown error")
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query])

  const canRender = useMemo(() => {
    return isOpen && !!sponsoredOrTrial && !!freeOrFreemium
  }, [freeOrFreemium, isOpen, sponsoredOrTrial])

  if (!isOpen) return null

  return (
    <div className="pointer-events-none fixed right-0 top-0 z-[2147483647] h-full w-full">
      <div className="pointer-events-auto absolute right-5 top-24">
        <ScoutPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          query={query}
          loading={loading}
          error={error}
          sponsoredOrTrial={sponsoredOrTrial}
          freeOrFreemium={freeOrFreemium}
          aiBlurb={aiBlurb}
        />
      </div>
    </div>
  )
}
