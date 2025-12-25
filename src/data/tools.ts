export type ToolTier = "FREE" | "FREEMIUM" | "TRIAL" | "SPONSORED"

export type Tool = {
  id: string
  name: string
  tagline: string
  description: string
  rating: number
  url: string
  tier: ToolTier
  categories: string[]
  keywords: string[]
  features: string[]
}

// Minimal seed catalog. Replace with your real tool set.
// Matching uses keywords + categories.
export const tools: Tool[] = [
  {
    id: "routegenix-ai",
    name: "RouteGenix AI",
    tagline: "The #1 tool for optimizing complex, multi-stop routes.",
    description: "Route optimization and planning for multi-stop trips and itineraries.",
    rating: 4.9,
    url: "https://example.com/routegenix",
    tier: "SPONSORED",
    categories: ["travel", "routing", "logistics"],
    keywords: ["route", "itinerary", "optimize", "multi-stop", "trip", "travel", "maps"],
    features: [
      "Multi-stop route optimization",
      "Time-window constraints",
      "Export to maps",
      "Team collaboration"
    ]
  },
  {
    id: "wonderplan",
    name: "Wonderplan",
    tagline: "AI itineraries tailored to your preferences.",
    description: "Generate personalized travel itineraries with attractions, restaurants, and activities.",
    rating: 4.7,
    url: "https://example.com/wonderplan",
    tier: "FREE",
    categories: ["travel", "planning"],
    keywords: ["itinerary", "travel", "plan", "trip", "paris", "things to do"],
    features: [
      "Preference-based itinerary",
      "Attraction suggestions",
      "Restaurant recommendations",
      "Day-by-day schedule"
    ]
  },
  {
    id: "tripplanner-ai",
    name: "TripPlanner.ai",
    tagline: "Smarter routes and better days on the go.",
    description: "Create optimized itineraries with routing and day plans.",
    rating: 4.9,
    url: "https://example.com/tripplanner",
    tier: "TRIAL",
    categories: ["travel", "routing", "planning"],
    keywords: ["itinerary", "route", "optimize", "trip", "travel", "planner"],
    features: [
      "Free trial with premium exports",
      "Route optimization",
      "Calendar sync",
      "Shareable plans"
    ]
  },
  {
    id: "noteboard",
    name: "NoteBoard",
    tagline: "Summarize and organize research instantly.",
    description: "AI research assistant for notes, summaries, and source organization.",
    rating: 4.6,
    url: "https://example.com/noteboard",
    tier: "FREEMIUM",
    categories: ["research", "writing"],
    keywords: ["summarize", "notes", "research", "paper", "sources", "outline"],
    features: [
      "One-click summaries",
      "Citation capture",
      "Outline generation",
      "Export to Docs"
    ]
  },
  {
    id: "devpilot",
    name: "DevPilot",
    tagline: "Code assistance for building and debugging.",
    description: "AI coding helper for refactors, debugging, and test generation.",
    rating: 4.8,
    url: "https://example.com/devpilot",
    tier: "TRIAL",
    categories: ["developer", "coding"],
    keywords: ["code", "typescript", "react", "debug", "chrome extension", "plasmo"],
    features: [
      "Refactor suggestions",
      "Unit test generation",
      "Error explanations",
      "PR summaries"
    ]
  },
  {
    id: "designspark",
    name: "DesignSpark",
    tagline: "Quick mockups and UI suggestions.",
    description: "AI design assistant for UI copy, wireframes, and design systems.",
    rating: 4.5,
    url: "https://example.com/designspark",
    tier: "FREE",
    categories: ["design", "ui"],
    keywords: ["design", "ui", "layout", "branding", "colors", "fonts"],
    features: [
      "Wireframe prompts",
      "Color palette ideas",
      "Component suggestions",
      "Copy refinement"
    ]
  }
]
