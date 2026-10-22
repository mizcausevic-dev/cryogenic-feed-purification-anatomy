import { useEffect, useState } from 'react'
import {
  Activity,
  BookOpen,
  Code2,
  ExternalLink,
  Film,
  Layers,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { CryoAnatomyStage } from './components/CryoAnatomyStage'
import { TimelineController } from './components/TimelineController'
import { MediumArticleSection } from './components/MediumArticleSection'
import {
  computeFrameState,
  FPS,
  SCENES,
  TOTAL_FRAMES,
} from './data/explainerTimeline'
import {
  type LoggedEvent,
  subscribeEventLog,
  trackCanonicalEvent,
} from './utils/analytics'

export function App() {
  const [frame, setFrame] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'explainer' | 'article' | 'architecture'>('explainer')
  const [overlayFilters, setOverlayFilters] = useState({
    showTransport: true,
    showEnergy: true,
    showControl: true,
    showCutaway: true,
    showLosses: true,
  })
  const [events, setEvents] = useState<LoggedEvent[]>([])

  useEffect(() => {
    return subscribeEventLog(setEvents)
  }, [])

  // Locked 30 fps deterministic playback loop
  useEffect(() => {
    if (!isPlaying) return
    let lastTime = performance.now()
    let rafId = 0
    const frameIntervalMs = 1000 / (FPS * playbackSpeed)

    const tick = (now: number) => {
      const elapsed = now - lastTime
      if (elapsed >= frameIntervalMs) {
        const framesToAdvance = Math.max(1, Math.floor(elapsed / frameIntervalMs))
        lastTime = now - (elapsed % frameIntervalMs)
        setFrame((prev) => {
          const next = (prev + framesToAdvance) % TOTAL_FRAMES
          if (next === TOTAL_FRAMES - 1) {
            trackCanonicalEvent('tool_complete', {
              content_type: 'motion_explainer_1020_frames',
              placement: 'canvas_stage',
            })
          }
          return next
        })
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isPlaying, playbackSpeed])

  const state = computeFrameState(frame)

  const handleToggleOverlay = (key: keyof typeof overlayFilters) => {
    setOverlayFilters((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      trackCanonicalEvent('content_engagement_click', {
        content_type: 'overlay_filter_toggle',
        cta_target: `${key}:${next[key] ? 'on' : 'off'}`,
        placement: 'stage_controls',
      })
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#0B1019] text-slate-100 selection:bg-[#00E5FF] selection:text-[#0B1019]">
      {/* Top Infinite Marquee Ticker (Motion Pattern A) */}
      <div className="overflow-hidden border-b border-slate-800/80 bg-[#070B12] py-1.5 font-mono text-[11px] text-slate-400">
        <div className="marquee-track flex w-max items-center gap-8">
          {[1, 2].map((dup) => (
            <div key={dup} className="flex items-center gap-8">
              <span className="flex items-center gap-2 text-[#00E5FF]">
                <Sparkles className="h-3 w-3" />
                VERTICAL: INDUSTRIAL GASES &amp; CRYOGENICS
              </span>
              <span>•</span>
              <span>DURATION: 34.00 SECONDS // 30 FPS // 1,020 FRAMES (INDEXED 0–1019)</span>
              <span>•</span>
              <span className="text-[#FFD166]">
                BASIS: AIR PRODUCTS CRYOGENIC NITROGEN PLANT ARCHITECTURE
              </span>
              <span>•</span>
              <span className="text-[#9D4EDD]">
                GUARDRAIL: ADSORBENTS &amp; CYCLES VARY // NO REGENERATION RECIPE OR TOTAL REMOVAL GUARANTEE
              </span>
              <span>•</span>
              <span>STAGE: #0B1019 // MATERIAL: #344257 // TRANSPORT: #00E5FF // ENERGY: #FFD166 // CONTROL: #9D4EDD</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0B1019]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 font-mono text-sm font-bold text-[#00E5FF]">
              N2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00E5FF]">
                  ANATOMY EXPLAINER // 1,020 FRAMES
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                  30 FPS DETERMINISTIC
                </span>
              </div>
              <h1 className="text-base font-bold tracking-tight text-slate-50 sm:text-lg">
                Cryogenic Feed Purification Upstream of Cold Box
              </h1>
            </div>
          </div>

          {/* View Switcher Tabs + Standalone Artifacts */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('explainer')
                trackCanonicalEvent('self_serve_cta_click', {
                  cta_target: 'tab_explainer',
                  placement: 'top_nav',
                })
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-mono text-xs font-semibold transition ${
                activeTab === 'explainer'
                  ? 'bg-[#00E5FF] text-[#0B1019]'
                  : 'border border-slate-800 bg-[#111927] text-slate-300 hover:border-slate-700'
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              1,020-Frame Explainer
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('article')
                trackCanonicalEvent('self_serve_cta_click', {
                  cta_target: 'tab_medium_article',
                  placement: 'top_nav',
                })
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-mono text-xs font-semibold transition ${
                activeTab === 'article'
                  ? 'bg-[#00E5FF] text-[#0B1019]'
                  : 'border border-slate-800 bg-[#111927] text-slate-300 hover:border-slate-700'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Medium Article + Hero Image
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('architecture')
                trackCanonicalEvent('self_serve_cta_click', {
                  cta_target: 'tab_architecture_spec',
                  placement: 'top_nav',
                })
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-mono text-xs font-semibold transition ${
                activeTab === 'architecture'
                  ? 'bg-[#00E5FF] text-[#0B1019]'
                  : 'border border-slate-800 bg-[#111927] text-slate-300 hover:border-slate-700'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              Spec &amp; Telemetry
            </button>

            <a
              href="./dashboard-Cursor.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackCanonicalEvent('self_serve_cta_click', {
                  cta_target: 'open_7theme_dashboard',
                  placement: 'top_nav',
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#9D4EDD]/50 bg-[#9D4EDD]/10 px-3 py-2 font-mono text-xs font-semibold text-[#9D4EDD] transition hover:bg-[#9D4EDD]/20"
            >
              7-Theme Dashboard
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === 'explainer' && (
          <div className="space-y-6">
            {/* Interactive 2D/Isometric Cutaway Canvas Stage */}
            <CryoAnatomyStage frame={frame} overlayFilters={overlayFilters} />

            {/* Frame Scrubber & Layer Controls */}
            <TimelineController
              frame={frame}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onFrameChange={(f) => {
                setIsPlaying(false)
                setFrame(f)
              }}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              onReset={() => {
                setIsPlaying(false)
                setFrame(0)
              }}
              onSpeedChange={(spd) => setPlaybackSpeed(spd)}
              overlayFilters={overlayFilters}
              onToggleOverlay={handleToggleOverlay}
            />

            {/* Active Scene Deep-Dive Cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Card 1: Active Scene Mechanism */}
              <div className="rounded-xl border border-slate-800 bg-[#111927]/90 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#00E5FF]">
                    ACTIVE SCENE MECHANISM
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-300">
                    Frames {state.scene.startFrame}–{state.scene.endFrame}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-slate-100">{state.scene.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {state.scene.mechanismSummary}
                </p>
                <div className="mt-4 border-t border-slate-800/80 pt-3 font-mono text-xs text-slate-400">
                  <div className="text-[#00E5FF]">PATHWAY:</div>
                  <div className="mt-0.5 text-slate-300">{state.scene.activePathway}</div>
                </div>
              </div>

              {/* Card 2: Explanatory Overlay Separation */}
              <div className="rounded-xl border border-slate-800 bg-[#111927]/90 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#FFD166]">
                    CONTROL, ENERGY &amp; STATE OVERLAYS
                  </span>
                  <Layers className="h-4 w-4 text-[#FFD166]" />
                </div>
                <div className="mt-3 space-y-3 text-xs">
                  <div className="rounded-lg border border-[#9D4EDD]/30 bg-[#0B1019] p-3">
                    <div className="font-mono font-bold text-[#9D4EDD]">
                      CONTROL / STATE (#9D4EDD)
                    </div>
                    <p className="mt-1 text-slate-300">{state.scene.controlState}</p>
                  </div>
                  <div className="rounded-lg border border-[#FFD166]/30 bg-[#0B1019] p-3">
                    <div className="font-mono font-bold text-[#FFD166]">
                      ENERGY / ACTUATION (#FFD166)
                    </div>
                    <p className="mt-1 text-slate-300">{state.scene.energyState}</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Technical Limits & Visible Components */}
              <div className="rounded-xl border border-slate-800 bg-[#111927]/90 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#9D4EDD]">
                    LIMITS, UNCERTAINTY &amp; COMPONENTS
                  </span>
                  <ShieldCheck className="h-4 w-4 text-[#00E5FF]" />
                </div>
                <div className="mt-3 rounded-lg border border-amber-500/30 bg-[#0B1019] p-3 text-xs text-slate-300">
                  <span className="font-mono font-bold text-amber-300">BOUNDARY LIMIT: </span>
                  {state.scene.uncertaintyAndLimits}
                </div>
                <div className="mt-3">
                  <div className="font-mono text-[11px] font-semibold text-slate-400">
                    IDENTIFIED SCENE COMPONENTS:
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {state.scene.visibleComponents.map((comp) => (
                      <span
                        key={comp}
                        className="rounded border border-slate-700/80 bg-[#0B1019] px-2 py-1 font-mono text-[11px] text-slate-200"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Medium Article & Hero Image below the Explainer so both are immediately accessible */}
            <div className="pt-6">
              <MediumArticleSection
                onJumpToFrame={(targetFrame) => {
                  setIsPlaying(false)
                  setFrame(targetFrame)
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'article' && (
          <MediumArticleSection
            onJumpToFrame={(targetFrame) => {
              setActiveTab('explainer')
              setIsPlaying(false)
              setFrame(targetFrame)
            }}
          />
        )}

        {activeTab === 'architecture' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-[#111927] p-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#00E5FF]">
                <Activity className="h-4 w-4" />
                CAMERA &amp; TIMING SPECIFICATION (1,020 FRAMES @ 30 FPS)
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-100">
                Deterministic Frame-Locked State Machine
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Every frame index from 0 to 1019 resolves through a pure mathematical function without stateful drift. Below is the verified 5-scene breakdown:
              </p>
              <div className="mt-4 space-y-3">
                {SCENES.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-lg border border-slate-800 bg-[#0B1019] p-3.5 text-xs"
                  >
                    <div className="flex justify-between font-mono font-bold text-[#00E5FF]">
                      <span>
                        Frames {s.startFrame}–{s.endFrame} | {s.startSec}–{s.endSec}s
                      </span>
                      <span className="text-[#FFD166]">{s.title}</span>
                    </div>
                    <p className="mt-1.5 text-slate-300">{s.mechanismSummary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800 bg-[#111927] p-6">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#FFD166]">
                  <Terminal className="h-4 w-4" />
                  CANONICAL ANALYTICS EVENT STREAM (DATA GOVERNANCE)
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Interactive scrubbing, scene selection, and overlay toggles emit canonical events from the fixed event dictionary (`content_engagement_click`, `tool_complete`, `self_serve_cta_click`).
                </p>
                <div className="mt-4 max-h-60 overflow-y-auto rounded-lg border border-slate-800 bg-[#0B1019] p-3 font-mono text-[11px]">
                  {events.length === 0 ? (
                    <div className="text-slate-500">
                      Interact with the timeline scrubber or scene buttons to log canonical events...
                    </div>
                  ) : (
                    events.map((ev) => (
                      <div
                        key={ev.id}
                        className="border-b border-slate-800/70 py-1.5 last:border-none"
                      >
                        <span className="text-slate-500">[{ev.timestamp}]</span>{' '}
                        <span className="font-bold text-[#00E5FF]">{ev.event}</span>{' '}
                        <span className="text-slate-300">
                          target={ev.payload.cta_target || ev.payload.content_type}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#111927] p-6">
                <h3 className="font-mono text-xs font-bold uppercase text-[#9D4EDD]">
                  Standalone Single-File Artifacts Included in Repo
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  <li>
                    • <code className="text-[#00E5FF]">MEDIUM-ARTICLE-Cursor.md</code> — Complete SEO/GEO/AEO Medium publication article with mathematical formatting and FAQ schema concepts.
                  </li>
                  <li>
                    • <code className="text-[#00E5FF]">public/assets/cryo-purification-hero.svg</code> &amp; <code className="text-[#00E5FF]">.png</code> — High-resolution 1600x840 anatomical hero diagram.
                  </li>
                  <li>
                    • <code className="text-[#FFD166]">public/dashboard-Cursor.html</code> — 7-theme executive product strategy &amp; architecture dashboard (Bento Grid, Cosmic Cyber, Swiss Architect, Aqua Web 2.0, Pop Brutalist, Steel Tactical, Parchment).
                  </li>
                  <li>
                    • <code className="text-[#9D4EDD]">public/visualization-Cursor.html</code> — Standalone zero-dependency HTML state-machine &amp; timeline protocol visualizer.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-[#070B12] py-6 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <strong className="font-mono text-slate-200">
              CRYOGENIC FEED PURIFICATION // ANATOMY MOTION EXPLAINER
            </strong>
            <p className="mt-1 text-slate-500">
              Mechanism basis: Air Products Cryogenic Nitrogen Plant. Original illustrative camera, palette, and 1,020-frame timing. Not a certified design or operational manual.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[11px]">
            <a
              href="./dashboard-Cursor.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00E5FF] hover:underline"
            >
              7-Theme Dashboard
            </a>
            <a
              href="./visualization-Cursor.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFD166] hover:underline"
            >
              Protocol Visualizer
            </a>
            <a
              href="./assets/cryo-purification-hero.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9D4EDD] hover:underline"
            >
              Hero Diagram SVG
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
