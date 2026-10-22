export interface SceneDefinition {
  index: number
  id: string
  title: string
  subtitle: string
  startFrame: number
  endFrame: number
  startSec: number
  endSec: number
  cameraTarget: {
    x: number
    y: number
    zoom: number
    isoYaw: number
  }
  scaleNotice: string
  mechanismSummary: string
  activePathway: string
  controlState: string
  energyState: string
  uncertaintyAndLimits: string
  visibleComponents: string[]
}

export const TOTAL_FRAMES = 1020
export const FPS = 30
export const DURATION_SECONDS = 34

export const PALETTE = {
  stageBg: '#0B1019',
  stagePanel: '#111927',
  neutralMaterial: '#344257',
  neutralMaterialLight: '#4A5D7A',
  neutralMaterialDark: '#232D3B',
  primaryTransportCyan: '#00E5FF',
  energyActuationGold: '#FFD166',
  controlStateViolet: '#9D4EDD',
  textPrimary: '#F1F5F9',
  textMuted: '#94A3B8',
} as const

export const SCENES: SceneDefinition[] = [
  {
    index: 1,
    id: 'upstream-assembly-reveal',
    title: 'Upstream Adsorbent Assembly Reveal',
    subtitle: 'Frames 0–149 (0–5s) | Full Assembly & Measured Three-Quarter Push',
    startFrame: 0,
    endFrame: 149,
    startSec: 0,
    endSec: 5,
    cameraTarget: {
      x: 560,
      y: 340,
      zoom: 1.12,
      isoYaw: 0.22,
    },
    scaleNotice: 'Conceptual macro schematic | Time-compressed sequence | Non-dimensional geometry',
    mechanismSummary:
      'Compressed, cooled atmospheric feed air enters the front-end purification assembly upstream of the cryogenic cold box. Twin switching adsorbent vessels operate in alternating adsorption and regeneration duty so downstream cryogenic distillation receives continuous feed.',
    activePathway:
      'Compressed feed air header -> Inlet isolation manifold -> Vessel A active bed',
    controlState:
      'Sequence Controller: Cycle Step 1 (Vessel A Online Adsorption / Vessel B Standby-to-Regen)',
    energyState:
      'Upstream compression & aftercooler rejection completed; feed enters near ambient temperature under elevated pressure',
    uncertaintyAndLimits:
      'Vessel aspect ratios, valve manifolds, and piping layouts vary across plant capacities and process licensors.',
    visibleComponents: [
      'Feed Air Header',
      'Inlet Switching Manifold',
      'Adsorber Vessel A (Online)',
      'Adsorber Vessel B (Standby/Regen)',
      'Outlet Check Manifold',
      'Cryogenic Cold Box Boundary',
    ],
  },
  {
    index: 2,
    id: 'selective-water-co2-removal',
    title: 'Selective Water & CO2 Removal',
    subtitle: 'Frames 150–299 (5–10s) | Sectional Close-Up of Layered Adsorbent Bed',
    startFrame: 150,
    endFrame: 299,
    startSec: 5,
    endSec: 10,
    cameraTarget: {
      x: 420,
      y: 335,
      zoom: 1.68,
      isoYaw: 0.08,
    },
    scaleNotice: 'Sectional cutaway & Pore-scale inset (not to scale) | Slow-motion mass-transfer representation',
    mechanismSummary:
      'Inside Vessel A, upward flow traverses staged adsorbent media. The lower moisture-selective zone arrests bulk water vapor first, preventing water from displacing CO2 in the upper molecular sieve zone where trace carbon dioxide and residual hydrocarbons are captured.',
    activePathway:
      'Bottom flow distributor -> Moisture-selective layer (H2O arrest) -> Molecular sieve layer (CO2 arrest)',
    controlState:
      'Mass-Transfer Zone (MTZ) Guard: Monitoring front progression prior to bed breakthrough',
    energyState:
      'Exothermic heat of adsorption released locally along the advancing mass-transfer front',
    uncertaintyAndLimits:
      'Adsorbent formulations (activated alumina, silica gel, 13X/NaX zeolites) and layer ratios vary. No total contaminant-removal guarantee.',
    visibleComponents: [
      'Inlet Flow Distributor Screen',
      'Lower Layer: Moisture-Selective Adsorbent (H2O Front)',
      'Upper Layer: Molecular Sieve Adsorbent (CO2 Front)',
      'Active Mass-Transfer Zone (MTZ) Boundary',
      'Vessel Wall & Retaining Screen',
    ],
  },
  {
    index: 3,
    id: 'purified-feed-causal-pathway',
    title: 'Purified Feed Causal Pathway',
    subtitle: 'Frames 300–509 (10–17s) | Primary Transport vs. Control & Actuation Overlays',
    startFrame: 300,
    endFrame: 509,
    startSec: 10,
    endSec: 17,
    cameraTarget: {
      x: 640,
      y: 255,
      zoom: 1.38,
      isoYaw: 0.14,
    },
    scaleNotice: 'System transport schematic | Explanatory color overlays (not literal optical emission)',
    mechanismSummary:
      'Dry, CO2-depleted feed air exits the top of Vessel A, passes through particulate after-filtration to trap bed attrition dust, and crosses the analyzer interlock before entering the cryogenic cold box primary heat exchanger.',
    activePathway:
      'Vessel A Outlet -> Particulate After-Filter -> Analyzer Guard Point -> Cold Box Transfer Header',
    controlState:
      'Trace Analyzer & Sequence Interlock: Verifying CO2/H2O remain below downstream freeze thresholds',
    energyState:
      'Frictional pressure drop (Delta-P) across packed bed and dust filter filter elements',
    uncertaintyAndLimits:
      'Trace slip remains non-zero; analyzer response lag and filter differential pressure require continuous monitoring.',
    visibleComponents: [
      'Vessel A Top Outlet Header',
      'Particulate After-Filter Assembly',
      'Trace Moisture/CO2 Analyzer Tap (Control Overlay)',
      'Cold Box Isolation Valve (Actuation Overlay)',
      'Purified Air Feed Conduit (Primary Transport)',
    ],
  },
  {
    index: 4,
    id: 'separate-regeneration-state',
    title: 'Separate Regeneration State (Conceptual)',
    subtitle: 'Frames 510–749 (17–25s) | Depressurization, Heated Waste-N2 Sweep & Cooling',
    startFrame: 510,
    endFrame: 749,
    startSec: 17,
    endSec: 25,
    cameraTarget: {
      x: 525,
      y: 355,
      zoom: 1.44,
      isoYaw: -0.1,
    },
    scaleNotice: 'Time-compressed regeneration cycle | Qualitative thermal & concentration inset',
    mechanismSummary:
      'While Vessel A remains online, isolated Vessel B undergoes regeneration. After depressurization, low-pressure dry waste nitrogen returning from the cold box is warmed by a regeneration heater and swept counter-currently (top-to-bottom) through Vessel B to desorb CO2 and H2O to vent, followed by cooling and repressurization.',
    activePathway:
      'Cold Box Waste N2 Return -> Regeneration Heater -> Vessel B Counter-Current Sweep -> Atmos Vent',
    controlState:
      'Regeneration Sub-State Sequencer: Depressurize -> Thermal Desorption -> Cool-Down -> Repressurize',
    energyState:
      'Thermal energy input via regeneration heater (TSA) or pressure-swing purge enthalpy (PSA/PTSA)',
    uncertaintyAndLimits:
      'Regeneration recipes, temperatures, and purge-to-feed ratios are proprietary and plant-specific. No operational recipe is prescribed.',
    visibleComponents: [
      'Adsorber Vessel B (Regenerating)',
      'Dry Waste Gas Return Line',
      'Regeneration Heater Module (Energy Overlay)',
      'Counter-Current Desorption Flow Path',
      'Exhaust Silencer & Vent Stack',
      'Qualitative Regeneration Cycle Inset',
    ],
  },
  {
    index: 5,
    id: 'downstream-cold-box-protection',
    title: 'Downstream Cryogenic Equipment Protection',
    subtitle: 'Frames 750–1019 (25–34s) | System Pull-Back, Cold Box Entry & Visible Losses',
    startFrame: 750,
    endFrame: 1019,
    startSec: 25,
    endSec: 34,
    cameraTarget: {
      x: 680,
      y: 340,
      zoom: 1.0,
      isoYaw: 0.0,
    },
    scaleNotice: 'Stable full-system overview | Qualitative mass, energy & loss accounting retained',
    mechanismSummary:
      'Pulling back to the complete front-end and cold box interface shows why upstream purification is mandatory: inside the brazed aluminum plate-fin main heat exchanger and distillation column, temperatures drop to cryogenic levels where unremoved H2O or CO2 would solidify, plug micro-passages, and force a warm-up outage.',
    activePathway:
      'Purified Air -> Main Heat Exchanger (PHX) -> Cryogenic Rectification Column -> Product N2 + Waste Regen Gas',
    controlState:
      'Closed-Loop Plant Balance: Front-end switching synchronized with cold box waste gas availability',
    energyState:
      'Visible system losses retained: bed Delta-P, thermal regeneration duty, blowdown gas loss, and purge exhaust',
    uncertaintyAndLimits:
      'Adsorbent aging, hydrothermal degradation, and maldistribution gradually reduce bed capacity over multi-year operation.',
    visibleComponents: [
      'Complete Dual-Vessel Purification Skid',
      'Particulate Filter & Interlock Valve',
      'Cryogenic Cold Box Enclosure',
      'Main Plate-Fin Heat Exchanger (Micro-Channel Guarded)',
      'Cryogenic Distillation Column Schematic',
      'System Accounting & Losses Ledger',
    ],
  },
]

