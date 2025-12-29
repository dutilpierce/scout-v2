// src/data/tools.ts

export type ToolKind = "sponsored" | "free" | "trial"

export type Tool = {
  id: string
  kind: ToolKind

  name: string
  tagline: string

  // Primary destination
  url: string

  // Optional CTA override (UI reads these)
  ctaUrl?: string
  ctaLabel?: string

  // Optional UX fields used by ScoutPanel
  badge?: string // "SPONSORED" / "FREE" / "TRIAL"
  rating?: number
  miniPreview?: string // used ONLY for sponsored collapsed mini-preview
  scoutSays?: string // used ONLY when expanded

  // Scoring
  keywords?: string[]
  features?: string[]
}

export const TOOLS: Tool[] = [
  // --- Sponsored (top) ---
  {
    id: "routegenix-ai",
    kind: "sponsored",
    name: "RouteGenix AI",
    tagline: "The #1 tool for optimizing complex, multi-stop routes.",
    url: "https://example.com/routegenix",
    ctaUrl: "https://example.com/routegenix",
    ctaLabel: "Visit Site",
    badge: "SPONSORED",
    rating: 4.9,
    miniPreview:
      "Optimizes multi-stop routing, delivery sequences, and time windows for maximum efficiency.",
    scoutSays:
      "Great for multi-stop routing, delivery sequences, and time-window constraints. Prioritizes route efficiency and operational clarity.",
    keywords: ["routing", "route", "delivery", "multi-stop", "optimizer", "itinerary"],
    features: ["time windows", "route optimization", "multi-stop planning"]
  },

  // --- Free (middle) ---
  {
    id: "wonderplan",
    kind: "free",
    name: "Wonderplan",
    tagline: "AI itineraries tailored to your preferences.",
    url: "https://example.com/wonderplan",
    ctaUrl: "https://example.com/wonderplan",
    ctaLabel: "Explore Tool",
    badge: "FREE",
    rating: 4.7,
    scoutSays:
      "Strong free-tier for itinerary generation and day plans. Great default if you want quick structure and pacing without committing to a paid tool.",
    keywords: ["trip", "travel", "itinerary", "planning", "vacation", "schedule"],
    features: ["day plans", "itinerary builder", "recommendations"]
  },

  // --- Trial/Paid (bottom) ---
  {
    id: "tripplanner-ai",
    kind: "trial",
    name: "TripPlanner.ai",
    tagline: "Smarter routes and better days on the go.",
    url: "https://example.com/tripplanner",
    ctaUrl: "https://example.com/tripplanner",
    ctaLabel: "Explore Tool",
    badge: "TRIAL",
    rating: 4.9,
    scoutSays:
      "Best if you want higher-end itinerary optimization and guidance over multiple days, especially if you value routing and pacing refinements.",
    keywords: ["trip", "planner", "travel", "route", "optimize", "plan"],
    features: ["routing", "multi-day planning", "optimization"]
  }
]
