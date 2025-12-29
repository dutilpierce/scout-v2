// src/content.tsx
import React, { useEffect, useState } from "react"
import { ScoutPanel } from "~components/ScoutPanel"
import type { Tool } from "~data/tools"

// FIX: Inject CSS into the Shadow DOM bubble to prevent Google's style bleed
import type { PlasmoGetStyle } from "plasmo"
import styleText from "data-text:~style.css"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  // 'all: initial' acts as a hard reset for all Google-inherited styles
  style.textContent = `
    :host { all: initial !important; display: block !important; }
    ${styleText}
  `
  return style
}

export default function Content() {
  const [tools, setTools] = useState({ sponsored: null, free: null, trial: null })
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true)
      const q = new URLSearchParams(window.location.search).get("q") || ""
      try {
        const res = await chrome.runtime.sendMessage({ type: "SCOUT_GET_RECS", query: q })
        setTools({ sponsored: res?.sponsoredTool, free: res?.freeTool, trial: res?.trialTool })
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [])

  if (!visible) return null

  return (
    <div className="scout-outer-wrapper">
      <ScoutPanel
        sponsoredTool={tools.sponsored}
        freeTool={tools.free}
        trialTool={tools.trial}
        loading={loading}
        onClose={() => setVisible(false)}
      />
    </div>
  )
}