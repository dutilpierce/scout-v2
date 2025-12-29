// src/components/ScoutPanel.tsx
import React, { useState } from "react"

function ToolCard({ slot, tool, expanded, onToggle, allowMiniPreview }: any) {
  if (!tool) return null
  
  return (
    <div className={`scout-card scout-${slot}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{tool.name}</h3>
        {tool.rating && <span className="scout-rating">★ {tool.rating.toFixed(1)}</span>}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <span className={`scout-badge ${slot}`}>{tool.badge || slot.toUpperCase()}</span>
      </div>

      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>{tool.tagline}</p>

      <button className="scout-toggle" onClick={onToggle} type="button">
        {expanded ? "Show Less" : "Details"}
      </button>

      {!expanded && allowMiniPreview && (
        <div className="scout-mini-preview">
          {tool.miniPreview || tool.tagline}
        </div>
      )}

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <a className="scout-cta" href={tool.url} target="_blank" rel="noreferrer">
              {tool.ctaLabel || "Explore"}
            </a>
          </div>
          {tool.scoutSays && (
            <div className="scout-says">
              <div className="scout-says-title">Scout Says</div>
              <div style={{ fontStyle: 'italic', fontSize: '12px' }}>"{tool.scoutSays}"</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ScoutPanel({ sponsoredTool, freeTool, trialTool, loading, onClose }: any) {
  const [activeCard, setActiveCard] = useState<string>("free")

  const handleToggle = (clicked: string) => {
    setActiveCard(activeCard === clicked ? "free" : clicked)
  }

  return (
    <div className="scout-panel">
      <div className="scout-header">
        <div className="scout-header-left">
          <div className="scout-logo-icon"></div>
          <h2 className="scout-h-title">Scout</h2>
        </div>
        <button className="scout-close" onClick={onClose} aria-label="Close">×</button>
      </div>

      <div className="scout-body">
        {loading && <div style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: '#94a3b8' }}>Syncing...</div>}

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