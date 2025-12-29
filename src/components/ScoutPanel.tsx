// src/components/ScoutPanel.tsx
import React, { useState } from "react"

function ToolCard({ slot, tool, expanded, onToggle, allowMiniPreview }: any) {
  if (!tool) return null
  
  return (
    <div className={`scout-card scout-${slot} ${expanded ? "is-expanded" : "is-collapsed"}`}>
      <div className="scout-title-row">
        <h3 className="scout-title">{tool.name}</h3>
      </div>

      <div className="scout-badge-row">
        <span className={`scout-badge ${slot}`}>{tool.badge || slot.toUpperCase()}</span>
        {tool.rating && <span className="scout-rating">★ {tool.rating.toFixed(1)}</span>}
      </div>

      <p className="scout-tagline" style={{margin: '0 0 8px 0', fontSize: '14px', color: '#475569'}}>{tool.tagline}</p>

      {/* FIXED TOGGLE LOGIC: Now properly collapses */}
      <button className="scout-toggle" onClick={onToggle} type="button">
        {expanded ? "Show Less" : "Details"}
      </button>

      {!expanded && allowMiniPreview && (
        <div className="scout-mini-preview" style={{fontSize: '13px', marginTop: '10px', background: 'rgba(0,0,0,0.03)', padding: '8px', borderRadius: '8px'}}>
          {tool.miniPreview || tool.tagline}
        </div>
      )}

      {expanded && (
        <div className="scout-card-body">
          <a className="scout-cta" href={tool.url} target="_blank" rel="noreferrer">
            {tool.ctaLabel || "Open Tool"}
          </a>
          {tool.scoutSays && (
            <div className="scout-says">
              <div className="scout-says-title">Scout Says</div>
              <div className="scout-says-text">"{tool.scoutSays}"</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ScoutPanel({ sponsoredTool, freeTool, trialTool, loading, onClose }: any) {
  const [activeCard, setActiveCard] = useState<string | null>("free")

  const handleToggle = (clicked: string) => {
    // If clicking the same card, collapse it. Otherwise, expand the new one.
    setActiveCard(activeCard === clicked ? null : clicked)
  }

  return (
    <div className="scout-panel">
      <div className="scout-header">
        <div className="scout-header-left">
          <div className="scout-logo"></div>
          <h2 className="scout-h-title">Scout</h2>
        </div>
        <button className="scout-close" onClick={onClose} aria-label="Close">×</button>
      </div>

      <div className="scout-body">
        {loading && <div style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>Finding options...</div>}

        <ToolCard 
          slot="sponsored" 
          tool={sponsoredTool} 
          expanded={activeCard === "sponsored"} 
          onToggle={() => handleToggle("sponsored")} 
          allowMiniPreview 
        />
        
        <ToolCard 
          slot="free" 
          tool={freeTool} 
          expanded={activeCard === "free"} 
          onToggle={() => handleToggle("free")} 
        />
        
        <ToolCard 
          slot="trial" 
          tool={trialTool} 
          expanded={activeCard === "trial"} 
          onToggle={() => handleToggle("trial")} 
        />
      </div>
    </div>
  )
}