// src/content.tsx

import React, { useEffect, useMemo, useState } from "react"
import { ScoutPanel } from "~components/ScoutPanel"
import type { Tool } from "~data/tools"

function getQueryFromPage(): string {
  // Google query param (q=...) first
  try {
    const url = new URL(window.location.href)
    const q = url.searchParams.get("q")
    if (q && q.trim()) return q.trim()
  } catch {
    // ignore
  }

  // fallback: selected text
  const sel = window.getSelection?.()?.toString?.()?.trim()
  if (sel) return sel

  return ""
}

type GetRecsResponse = {
  sponsoredTool: Tool | null
  freeTool: Tool | null
  trialTool: Tool | null
}

export default function Content() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [sponsoredTool, setSponsoredTool] = useState<Tool | null>(null)
  const [freeTool, setFreeTool] = useState<Tool | null>(null)
  const [trialTool, setTrialTool] = useState<Tool | null>(null)

  // keep query in sync with navigation
  useEffect(() => {
    const update = () => setQuery(getQueryFromPage())
    update()

    window.addEventListener("popstate", update)
    window.addEventListener("hashchange", update)
    return () => {
      window.removeEventListener("popstate", update)
      window.removeEventListener("hashchange", update)
    }
  }, [])

  // load recs when opening or query changes while open
  useEffect(() => {
    let cancelled = false
    if (!open) return

    ;(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = (await chrome.runtime.sendMessage({
          type: "SCOUT_GET_RECS",
          query
        })) as GetRecsResponse

        if (cancelled) return

        setSponsoredTool(res?.sponsoredTool ?? null)
        setFreeTool(res?.freeTool ?? null)
        setTrialTool(res?.trialTool ?? null)
      } catch (e: any) {
        if (cancelled) return
        setError(e?.message ? String(e.message) : "Failed to load recommendations.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [open, query])

  const ui = useMemo(() => {
    return (
      <div className="scout-launcher">
        <button
          className="scout-launcher-btn"
          type="button"
          aria-label="Toggle Scout"
          onClick={() => setOpen((v) => !v)}>
          <span className="scout-launcher-icon" aria-hidden="true" />
          <span className="scout-launcher-text">Scout</span>
        </button>

        {open ? (
          <div className="scout-root">
            <div className="scout-panel-shell">
              <ScoutPanel
                query={query}
                sponsoredTool={sponsoredTool}
                freeTool={freeTool}
                trialTool={trialTool}
                loading={loading}
                error={error}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        ) : null}
      </div>
    )
  }, [open, query, sponsoredTool, freeTool, trialTool, loading, error])

  return ui
}
