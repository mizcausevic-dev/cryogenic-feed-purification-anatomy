import React from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  StepBack,
  StepForward,
  Layers,
  Zap,
  Cpu,
  Eye,
  AlertTriangle,
} from 'lucide-react'
import { SCENES, TOTAL_FRAMES, FPS, computeFrameState } from '../data/explainerTimeline'
import { trackCanonicalEvent } from '../utils/analytics'

interface TimelineControllerProps {
  frame: number
  isPlaying: boolean
  playbackSpeed: number
  onFrameChange: (newFrame: number) => void
  onTogglePlay: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
  overlayFilters: {
    showTransport: boolean
    showEnergy: boolean
    showControl: boolean
    showCutaway: boolean
    showLosses: boolean
  }
  onToggleOverlay: (key: keyof TimelineControllerProps['overlayFilters']) => void
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  frame,
  isPlaying,
  playbackSpeed,
  onFrameChange,
  onTogglePlay,
  onReset,
  onSpeedChange,
  overlayFilters,
  onToggleOverlay,
}) => {
  const state = computeFrameState(frame)

  const handleSceneSelect = (startFrame: number, sceneId: string) => {
    onFrameChange(startFrame)
    trackCanonicalEvent('content_engagement_click', {
      content_type: 'scene_bookmark',
      cta_target: sceneId,
      placement: 'timeline_controller',
    })
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-[#111927]/95 p-4 shadow-xl backdrop-blur-md">
      {/* Scene Segment Bar (Frames 0-1019) */}
      <div className="mb-3 grid grid-cols-1 gap-1.5 sm:grid-cols-5">
        {SCENES.map((s) => {
          const isActive = state.scene.index === s.index
          const isCompleted = frame > s.endFrame
          const scenePct = isActive
            ? Math.round(state.sceneProgress * 100)
            : isCompleted
              ? 100
              : 0

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSceneSelect(s.startFrame, s.id)}
              className={`group relative overflow-hidden rounded-lg border p-2.5 text-left transition-all ${
                isActive
                  ? 'border-[#00E5FF] bg-[#0B1019] shadow-[0_0_20px_rgba(0,229,255,0.12)]'
                  : 'border-slate-800/90 bg-[#0B1019]/60 hover:border-slate-700'
              }`}
            >
              <div
                className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-[#00E5FF] transition-all"
                style={{ width: `${scenePct}%` }}
              />
              <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-slate-400">
                <span className={isActive ? ' font-bold text-[#00E5FF]' : ''}>
                  0{s.index} // {s.startSec}–{s.endSec}s
                </span>
                <span>
                  F{s.startFrame}–{s.endFrame}
                </span>
              </div>
              <div className="mt-1 truncate text-xs font-semibold text-slate-100 group-hover:text-[#00E5FF]">
                {s.title}
              </div>
            </button>
          )
        })}
      </div>

      {/* Precision Frame Scrubber */}
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-xs text-slate-400">
          <span>
            FRAME SCRUBBER: <strong className="text-[#00E5FF]">{frame}</strong> / {TOTAL_FRAMES - 1}
          </span>
          <span>
            ELAPSED: <strong className="text-[#FFD166]">{(frame / FPS).toFixed(2)}s</strong> / 34.00s
            (30 FPS LOCKED)
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={TOTAL_FRAMES - 1}
          value={frame}
          onChange={(e) => onFrameChange(Number(e.target.value))}
          aria-label="Scrub frame index from 0 to 1019"
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#00E5FF]"
        />
      </div>

      {/* Controls & Explanatory Layer Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className="flex items-center gap-2 rounded-lg bg-[#00E5FF] px-4 py-2 font-mono text-xs font-bold text-[#0B1019] transition hover:bg-[#33ecff]"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'PAUSE' : 'PLAY 30FPS'}
          </button>

          <button
            type="button"
            onClick={() => onFrameChange(Math.max(0, frame - 1))}
            title="Step Back 1 Frame"
            className="rounded-lg border border-slate-700 bg-[#0B1019] p-2 text-slate-200 hover:border-[#00E5FF] hover:text-[#00E5FF]"
          >
            <StepBack className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onFrameChange(Math.min(TOTAL_FRAMES - 1, frame + 1))}
            title="Step Forward 1 Frame"
            className="rounded-lg border border-slate-700 bg-[#0B1019] p-2 text-slate-200 hover:border-[#00E5FF] hover:text-[#00E5FF]"
          >
            <StepForward className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onReset}
            title="Reset to Frame 0"
            className="rounded-lg border border-slate-700 bg-[#0B1019] p-2 text-slate-200 hover:border-[#FFD166] hover:text-[#FFD166]"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <div className="ml-2 flex items-center rounded-lg border border-slate-800 bg-[#0B1019] p-0.5 font-mono text-xs">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onSpeedChange(spd)}
                className={`rounded-md px-2.5 py-1 transition ${
                  playbackSpeed === spd
                    ? 'bg-slate-800 font-bold text-[#00E5FF]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Explanatory Overlay Layer Switches */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleOverlay('showTransport')}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition ${
              overlayFilters.showTransport
                ? 'border-[#00E5FF]/60 bg-[#00E5FF]/10 text-[#00E5FF]'
                : 'border-slate-800 bg-[#0B1019] text-slate-500'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Transport (#00E5FF)
          </button>

          <button
            type="button"
            onClick={() => onToggleOverlay('showEnergy')}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition ${
              overlayFilters.showEnergy
                ? 'border-[#FFD166]/60 bg-[#FFD166]/10 text-[#FFD166]'
                : 'border-slate-800 bg-[#0B1019] text-slate-500'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            Energy/Actuation (#FFD166)
          </button>

          <button
            type="button"
            onClick={() => onToggleOverlay('showControl')}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition ${
              overlayFilters.showControl
                ? 'border-[#9D4EDD]/60 bg-[#9D4EDD]/10 text-[#9D4EDD]'
                : 'border-slate-800 bg-[#0B1019] text-slate-500'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            Control/State (#9D4EDD)
          </button>

          <button
            type="button"
            onClick={() => onToggleOverlay('showCutaway')}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition ${
              overlayFilters.showCutaway
                ? 'border-slate-500 bg-slate-800 text-slate-100'
                : 'border-slate-800 bg-[#0B1019] text-slate-500'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Bed Cutaway
          </button>

          <button
            type="button"
            onClick={() => onToggleOverlay('showLosses')}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition ${
              overlayFilters.showLosses
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-[#0B1019] text-slate-500'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Losses Ledger
          </button>
        </div>
      </div>
    </div>
  )
}