export interface FrameState {
  frame: number
  timeSec: number
  progress: number
  scene: SceneDefinition
  sceneProgress: number
  camera: {
    x: number
    y: number
    zoom: number
    isoYaw: number
  }
  qualitativeMetrics: {
    vesselASaturationH2O: number // 0..1 qualitative
    vesselASaturationCO2: number // 0..1 qualitative
    vesselBRegenPhase: 'DEPRESSURIZE' | 'THERMAL DESORPTION' | 'COOLING SWEEP' | 'REPRESSURIZE' | 'STANDBY'
    vesselBThermalWave: number // 0..1 position top-to-bottom
    vesselBContaminantLoad: number // 0..1 remaining
    purifiedFlowSplit: number // qualitative fraction of feed reaching cold box vs purge loss
    coldBoxSafetyStatus: string
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function getSceneForFrame(frame: number): SceneDefinition {
  const clamped = clamp(Math.floor(frame), 0, TOTAL_FRAMES - 1)
  for (const s of SCENES) {
    if (clamped >= s.startFrame && clamped <= s.endFrame) {
      return s
    }
  }
  return SCENES[SCENES.length - 1]
}

export function computeFrameState(rawFrame: number): FrameState {
  const frame = clamp(Math.floor(rawFrame), 0, TOTAL_FRAMES - 1)
  const timeSec = frame / FPS
  const progress = frame / (TOTAL_FRAMES - 1)
  const scene = getSceneForFrame(frame)
  const sceneSpan = scene.endFrame - scene.startFrame
  const sceneProgress = sceneSpan > 0 ? (frame - scene.startFrame) / sceneSpan : 0

  // Smooth camera choreography across all 1,020 frames
  let camX = 680
  let camY = 340
  let camZoom = 1.0
  let camYaw = 0.0

  if (frame <= 149) {
    // Scene 1: Establish full assembly (0-55), then measured three-quarter push toward active region (55-149)
    const pushT = smoothstep(35, 145, frame)
    camX = lerp(680, 520, pushT)
    camY = lerp(340, 340, pushT)
    camZoom = lerp(0.98, 1.18, pushT)
    camYaw = lerp(0.0, 0.24, pushT)
  } else if (frame <= 299) {
    // Scene 2: Sectional close-up on Vessel A layered bed
    const inT = smoothstep(150, 195, frame)
    camX = lerp(520, 395, inT)
    camY = lerp(340, 345, inT)
    camZoom = lerp(1.18, 1.62, inT)
    camYaw = lerp(0.24, 0.06, inT)
  } else if (frame <= 509) {
    // Scene 3: Track purified feed along top outlet, filter, analyzer, to cold box entry
    const pan1 = smoothstep(300, 360, frame)
    const pan2 = smoothstep(360, 495, frame)
    const startX = 395
    const midX = 520
    const endX = 720
    camX = frame < 360 ? lerp(startX, midX, pan1) : lerp(midX, endX, pan2)
    camY = frame < 360 ? lerp(345, 225, pan1) : lerp(225, 250, pan2)
    camZoom = frame < 360 ? lerp(1.62, 1.38, pan1) : lerp(1.38, 1.32, pan2)
    camYaw = lerp(0.06, 0.14, pan1)
  } else if (frame <= 749) {
    // Scene 4: Separate regeneration state on Vessel B + qualitative inset
    const inT = smoothstep(510, 560, frame)
    camX = lerp(720, 565, inT)
    camY = lerp(250, 355, inT)
    camZoom = lerp(1.32, 1.36, inT)
    camYaw = lerp(0.14, -0.12, inT)
  } else {
    // Scene 5: Pull back to stable system overview showing cold box & losses
    const pullT = smoothstep(750, 820, frame)
    camX = lerp(565, 680, pullT)
    camY = lerp(355, 340, pullT)
    camZoom = lerp(1.36, 1.0, pullT)
    camYaw = lerp(-0.12, 0.0, pullT)
  }

  // Qualitative bed loading & regeneration states
  const vesselASaturationH2O = clamp(0.22 + progress * 0.46, 0, 0.78)
  const vesselASaturationCO2 = clamp(0.16 + progress * 0.38, 0, 0.68)

  let vesselBRegenPhase: FrameState['qualitativeMetrics']['vesselBRegenPhase'] = 'STANDBY'
  let vesselBThermalWave = 0
  let vesselBContaminantLoad = 0.72

  if (frame < 510) {
    vesselBRegenPhase = 'DEPRESSURIZE'
    vesselBThermalWave = 0.08
    vesselBContaminantLoad = lerp(0.76, 0.68, frame / 510)
  } else if (frame < 630) {
    vesselBRegenPhase = 'THERMAL DESORPTION'
    const t = (frame - 510) / 120
    vesselBThermalWave = lerp(0.08, 0.85, t)
    vesselBContaminantLoad = lerp(0.68, 0.18, t)
  } else if (frame < 710) {
    vesselBRegenPhase = 'COOLING SWEEP'
    const t = (frame - 630) / 80
    vesselBThermalWave = lerp(0.85, 1.0, t)
    vesselBContaminantLoad = lerp(0.18, 0.05, t)
  } else if (frame < 750) {
    vesselBRegenPhase = 'REPRESSURIZE'
    vesselBContaminantLoad = 0.04
    vesselBThermalWave = 0
  } else {
    vesselBRegenPhase = 'STANDBY'
    vesselBContaminantLoad = 0.04
    vesselBThermalWave = 0
  }

  return {
    frame,
    timeSec,
    progress,
    scene,
    sceneProgress,
    camera: {
      x: camX,
      y: camY,
      zoom: camZoom,
      isoYaw: camYaw,
    },
    qualitativeMetrics: {
      vesselASaturationH2O,
      vesselASaturationCO2,
      vesselBRegenPhase,
      vesselBThermalWave,
      vesselBContaminantLoad,
      purifiedFlowSplit: 0.86, // qualitative illustration of net feed minus purge/blowdown losses
      coldBoxSafetyStatus: 'PROTECTED (Micro-Passages Clear of H2O/CO2 Ice)',
    },
  }
}
