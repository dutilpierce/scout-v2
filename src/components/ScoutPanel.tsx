// src/components/ScoutPanel.tsx

import React, { useMemo, useState } from "react"
import type { Tool } from "../data/tools"

type ActiveCard = "sponsored" | "free" | "trial"

type ScoutPanelProps = {
  query: string
  sponsoredTool: Tool | null
  freeTool: Tool | null
  trialTool: Tool | null
  loading: boolean
  error?: string | null
  onClose: () => void
}

type ToolCardProps = {
  slot: ActiveCard
  tool: Tool | null
  expanded: boolean
  onToggle: () => void
  allowMiniPreview?: boolean
}

function ToolCard({ slot, tool, expanded, onToggle, allowMiniPreview }: ToolCardProps) {
  const title =
    tool?.name ??
    (slot === "sponsored" ? "Sponsored" : slot === "free" ? "Free Option" : "Trial/Paid Option")

  const tagline = tool?.tagline ?? ""
  const rating = typeof tool?.rating === "number" ? tool!.rating : null

  const url = tool?.ctaUrl ?? tool?.url ?? ""
  const ctaLabel = tool?.ctaLabel ?? "Visit Site"
  const badgeText =
    tool?.badge ?? (slot === "sponsored" ? "SPONSORED" : slot === "free" ? "FREE" : "TRIAL")

  const miniPreviewText = useMemo(() => {
    if (!tool) return ""
    if (!tool.miniPreview) return tool.tagline || ""
    return tool.miniPreview
  }, [tool])

  const scoutSaysText = tool?.scoutSays ?? ""

  return (
    <div className={`scout-card ${expanded ? "is-expanded" : "is-collapsed"} scout-${slot}`}>
      <div className="scout-card-top">
        <div className="scout-card-heading">
          <div className="scout-title-row">
            <div className="scout-title">{title}</div>
            <div className="scout-badges">
              <span className={`scout-badge ${slot}`}>{badgeText}</span>
              {rating !== null && <span className="scout-rating">★ {rating.toFixed(1)}</span>}
            </div>
          </div>

          {tagline ? <div className="scout-tagline">{tagline}</div> : null}
        </div>

        <button className="scout-toggle" onClick={onToggle} type="button">
          {expanded ? "Shrink" : "Expand"}
        </button>
      </div>

      {/* Sponsored mini-preview ONLY when collapsed */}
      {!expanded && allowMiniPreview && miniPreviewText ? (
        <div className="scout-mini-preview line-clamp-2">{miniPreviewText}</div>
      ) : null}

      {/* Expanded body */}
      {expanded ? (
        <div className="scout-card-body">
          {url ? (
            <a className="scout-cta" href={url} target="_blank" rel="noreferrer">
              {ctaLabel} <span className="scout-ext">↗</span>
            </a>
          ) : null}

          {/* Scout Says ONLY in expanded state */}
          {scoutSaysText ? (
            <div className="scout-says">
              <div className="scout-says-title">Scout Says:</div>
              <div className="scout-says-text">{scoutSaysText}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function ScoutPanel({
  query,
  sponsoredTool,
  freeTool,
  trialTool,
  loading,
  error,
  onClose
}: ScoutPanelProps) {
  // Default open card: Free
  const [activeCard, setActiveCard] = useState<ActiveCard>("free")

  return (
    <div className="scout-panel">
      {/* Fixed header */}
      <div className="scout-header">
        <div className="scout-header-left">
          <div className="scout-logo" aria-hidden="true" />
          <div className="scout-h-title">Scout</div>
        </div>

        <button className="scout-close" onClick={onClose} type="button" aria-label="Close Scout">
          ×
        </button>
      </div>

      {/* Scrollable body */}
      <div className="scout-body">
        {loading ? (
          <div className="scout-status">Finding the best options for {query ? `"${query}"` : "you"}…</div>
        ) : null}

        {error ? <div className="scout-error">{error}</div> : null}

        {/* 1) Sponsored (top) - collapsed by default; mini-preview allowed when collapsed */}
        <ToolCard
          slot="sponsored"
          tool={sponsoredTool}
          expanded={activeCard === "sponsored"}
          onToggle={() => setActiveCard((cur) => (cur === "sponsored" ? "free" : "sponsored"))}
          allowMiniPreview={true}
        />

        {/* 2) Free (middle) - expanded by default */}
        <ToolCard
          slot="free"
          tool={freeTool}
          expanded={activeCard === "free"}
          onToggle={() => setActiveCard((cur) => (cur === "free" ? "trial" : "free"))}
        />

        {/* 3) Trial/Paid (bottom) - collapsed by default */}
        <ToolCard
          slot="trial"
          tool={trialTool}
          expanded={activeCard === "trial"}
          onToggle={() => setActiveCard((cur) => (cur === "trial" ? "free" : "trial"))}
        />
      </div>
    </div>
  )
}
