import React, { useMemo, useState } from "react"
import type { Tool } from "~data/tools"

function IconSparkle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2l1.2 4.1L17 7.3l-3.8 1.1L12 12l-1.2-3.6L7 7.3l3.8-1.2L12 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5 13l.7 2.3L8 16l-2.3.7L5 19l-.7-2.3L2 16l2.3-.7L5 13z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.7 2.3L22 16l-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconExternal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14 5h5v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14L19 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconStar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2l3.1 6.6 7.3 1-5.2 5.1 1.3 7.2L12 18.9 5.5 21.9l1.3-7.2L1.6 9.6l7.3-1L12 2z" />
    </svg>
  )
}

function Badge({ label, tone }: { label: string; tone: "blue" | "green" | "gold" }) {
  const toneClasses =
    tone === "blue"
      ? "text-blue-700 bg-blue-50 border-blue-200"
      : tone === "green"
        ? "text-green-700 bg-green-50 border-green-200"
        : "text-amber-800 bg-amber-50 border-amber-200"

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide ${toneClasses}`}
    >
      {label}
    </span>
  )
}

function ToolCard({
  tool,
  variant
}: {
  tool: Tool
  variant: "sponsored" | "free" | "trial"
}) {
  const [expanded, setExpanded] = useState(false)

  const badge = useMemo(() => {
    if (variant === "sponsored") return { label: "SPONSORED", tone: "gold" as const }
    if (variant === "trial") return { label: "FREE TRIAL", tone: "green" as const }
    return { label: tool.tier === "FREEMIUM" ? "FREEMIUM" : "FREE", tone: "blue" as const }
  }, [tool.tier, variant])

  const primaryCta = useMemo(() => {
    if (variant === "sponsored") return "Visit Site"
    if (variant === "trial") return "Start Free Trial"
    return "Explore Tool"
  }, [variant])

  const ctaTone = variant === "trial" ? "bg-amber-500" : variant === "sponsored" ? "bg-amber-500" : ""

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[var(--scout-shadow)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[18px] font-extrabold tracking-tight text-gray-900">
            {tool.name}
          </div>
          <div className="mt-1 text-[14px] font-medium italic text-gray-600">{tool.tagline}</div>
        </div>
        <Badge label={badge.label} tone={badge.tone} />
      </div>

      <div className="my-3 h-px w-full bg-gray-200" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <IconStar className="h-5 w-5 text-amber-500" />
          <span className="text-[14px] font-semibold">{tool.rating.toFixed(1)}</span>
        </div>

        <a
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-bold text-white ${ctaTone || "bg-amber-500"}`}
          href={tool.url}
          target="_blank"
          rel="noreferrer"
        >
          {primaryCta}
          <IconExternal className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center gap-2 text-blue-600">
          <IconSparkle className="h-5 w-5" />
          <span className="text-[16px] font-extrabold italic">Scout Says:</span>
        </div>
        <div className="mt-2 text-[15px] leading-6 text-gray-700">{tool.description}</div>

        <button
          className="mt-3 text-[13px] font-semibold text-blue-700 hover:underline"
          type="button"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Shrink" : "Expand"} features
        </button>

        {expanded && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-gray-700">
            {tool.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function ScoutPanel({
  onClose,
  query,
  loading,
  error,
  sponsoredOrTrial,
  freeOrFreemium,
  aiBlurb
}: {
  isOpen: boolean
  onClose: () => void
  query: string
  loading: boolean
  error: string | null
  sponsoredOrTrial: Tool | null
  freeOrFreemium: Tool | null
  aiBlurb: string
}) {
  const [mode, setMode] = useState<"FREE" | "TRIAL">("FREE")

  const topCard = useMemo(() => {
    if (!sponsoredOrTrial) return null
    // If the selected sponsoredOrTrial happens to be TRIAL rather than SPONSORED, we still
    // display it in the top position to mirror the reference layout.
    return sponsoredOrTrial
  }, [sponsoredOrTrial])

  const bottomCard = mode === "FREE" ? freeOrFreemium : sponsoredOrTrial

  const bottomVariant = mode === "FREE" ? "free" : "trial"

  return (
    <div className="w-[360px] select-none">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-[var(--scout-shadow)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="text-blue-600">
              <IconSparkle className="h-6 w-6" />
            </div>
            <div className="text-[18px] font-extrabold text-gray-900">Scout</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            type="button"
            aria-label="Close Scout"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-4">
          {loading && (
            <div className="mb-3 rounded-xl bg-gray-50 px-4 py-3 text-[13px] text-gray-600">
              Finding the best options for <span className="font-semibold">{query}</span>…
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && aiBlurb && (
            <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3 text-[12.5px] leading-5 text-gray-600">
              {aiBlurb}
            </div>
          )}

          {topCard && (
            <div className="mb-4 rounded-2xl border-2 border-amber-400 p-2">
              <ToolCard tool={topCard} variant="sponsored" />
            </div>
          )}

          {bottomCard && (
            <div className="mt-4">
              <ToolCard tool={bottomCard} variant={bottomVariant} />
            </div>
          )}

          <div className="mt-4">
            {mode === "FREE" ? (
              <button
                type="button"
                onClick={() => setMode("TRIAL")}
                className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[15px] font-extrabold text-amber-800 hover:bg-amber-100"
              >
                Try a Free Trial Option
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("FREE")}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-[15px] font-extrabold text-white hover:bg-blue-700"
              >
                View Free Option
              </button>
            )}
          </div>

          <div className="mt-3 text-center text-[11px] text-gray-400">
            Scout v2 • Recommendations update with your search
          </div>
        </div>
      </div>
    </div>
  )
}
