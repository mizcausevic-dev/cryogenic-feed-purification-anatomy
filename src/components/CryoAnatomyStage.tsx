import React, { useEffect, useRef } from 'react'
import { computeFrameState, PALETTE, TOTAL_FRAMES } from '../data/explainerTimeline'

interface CryoAnatomyStageProps {
  frame: number
  overlayFilters: {
    showTransport: boolean
    showEnergy: boolean
    showControl: boolean
    showCutaway: boolean
    showLosses: boolean
  }
}

interface ParticleSeed {
  id: number
  phaseOffset: number
  lane: number
  species: 'N2_O2' | 'H2O' | 'CO2' | 'REGEN_SWEEP'
}

const PARTICLE_SEEDS: ParticleSeed[] = Array.from({ length: 78 }, (_, i) => {
  const mod = i % 10
  let species: ParticleSeed['species'] = 'N2_O2'
  if (mod === 1 || mod === 6) species = 'H2O'
  else if (mod === 3 || mod === 8) species = 'CO2'
  else if (mod === 9) species = 'REGEN_SWEEP'

  return {
    id: i,
    phaseOffset: (i * 0.0713) % 1,
    lane: ((i % 5) - 2) * 0.22,
    species,
  }
})

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawCallout(
  ctx: CanvasRenderingContext2D,
  anchorX: number,
  anchorY: number,
  boxX: number,
  boxY: number,
  title: string,
  subtitle: string,
  accentColor: string,
  alpha = 1
) {
  if (alpha <= 0.02) return
  ctx.save()
  ctx.globalAlpha = alpha

  // Leader line
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 1.5
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(anchorX, anchorY)
  ctx.lineTo((anchorX + boxX) * 0.5, boxY + 16)
  ctx.lineTo(boxX, boxY + 16)
  ctx.stroke()
  ctx.setLineDash([])

  // Anchor dot
  ctx.fillStyle = accentColor
  ctx.beginPath()
  ctx.arc(anchorX, anchorY, 4, 0, Math.PI * 2)
  ctx.fill()

  // Label box
  const paddingX = 10
  ctx.font = '600 11px "JetBrains Mono", monospace'
  const titleWidth = ctx.measureText(title).width
  ctx.font = '400 10px "Space Grotesk", sans-serif'
  const subWidth = ctx.measureText(subtitle).width
  const boxW = Math.max(titleWidth, subWidth) + paddingX * 2 + 6
  const boxH = 38

  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 5)
  ctx.fillStyle = 'rgba(11, 16, 25, 0.92)'
  ctx.fill()
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 1.2
  ctx.stroke()

  // Accent bar on left
  ctx.fillStyle = accentColor
  ctx.fillRect(boxX, boxY + 4, 3, boxH - 8)

  ctx.fillStyle = '#F8FAFC'
  ctx.font = '600 11px "JetBrains Mono", monospace'
  ctx.fillText(title, boxX + paddingX, boxY + 15)

  ctx.fillStyle = '#94A3B8'
  ctx.font = '400 10px "Space Grotesk", sans-serif'
  ctx.fillText(subtitle, boxX + paddingX, boxY + 29)

  ctx.restore()
}

function drawValveSymbol(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isOpen: boolean,
  label: string,
  showControl: boolean,
  showEnergy: boolean
) {
  ctx.save()
  ctx.translate(x, y)

  // Bowtie valve body
  ctx.beginPath()
  ctx.moveTo(-11, -7)
  ctx.lineTo(11, 7)
  ctx.lineTo(11, -7)
  ctx.lineTo(-11, 7)
  ctx.closePath()

  ctx.fillStyle = isOpen
    ? showTransportColor(showEnergy ? PALETTE.energyActuationGold : PALETTE.primaryTransportCyan)
    : '#1E293B'
  ctx.fill()
  ctx.strokeStyle = isOpen ? PALETTE.energyActuationGold : '#64748B'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Actuator stem & dome
  if (showControl || showEnergy) {
    ctx.strokeStyle = showControl ? PALETTE.controlStateViolet : PALETTE.neutralMaterialLight
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -14)
    ctx.stroke()

    ctx.fillStyle = isOpen ? PALETTE.energyActuationGold : PALETTE.controlStateViolet
    ctx.beginPath()
    ctx.arc(0, -16, 5, Math.PI, 0)
    ctx.closePath()
    ctx.fill()
  }

  ctx.fillStyle = '#CBD5E1'
  ctx.font = '600 9px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`${label}:${isOpen ? 'OPEN' : 'SHUT'}`, 0, 18)

  ctx.restore()
}

function showTransportColor(color: string): string {
  return color
}

export const CryoAnatomyStage: React.FC<CryoAnatomyStageProps> = ({ frame, overlayFilters }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const logicalWidth = 1360
    const logicalHeight = 680

    if (canvas.width !== logicalWidth * dpr || canvas.height !== logicalHeight * dpr) {
      canvas.width = logicalWidth * dpr
      canvas.height = logicalHeight * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)

    const state = computeFrameState(frame)
    const { scene, camera, qualitativeMetrics } = state
    const { showTransport, showEnergy, showControl, showCutaway, showLosses } = overlayFilters

    // 1. Clear technical stage (#0B1019)
    ctx.fillStyle = PALETTE.stageBg
    ctx.fillRect(0, 0, logicalWidth, logicalHeight)

    // Technical blueprint grid background
    ctx.strokeStyle = 'rgba(52, 66, 87, 0.22)'
    ctx.lineWidth = 1
    const gridSize = 40
    for (let gx = 0; gx < logicalWidth; gx += gridSize) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, logicalHeight)
      ctx.stroke()
    }
    for (let gy = 0; gy < logicalHeight; gy += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(logicalWidth, gy)
      ctx.stroke()
    }

    // Apply Camera Transform (Three-Quarter Isometric-Felt Push & Sectional Zoom)
    ctx.save()
    ctx.translate(logicalWidth / 2, logicalHeight / 2)
    ctx.scale(camera.zoom, camera.zoom)
    // Subtle horizontal shear / foreshortening to convey three-quarter perspective shift during Scene 1 & 4
    ctx.transform(1, camera.isoYaw * 0.08, -camera.isoYaw * 0.14, 1, 0, 0)
    ctx.translate(-camera.x, -camera.y)

    // =========================================================================
    // WORLD COORDINATE SYSTEM (0..1360 x 0..680)
    // =========================================================================

    // --- A. UPSTREAM FEED AIR COMPRESSION & AFTERCOOLER BOUNDARY (x: 70..230) ---
    drawRoundedRect(ctx, 75, 420, 130, 125, 8)
    ctx.fillStyle = PALETTE.neutralMaterialDark
    ctx.fill()
    ctx.strokeStyle = PALETTE.neutralMaterialLight
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#E2E8F0'
    ctx.font = '700 11px "JetBrains Mono", monospace'
    ctx.fillText('UPSTREAM FEED AIR', 88, 444)
    ctx.fillStyle = '#94A3B8'
    ctx.font = '400 10px "Space Grotesk", sans-serif'
    ctx.fillText('Compressed & Aftercooled', 88, 460)
    ctx.fillText('Contains: N2, O2, Ar', 88, 476)
    ctx.fillStyle = PALETTE.primaryTransportCyan
    ctx.fillText('+ H2O Vapor & Trace CO2', 88, 492)

    if (showEnergy) {
      ctx.fillStyle = PALETTE.energyActuationGold
      ctx.font = '600 9.5px "JetBrains Mono", monospace'
      ctx.fillText('P_feed > P_ambient (Gold)', 88, 514)
      ctx.fillText('Bulk Condensate Drained', 88, 528)
    }

    // --- B. PIPING CONDUITS (Neutral #344257 base, Cyan/Gold/Violet overlays) ---
    const drawPipe = (
      points: [number, number][],
      width: number,
      activeColor: string | null,
      dashed = false
    ) => {
      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Outer structural wall
      ctx.beginPath()
      points.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)))
      ctx.strokeStyle = PALETTE.neutralMaterial
      ctx.lineWidth = width
      ctx.stroke()

      // Inner bore
      ctx.strokeStyle = '#16202E'
      ctx.lineWidth = Math.max(2, width - 4)
      ctx.stroke()

      // Explanatory overlay trace
      if (activeColor) {
        ctx.strokeStyle = activeColor
        ctx.lineWidth = Math.max(2, width - 6)
        if (dashed) ctx.setLineDash([8, 6])
        ctx.stroke()
      }
      ctx.restore()
    }

    // 1. Feed inlet header to Vessel A (Online) and Vessel B (Isolated)
    drawPipe(
      [
        [205, 485],
        [375, 485],
        [375, 445],
      ],
      14,
      showTransport ? 'rgba(0, 229, 255, 0.45)' : null
    )
    drawPipe(
      [
        [375, 485],
        [555, 485],
        [555, 445],
      ],
      12,
      null
    )

    // 2. Vessel A Top Outlet to Particulate Filter & Cold Box
    drawPipe(
      [
        [375, 200],
        [375, 155],
        [670, 155],
        [670, 215],
      ],
      14,
      showTransport ? 'rgba(0, 229, 255, 0.6)' : null
    )

    // Vessel B Top Header (closed to product, open to heated waste N2 sweep)
    drawPipe(
      [
        [555, 200],
        [555, 155],
        [475, 155],
      ],
      10,
      null
    )

    // 3. Purified Feed from Particulate Filter to Cold Box Main Heat Exchanger
    drawPipe(
      [
        [705, 240],
        [875, 240],
      ],
      14,
      showTransport ? 'rgba(0, 229, 255, 0.75)' : null
    )

    // 4. Cold Box Waste N2 Return -> Regeneration Heater -> Vessel B Top (Counter-Current Sweep)
    const regenActive = frame >= 510 && frame <= 749
    drawPipe(
      [
        [875, 120],
        [755, 120],
        [615, 120],
        [555, 120],
        [555, 200],
      ],
      11,
      showEnergy && (regenActive || scene.index >= 4)
        ? 'rgba(255, 209, 102, 0.65)'
        : showTransport && scene.index >= 4
          ? 'rgba(0, 229, 255, 0.25)'
          : null,
      true
    )

    // 5. Vessel B Bottom Regeneration Exhaust -> Vent Stack (Losses)
    drawPipe(
      [
        [555, 445],
        [555, 535],
        [665, 535],
      ],
      11,
      showEnergy && (regenActive || showLosses) ? 'rgba(255, 209, 102, 0.5)' : null,
      true
    )

    // --- C. ADSORBER VESSEL A (ONLINE ADSORPTION) (Center X: 375, Y: 200..445) ---
    const drawVessel = (
      cx: number,
      topY: number,
      botY: number,
      radius: number,
      vesselTitle: string,
      modeBadge: string,
      isOnline: boolean
    ) => {
      const w = radius * 2
      const h = botY - topY
      const x = cx - radius

      ctx.save()

      // Vessel shadow / three-quarter depth rim
      drawRoundedRect(ctx, x + 5, topY + 4, w, h, 28)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
      ctx.fill()

      // Outer structural pressure shell (#344257)
      drawRoundedRect(ctx, x, topY, w, h, 28)
      const grad = ctx.createLinearGradient(x, topY, x + w, topY)
      grad.addColorStop(0, '#2B3748')
      grad.addColorStop(0.35, PALETTE.neutralMaterialLight)
      grad.addColorStop(0.85, PALETTE.neutralMaterial)
      grad.addColorStop(1, '#1F2937')
      ctx.fillStyle = grad
      ctx.fill()
      ctx.strokeStyle = isOnline ? PALETTE.primaryTransportCyan : PALETTE.energyActuationGold
      ctx.lineWidth = isOnline ? 2 : 1.5
      ctx.stroke()

      // Sectional Cutaway Interior
      const cutawayAlpha =
        showCutaway || scene.index === 2 || scene.index === 4
          ? 0.96
          : 0.45
      ctx.save()
      ctx.globalAlpha = cutawayAlpha
      drawRoundedRect(ctx, x + 8, topY + 18, w - 16, h - 36, 16)
      ctx.fillStyle = '#0F172A'
      ctx.fill()
      ctx.clip()

      if (isOnline) {
        // VESSEL A: Two-stage adsorbent bed
        // Lower zone (y: 325..418): Moisture-Selective Adsorbent (Activated Alumina / Silica Gel)
        const lowerTop = 325
        const lowerBot = 418
        ctx.fillStyle = 'rgba(52, 66, 87, 0.55)'
        ctx.fillRect(x + 8, lowerTop, w - 16, lowerBot - lowerTop)

        // Moisture saturation front (rising from bottom)
        const h2oFrontHeight = (lowerBot - lowerTop) * qualitativeMetrics.vesselASaturationH2O
        const h2oGrad = ctx.createLinearGradient(0, lowerBot, 0, lowerBot - h2oFrontHeight - 15)
        h2oGrad.addColorStop(0, 'rgba(0, 229, 255, 0.55)')
        h2oGrad.addColorStop(0.75, 'rgba(0, 229, 255, 0.28)')
        h2oGrad.addColorStop(1, 'rgba(0, 229, 255, 0.0)')
        ctx.fillStyle = h2oGrad
        ctx.fillRect(x + 8, lowerTop, w - 16, lowerBot - lowerTop)

        // Upper zone (y: 225..322): Molecular Sieve Zeolite (13X / CO2 removal)
        const upperTop = 225
        const upperBot = 322
        ctx.fillStyle = 'rgba(74, 93, 122, 0.42)'
        ctx.fillRect(x + 8, upperTop, w - 16, upperBot - upperTop)

        // CO2 Mass-Transfer Zone (MTZ) wave
        const co2FrontHeight = (upperBot - upperTop) * qualitativeMetrics.vesselASaturationCO2
        const co2Grad = ctx.createLinearGradient(0, upperBot, 0, upperBot - co2FrontHeight - 18)
        co2Grad.addColorStop(0, 'rgba(157, 78, 221, 0.55)')
        co2Grad.addColorStop(0.7, 'rgba(255, 209, 102, 0.32)')
        co2Grad.addColorStop(1, 'rgba(0, 229, 255, 0.0)')
        ctx.fillStyle = co2Grad
        ctx.fillRect(x + 8, upperTop, w - 16, upperBot - upperTop)

        // Packed bed bead texture (deterministic grid)
        for (let by = upperTop + 6; by < lowerBot - 4; by += 9) {
          const isLower = by >= lowerTop
          for (let bx = x + 15; bx < x + w - 14; bx += 9) {
            const offset = ((by / 9) % 2) * 4
            ctx.beginPath()
            ctx.arc(bx + offset, by, isLower ? 3.2 : 2.6, 0, Math.PI * 2)
            if (isLower) {
              const sat = by > lowerBot - h2oFrontHeight
              ctx.fillStyle = sat ? 'rgba(0, 229, 255, 0.78)' : 'rgba(100, 116, 139, 0.45)'
            } else {
              const sat = by > upperBot - co2FrontHeight
              ctx.fillStyle = sat ? 'rgba(157, 78, 221, 0.78)' : 'rgba(148, 163, 184, 0.38)'
            }
            ctx.fill()
          }
        }

        // Layer divider screen & MTZ marker line
        ctx.strokeStyle = '#94A3B8'
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 3])
        ctx.beginPath()
        ctx.moveTo(x + 8, lowerTop)
        ctx.lineTo(x + w - 8, lowerTop)
        ctx.stroke()

        // Active MTZ Front Line
        if (showControl) {
          const mtzY = upperBot - co2FrontHeight
          ctx.strokeStyle = PALETTE.controlStateViolet
          ctx.lineWidth = 2
          ctx.setLineDash([3, 2])
          ctx.beginPath()
          ctx.moveTo(x + 10, mtzY)
          ctx.lineTo(x + w - 10, mtzY)
          ctx.stroke()
        }
        ctx.setLineDash([])
      } else {
        // VESSEL B: Regeneration State (Counter-Current Top-to-Bottom Thermal Sweep)
        const bedTop = 225
        const bedBot = 418
        const bedH = bedBot - bedTop

        // Thermal desorption wave moving downward (Gold)
        if (showEnergy) {
          const waveY = bedTop + bedH * qualitativeMetrics.vesselBThermalWave
          const regenGrad = ctx.createLinearGradient(0, bedTop, 0, bedBot)
          const stopPos = Math.max(0.05, Math.min(0.95, qualitativeMetrics.vesselBThermalWave))
          regenGrad.addColorStop(0, 'rgba(255, 209, 102, 0.18)')
          regenGrad.addColorStop(stopPos, 'rgba(255, 209, 102, 0.65)')
          regenGrad.addColorStop(Math.min(1, stopPos + 0.15), 'rgba(157, 78, 221, 0.35)')
          regenGrad.addColorStop(1, 'rgba(52, 66, 87, 0.4)')
          ctx.fillStyle = regenGrad
          ctx.fillRect(x + 8, bedTop, w - 16, bedH)

          // Thermal front indicator line
          ctx.strokeStyle = PALETTE.energyActuationGold
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x + 10, waveY)
          ctx.lineTo(x + w - 10, waveY)
          ctx.stroke()
        }

        // Packed bed beads in Vessel B
        for (let by = bedTop + 6; by < bedBot - 4; by += 10) {
          for (let bx = x + 15; bx < x + w - 14; bx += 10) {
            const relY = (by - bedTop) / bedH
            const isDesorbed = relY <= qualitativeMetrics.vesselBThermalWave
            ctx.beginPath()
            ctx.arc(bx, by, 2.8, 0, Math.PI * 2)
            ctx.fillStyle = isDesorbed
              ? 'rgba(255, 209, 102, 0.62)'
              : 'rgba(100, 116, 139, 0.5)'
            ctx.fill()
          }
        }
      }

      // Distributor screens at top and bottom of bed
      ctx.strokeStyle = '#64748B'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x + 10, 222)
      ctx.lineTo(x + w - 10, 222)
      ctx.moveTo(x + 10, 420)
      ctx.lineTo(x + w - 10, 420)
      ctx.stroke()

      ctx.restore() // end cutaway clip

      // Vessel Header Label
      ctx.fillStyle = '#F8FAFC'
      ctx.font = '700 12px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(vesselTitle, cx, topY - 22)

      // Status Pill
      ctx.font = '600 9.5px "JetBrains Mono", monospace'
      ctx.fillStyle = isOnline ? PALETTE.primaryTransportCyan : PALETTE.energyActuationGold
      ctx.fillText(modeBadge, cx, topY - 8)

      ctx.restore()
    }

    drawVessel(
      375,
      200,
      445,
      58,
      'VESSEL A',
      'ONLINE: ADSORPTION',
      true
    )

    drawVessel(
      555,
      200,
      445,
      58,
      'VESSEL B',
      `OFFLINE: ${qualitativeMetrics.vesselBRegenPhase}`,
      false
    )

    // --- D. SWITCHING VALVES, REGEN HEATER, PARTICULATE FILTER, ANALYZER ---
    // Inlet valves
    drawValveSymbol(ctx, 330, 485, true, 'V-1A', showControl, showEnergy)
    drawValveSymbol(ctx, 495, 485, false, 'V-1B', showControl, showEnergy)

    // Outlet / Regen valves
    drawValveSymbol(ctx, 435, 155, true, 'V-2A', showControl, showEnergy)
    drawValveSymbol(ctx, 510, 155, false, 'V-2B', showControl, showEnergy)
    drawValveSymbol(ctx, 605, 535, frame >= 510 && frame <= 730, 'V-3B', showControl, showEnergy)

    // Regeneration Heater on Waste N2 line (x: 640..735, y: 98..142)
    drawRoundedRect(ctx, 635, 98, 105, 44, 6)
    ctx.fillStyle = PALETTE.neutralMaterialDark
    ctx.fill()
    ctx.strokeStyle = showEnergy ? PALETTE.energyActuationGold : PALETTE.neutralMaterialLight
    ctx.lineWidth = 2
    ctx.stroke()

    // Heater coil zigzag
    ctx.strokeStyle = showEnergy ? PALETTE.energyActuationGold : '#94A3B8'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(648, 120)
    for (let hx = 656; hx <= 724; hx += 8) {
      const hy = (hx / 8) % 2 === 0 ? 111 : 129
      ctx.lineTo(hx, hy)
    }
    ctx.stroke()
    ctx.fillStyle = showEnergy ? PALETTE.energyActuationGold : '#CBD5E1'
    ctx.font = '700 10px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('REGEN HEATER', 687, 90)

    // Particulate After-Filter (x: 645..705, y: 205..280)
    drawRoundedRect(ctx, 645, 205, 60, 75, 8)
    ctx.fillStyle = PALETTE.neutralMaterial
    ctx.fill()
    ctx.strokeStyle = PALETTE.primaryTransportCyan
    ctx.lineWidth = 1.8
    ctx.stroke()

    // Filter pleat lines
    ctx.strokeStyle = '#CBD5E1'
    ctx.lineWidth = 1.2
    for (let fy = 220; fy <= 265; fy += 9) {
      ctx.beginPath()
      ctx.moveTo(657, fy)
      ctx.lineTo(693, fy)
      ctx.stroke()
    }
    ctx.fillStyle = '#F8FAFC'
    ctx.font = '700 10px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('DUST FILTER', 675, 300)

    // Trace Moisture / CO2 Analyzer Guard (x: 785, y: 240)
    if (showControl) {
      ctx.strokeStyle = PALETTE.controlStateViolet
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.moveTo(785, 240)
      ctx.lineTo(785, 185)
      ctx.stroke()

      drawRoundedRect(ctx, 735, 145, 100, 40, 6)
      ctx.fillStyle = '#141B2D'
      ctx.fill()
      ctx.strokeStyle = PALETTE.controlStateViolet
      ctx.stroke()

      ctx.fillStyle = PALETTE.controlStateViolet
      ctx.font = '700 10px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('AT-101 ANALYZER', 785, 162)
      ctx.fillStyle = '#E2E8F0'
      ctx.font = '500 9px "JetBrains Mono", monospace'
      ctx.fillText('H2O/CO2 < Guard', 785, 177)
    }

    // Vent Stack on Vessel B Regeneration Exhaust (x: 665, y: 510..565)
    drawRoundedRect(ctx, 665, 512, 82, 46, 6)
    ctx.fillStyle = PALETTE.neutralMaterialDark
    ctx.fill()
    ctx.strokeStyle = showLosses ? PALETTE.energyActuationGold : '#64748B'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = showLosses ? PALETTE.energyActuationGold : '#94A3B8'
    ctx.font = '700 10px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('ATMOS VENT', 706, 532)
    ctx.font = '400 9px "Space Grotesk", sans-serif'
    ctx.fillText('H2O + CO2 + N2', 706, 546)

    // --- E. DOWNSTREAM CRYOGENIC COLD BOX ASSEMBLY (x: 875..1275, y: 85..565) ---
    drawRoundedRect(ctx, 875, 85, 400, 480, 12)
    ctx.fillStyle = 'rgba(20, 29, 43, 0.92)'
    ctx.fill()
    ctx.strokeStyle = PALETTE.neutralMaterialLight
    ctx.lineWidth = 2.5
    ctx.stroke()

    // Cold box insulation double-wall border
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)'
    ctx.lineWidth = 1
    ctx.setLineDash([6, 4])
    drawRoundedRect(ctx, 885, 95, 380, 460, 8)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#F8FAFC'
    ctx.font = '700 13px "JetBrains Mono", monospace'
    ctx.textAlign = 'left'
    ctx.fillText('CRYOGENIC COLD BOX ENCLOSURE', 900, 118)
    ctx.fillStyle = PALETTE.primaryTransportCyan
    ctx.font = '500 10px "JetBrains Mono", monospace'
    ctx.fillText('Low-Temperature Region (Protected Against Solid Freeze-Out)', 900, 134)

    // 1. Brazed Aluminum Main Heat Exchanger (PHX) (x: 910..1035, y: 175..410)
    drawRoundedRect(ctx, 910, 175, 125, 235, 6)
    ctx.fillStyle = PALETTE.neutralMaterial
    ctx.fill()
    ctx.strokeStyle = PALETTE.primaryTransportCyan
    ctx.lineWidth = 1.8
    ctx.stroke()

    // Micro-channel plate-fin passages inside PHX
    for (let px = 922; px <= 1022; px += 10) {
      ctx.strokeStyle = px % 20 === 2 ? 'rgba(0, 229, 255, 0.55)' : 'rgba(255, 209, 102, 0.35)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(px, 190)
      ctx.lineTo(px, 395)
      ctx.stroke()
    }

    ctx.fillStyle = '#F8FAFC'
    ctx.font = '700 10.5px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('MAIN HEAT', 972, 275)
    ctx.fillText('EXCHANGER (PHX)', 972, 290)
    ctx.fillStyle = '#CBD5E1'
    ctx.font = '400 9.5px "Space Grotesk", sans-serif'
    ctx.fillText('Plate-Fin Passages', 972, 308)
    ctx.fillStyle = PALETTE.primaryTransportCyan
    ctx.fillText('Clear of H2O/CO2 Ice', 972, 324)

    // 2. Cryogenic Expansion / Rectification Column (x: 1095..1235, y: 160..495)
    drawRoundedRect(ctx, 1095, 160, 140, 335, 36)
    ctx.fillStyle = PALETTE.neutralMaterialDark
    ctx.fill()
    ctx.strokeStyle = PALETTE.neutralMaterialLight
    ctx.lineWidth = 2
    ctx.stroke()

    // Structured packing / distillation trays
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)'
    ctx.lineWidth = 1.2
    for (let ty = 205; ty <= 440; ty += 26) {
      ctx.beginPath()
      ctx.moveTo(1110, ty)
      ctx.lineTo(1220, ty)
      ctx.stroke()
    }

    // Liquid pool at column sump
    ctx.fillStyle = 'rgba(0, 229, 255, 0.32)'
    ctx.fillRect(1102, 448, 126, 38)

    ctx.fillStyle = '#F8FAFC'
    ctx.font = '700 11px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('CRYOGENIC', 1165, 295)
    ctx.fillText('DISTILLATION', 1165, 310)
    ctx.fillText('COLUMN', 1165, 325)

    // Internal cold box transfer lines
    drawPipe(
      [
        [972, 410],
        [972, 455],
        [1095, 455],
      ],
      10,
      showTransport ? 'rgba(0, 229, 255, 0.7)' : null
    )
    // Top product Nitrogen outlet
    drawPipe(
      [
        [1165, 160],
        [1165, 140],
        [1265, 140],
      ],
      10,
      showTransport ? 'rgba(0, 229, 255, 0.85)' : null
    )
    ctx.fillStyle = PALETTE.primaryTransportCyan
    ctx.font = '700 10px "JetBrains Mono", monospace'
    ctx.textAlign = 'right'
    ctx.fillText('HIGH-PURITY N2 PRODUCT ->', 1258, 130)

    // Waste gas return from column to PHX and out to Regen Heater
    drawPipe(
      [
        [1095, 220],
        [1035, 220],
      ],
      9,
      showEnergy ? 'rgba(255, 209, 102, 0.5)' : null,
      true
    )

    // --- F. DETERMINISTIC PARTICLE TRANSPORT (Frame-Driven, Zero Randomness) ---
    if (showTransport || showEnergy) {
      PARTICLE_SEEDS.forEach((p) => {
        const t = ((frame / TOTAL_FRAMES) * 3.5 + p.phaseOffset) % 1

        if (p.species === 'N2_O2' && showTransport) {
          // Travels from feed air header -> Vessel A bottom -> through bed -> top outlet -> filter -> PHX -> Column
          let px = 0
          let py = 0
          if (t < 0.22) {
            const seg = t / 0.22
            px = 205 + seg * 170
            py = 485 + p.lane * 8
          } else if (t < 0.52) {
            const seg = (t - 0.22) / 0.3
            px = 375 + p.lane * 75
            py = 435 - seg * 230
          } else if (t < 0.75) {
            const seg = (t - 0.52) / 0.23
            px = 375 + seg * 295
            py = 155 + p.lane * 6
          } else {
            const seg = (t - 0.75) / 0.25
            px = 675 + seg * 290
            py = 240 + p.lane * 8
          }

          ctx.fillStyle = PALETTE.primaryTransportCyan
          ctx.beginPath()
          ctx.arc(px, py, 3.2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.species === 'H2O' && showTransport) {
          // Enters Vessel A and gets arrested in the lower moisture-selective layer
          const seg = t
          let px = 0
          let py = 0
          let alpha = 0.9
          if (seg < 0.38) {
            const s = seg / 0.38
            px = 205 + s * 170
            py = 485 + p.lane * 10
          } else {
            const s = (seg - 0.38) / 0.62
            px = 375 + p.lane * 82
            const arrestY = 415 - qualitativeMetrics.vesselASaturationH2O * 75
            py = 425 - s * (425 - arrestY)
            alpha = 1 - s * 0.65
          }

          ctx.save()
          ctx.globalAlpha = alpha
          ctx.fillStyle = '#38BDF8'
          ctx.strokeStyle = '#FFFFFF'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(px, py, 4.2, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          ctx.restore()
        } else if (p.species === 'CO2' && showTransport) {
          // Passes lower layer and gets arrested in the upper molecular sieve layer
          const seg = t
          let px = 0
          let py = 0
          let alpha = 0.92
          if (seg < 0.3) {
            const s = seg / 0.3
            px = 205 + s * 170
            py = 485 + p.lane * 10
          } else {
            const s = (seg - 0.3) / 0.7
            px = 375 + p.lane * 80
            const arrestY = 315 - qualitativeMetrics.vesselASaturationCO2 * 70
            py = 425 - s * (425 - arrestY)
            alpha = 1 - s * 0.55
          }

          ctx.save()
          ctx.globalAlpha = alpha
          ctx.fillStyle = PALETTE.controlStateViolet
          ctx.strokeStyle = PALETTE.energyActuationGold
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.rect(px - 3.5, py - 3.5, 7, 7)
          ctx.fill()
          ctx.stroke()
          ctx.restore()
        } else if (p.species === 'REGEN_SWEEP' && showEnergy) {
          // Counter-current heated waste N2 sweep through Vessel B top-to-bottom and out to vent
          const seg = t
          let px = 0
          let py = 0
          if (seg < 0.3) {
            const s = seg / 0.3
            px = 875 - s * 320
            py = 120 + p.lane * 6
          } else if (seg < 0.78) {
            const s = (seg - 0.3) / 0.48
            px = 555 + p.lane * 76
            py = 210 + s * 225
          } else {
            const s = (seg - 0.78) / 0.22
            px = 555 + s * 120
            py = 535 + p.lane * 6
          }

          ctx.fillStyle = PALETTE.energyActuationGold
          ctx.beginPath()
          ctx.arc(px, py, 3.5, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    // --- G. SCENE-SPECIFIC CALLOUTS & QUALITATIVE INSETS ---

    // Scene 1 Callouts (Frames 0-149)
    if (scene.index === 1) {
      drawCallout(
        ctx,
        205,
        485,
        95,
        345,
        '1. FEED AIR HEADER',
        'Compressed moist air with trace CO2 enters manifold',
        PALETTE.primaryTransportCyan
      )
      drawCallout(
        ctx,
        375,
        310,
        155,
        205,
        '2. DUAL-VESSEL TSA/PSA SKID',
        'Vessel A adsorbing online | Vessel B isolated for regeneration',
        PALETTE.controlStateViolet
      )
      drawCallout(
        ctx,
        885,
        240,
        925,
        445,
        '3. DOWNSTREAM COLD BOX GUARD',
        'Requires dry, CO2-free feed prior to cryogenic cooling',
        PALETTE.energyActuationGold
      )
    }

    // Scene 2 Callouts & Pore-Scale Selectivity Inset (Frames 150-299)
    if (scene.index === 2) {
      drawCallout(
        ctx,
        375,
        385,
        140,
        365,
        'STAGE 1: MOISTURE-SELECTIVE BED',
        'Activated alumina / silica gel arrests bulk H2O vapor first',
        PALETTE.primaryTransportCyan
      )
      drawCallout(
        ctx,
        375,
        270,
        140,
        235,
        'STAGE 2: MOLECULAR SIEVE ZEOLITE',
        'Captures trace CO2 & hydrocarbons without H2O displacement',
        PALETTE.controlStateViolet
      )
      drawCallout(
        ctx,
        425,
        295,
        465,
        280,
        'MASS-TRANSFER ZONE (MTZ)',
        'Local exothermic adsorption front advancing upward',
        PALETTE.energyActuationGold
      )
    }

    // Scene 3 Callouts (Frames 300-509)
    if (scene.index === 3) {
      drawCallout(
        ctx,
        490,
        155,
        340,
        82,
        'PRIMARY TRANSPORT (CYAN)',
        'Purified N2 + O2 + Ar carrier gas depleted of H2O & CO2',
        PALETTE.primaryTransportCyan
      )
      drawCallout(
        ctx,
        675,
        240,
        540,
        325,
        'PARTICULATE AFTER-FILTER',
        'Traps desiccant & zeolite attrition dust before heat exchanger',
        PALETTE.energyActuationGold
      )
      drawCallout(
        ctx,
        785,
        165,
        740,
        75,
        'CONTROL INTERLOCK (VIOLET)',
        'Continuous trace moisture/CO2 analyzer guards cold box entry',
        PALETTE.controlStateViolet
      )
    }

    // Scene 4 Callouts (Frames 510-749)
    if (scene.index === 4) {
      drawCallout(
        ctx,
        687,
        120,
        620,
        35,
        'REGENERATION HEATER (GOLD)',
        'Warms dry waste N2 from cold box to desorb trapped species',
        PALETTE.energyActuationGold
      )
      drawCallout(
        ctx,
        555,
        310,
        645,
        360,
        'COUNTER-CURRENT SWEEP',
        'Top-to-bottom purge pushes H2O/CO2 out the inlet end without wetting top sieve',
        PALETTE.controlStateViolet
      )
    }

    // Scene 5 Callouts & Visible Losses Ledger (Frames 750-1019)
    if (scene.index === 5) {
      drawCallout(
        ctx,
        972,
        240,
        720,
        360,
        'BRAZED ALUMINUM PHX PROTECTION',
        'Prevents solid H2O/CO2 freeze-out in millimeter-scale passages',
        PALETTE.primaryTransportCyan
      )
      drawCallout(
        ctx,
        706,
        535,
        460,
        565,
        'VISIBLE SYSTEM LOSSES RETAINED',
        'Purge gas consumption + heater duty + bed pressure drop (Delta-P)',
        PALETTE.energyActuationGold
      )
    }

    ctx.restore() // Restore from camera transform

    // =========================================================================
    // H. SCREEN-SPACE HUD OVERLAYS & QUALITATIVE INSETS (Always Crisp & Readable)
    // =========================================================================

    // Top-Left Technical Header Badge
    drawRoundedRect(ctx, 18, 16, 480, 62, 8)
    ctx.fillStyle = 'rgba(11, 16, 25, 0.9)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(52, 66, 87, 0.8)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    ctx.fillStyle = PALETTE.primaryTransportCyan
    ctx.font = '700 11px "JetBrains Mono", monospace'
    ctx.fillText(
      `SCENE 0${scene.index}/05 // FRAMES ${scene.startFrame}–${scene.endFrame} (${scene.startSec}–${scene.endSec}s)`,
      32,
      36
    )
    ctx.fillStyle = '#F8FAFC'
    ctx.font = '700 14px "Space Grotesk", sans-serif'
    ctx.fillText(scene.title.toUpperCase(), 32, 55)
    ctx.fillStyle = '#94A3B8'
    ctx.font = '400 10px "JetBrains Mono", monospace'
    ctx.fillText(scene.scaleNotice, 32, 70)

    // Top-Right Frame & Timecode Telemetry Badge
    drawRoundedRect(ctx, logicalWidth - 275, 16, 257, 62, 8)
    ctx.fillStyle = 'rgba(11, 16, 25, 0.9)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(52, 66, 87, 0.8)'
    ctx.stroke()

    ctx.fillStyle = '#94A3B8'
    ctx.font = '600 10px "JetBrains Mono", monospace'
    ctx.fillText('INDEXED FRAME', logicalWidth - 260, 35)
    ctx.fillText('TIMECODE (30 FPS)', logicalWidth - 135, 35)

    ctx.fillStyle = PALETTE.primaryTransportCyan
    ctx.font = '700 18px "JetBrains Mono", monospace'
    ctx.fillText(
      `${String(state.frame).padStart(4, '0')} / 1019`,
      logicalWidth - 260,
      58
    )
    ctx.fillStyle = PALETTE.energyActuationGold
    ctx.fillText(`${state.timeSec.toFixed(2)}s`, logicalWidth - 135, 58)

    // Qualitative Inset 1: Scene 2 Pore-Scale Selectivity & Breakthrough Curve (Frames 150-299)
    if (scene.index === 2) {
      const ix = logicalWidth - 385
      const iy = 96
      const iw = 367
      const ih = 215
      drawRoundedRect(ctx, ix, iy, iw, ih, 10)
      ctx.fillStyle = 'rgba(11, 16, 25, 0.94)'
      ctx.fill()
      ctx.strokeStyle = PALETTE.primaryTransportCyan
      ctx.lineWidth = 1.4
      ctx.stroke()

      ctx.fillStyle = PALETTE.primaryTransportCyan
      ctx.font = '700 11px "JetBrains Mono", monospace'
      ctx.fillText('QUALITATIVE INSET: LAYERED BED MTZ PROFILE', ix + 14, iy + 22)
      ctx.fillStyle = '#94A3B8'
      ctx.font = '400 10px "Space Grotesk", sans-serif'
      ctx.fillText('Conceptual loading along axial bed height Z (Not experimental data)', ix + 14, iy + 37)

      // Axes
      const gx = ix + 44
      const gy = iy + 55
      const gw = iw - 68
      const gh = 115
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(gx, gy)
      ctx.lineTo(gx, gy + gh)
      ctx.lineTo(gx + gw, gy + gh)
      ctx.stroke()

      // H2O S-curve in lower bed
      ctx.strokeStyle = PALETTE.primaryTransportCyan
      ctx.lineWidth = 2.2
      ctx.beginPath()
      for (let s = 0; s <= 1; s += 0.04) {
        const px = gx + s * gw
        const center = 0.28 + state.sceneProgress * 0.14
        const load = 1 / (1 + Math.exp((s - center) * 16))
        const py = gy + gh - load * (gh - 18)
        if (s === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // CO2 S-curve in upper bed
      ctx.strokeStyle = PALETTE.controlStateViolet
      ctx.lineWidth = 2.2
      ctx.beginPath()
      for (let s = 0; s <= 1; s += 0.04) {
        const px = gx + s * gw
        const center = 0.62 + state.sceneProgress * 0.15
        const load = (1 / (1 + Math.exp((s - center) * 18))) * (1 / (1 + Math.exp((0.25 - s) * 20)))
        const py = gy + gh - load * (gh - 28)
        if (s === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // Breakthrough guard threshold line
      ctx.strokeStyle = PALETTE.energyActuationGold
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(gx + gw * 0.88, gy)
      ctx.lineTo(gx + gw * 0.88, gy + gh)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = PALETTE.primaryTransportCyan
      ctx.font = '600 9.5px "JetBrains Mono", monospace'
      ctx.fillText('H2O Loading (Lower Layer)', gx + 8, gy + 16)
      ctx.fillStyle = PALETTE.controlStateViolet
      ctx.fillText('CO2 Loading (Upper Sieve)', gx + 145, gy + 36)
      ctx.fillStyle = PALETTE.energyActuationGold
      ctx.fillText('Switch Guard', gx + gw * 0.88 - 55, gy + 14)

      ctx.fillStyle = '#94A3B8'
      ctx.fillText('Inlet (Z=0)', gx, gy + gh + 14)
      ctx.fillText('Outlet (Z=L)', gx + gw - 62, gy + gh + 14)
    }

    // Qualitative Inset 2: Scene 4 Regeneration State Diagram (Frames 510-749)
    if (scene.index === 4) {
      const ix = logicalWidth - 405
      const iy = 96
      const iw = 387
      const ih = 225
      drawRoundedRect(ctx, ix, iy, iw, ih, 10)
      ctx.fillStyle = 'rgba(11, 16, 25, 0.94)'
      ctx.fill()
      ctx.strokeStyle = PALETTE.energyActuationGold
      ctx.lineWidth = 1.4
      ctx.stroke()

      ctx.fillStyle = PALETTE.energyActuationGold
      ctx.font = '700 11px "JetBrains Mono", monospace'
      ctx.fillText('QUALITATIVE INSET: VESSEL B REGENERATION STATE', ix + 14, iy + 22)
      ctx.fillStyle = '#94A3B8'
      ctx.font = '400 10px "Space Grotesk", sans-serif'
      ctx.fillText('Conceptual thermal pulse & effluent desorption (No recipe implied)', ix + 14, iy + 37)

      const gx = ix + 42
      const gy = iy + 56
      const gw = iw - 64
      const gh = 115

      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(gx, gy)
      ctx.lineTo(gx, gy + gh)
      ctx.lineTo(gx + gw, gy + gh)
      ctx.stroke()

      // Heater temperature curve (Gold)
      ctx.strokeStyle = PALETTE.energyActuationGold
      ctx.lineWidth = 2.2
      ctx.beginPath()
      for (let s = 0; s <= 1; s += 0.03) {
        const px = gx + s * gw
        const heatPulse = Math.exp(-Math.pow((s - 0.38) / 0.24, 2))
        const py = gy + gh - heatPulse * (gh - 20)
        if (s === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // Desorbed effluent concentration curve (Violet)
      ctx.strokeStyle = PALETTE.controlStateViolet
      ctx.lineWidth = 2.2
      ctx.beginPath()
      for (let s = 0; s <= 1; s += 0.03) {
        const px = gx + s * gw
        const desorbPulse = Math.exp(-Math.pow((s - 0.52) / 0.22, 2)) * 0.88
        const py = gy + gh - desorbPulse * (gh - 20)
        if (s === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // Current progress marker inside Scene 4
      const markerX = gx + state.sceneProgress * gw
      ctx.strokeStyle = PALETTE.primaryTransportCyan
      ctx.lineWidth = 1.5
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(markerX, gy)
      ctx.lineTo(markerX, gy + gh)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = PALETTE.energyActuationGold
      ctx.font = '600 9.5px "JetBrains Mono", monospace'
      ctx.fillText('Sweep Gas Temp (Qualitative)', gx + 8, gy + 16)
      ctx.fillStyle = PALETTE.controlStateViolet
      ctx.fillText('Effluent H2O/CO2 Desorption', gx + 175, gy + 34)
      ctx.fillStyle = '#CBD5E1'
      ctx.fillText(`ACTIVE SUB-STATE: ${qualitativeMetrics.vesselBRegenPhase}`, gx, gy + gh + 28)
    }

    // Qualitative Inset 3: Scene 5 Mass, Energy & Visible Losses Accounting (Frames 750-1019)
    if (scene.index === 5 || showLosses) {
      const ix = 18
      const iy = logicalHeight - 178
      const iw = 455
      const ih = 160
      drawRoundedRect(ctx, ix, iy, iw, ih, 10)
      ctx.fillStyle = 'rgba(11, 16, 25, 0.94)'
      ctx.fill()
      ctx.strokeStyle = PALETTE.neutralMaterialLight
      ctx.lineWidth = 1.4
      ctx.stroke()

      ctx.fillStyle = '#F8FAFC'
      ctx.font = '700 11px "JetBrains Mono", monospace'
      ctx.fillText('QUALITATIVE MASS, ENERGY & IRREVERSIBILITY ACCOUNTING', ix + 14, iy + 22)

      const items = [
        {
          label: 'Mass Balance (Conservative)',
          detail: 'm_feed = m_purified_to_coldbox + m_adsorbed(H2O,CO2) + m_blowdown_loss',
          color: PALETTE.primaryTransportCyan,
        },
        {
          label: 'Thermal & Purge Penalty',
          detail: 'Dry waste N2 diversion + heater energy input required for bed desorption',
          color: PALETTE.energyActuationGold,
        },
        {
          label: 'Hydraulic & Capacity Limits',
          detail: 'Packed-bed Delta-P + gradual hydrothermal zeolite aging (Non-zero slip risk)',
          color: PALETTE.controlStateViolet,
        },
      ]

      items.forEach((item, idx) => {
        const rowY = iy + 46 + idx * 38
        ctx.fillStyle = item.color
        ctx.font = '700 10px "JetBrains Mono", monospace'
        ctx.fillText(`• ${item.label}`, ix + 14, rowY)
        ctx.fillStyle = '#94A3B8'
        ctx.font = '400 10px "Space Grotesk", sans-serif'
        ctx.fillText(item.detail, ix + 24, rowY + 15)
      })
    }

    // Bottom-Right Explanatory Color Legend & Guardrail Notice
    const lx = logicalWidth - 455
    const ly = logicalHeight - 102
    drawRoundedRect(ctx, lx, ly, 437, 84, 8)
    ctx.fillStyle = 'rgba(11, 16, 25, 0.9)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(52, 66, 87, 0.8)'
    ctx.stroke()

    const legendItems = [
      { color: PALETTE.neutralMaterial, label: 'Neutral Material (#344257)' },
      { color: PALETTE.primaryTransportCyan, label: 'Primary Transport (#00E5FF)' },
      { color: PALETTE.energyActuationGold, label: 'Energy / Actuation (#FFD166)' },
      { color: PALETTE.controlStateViolet, label: 'Control / State (#9D4EDD)' },
    ]

    legendItems.forEach((item, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const cx = lx + 16 + col * 212
      const cy = ly + 22 + row * 22
      ctx.fillStyle = item.color
      ctx.beginPath()
      ctx.arc(cx, cy - 4, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#E2E8F0'
      ctx.font = '500 10px "JetBrains Mono", monospace'
      ctx.fillText(item.label, cx + 11, cy)
    })

    ctx.fillStyle = '#64748B'
    ctx.font = '400 9.5px "Space Grotesk", sans-serif'
    ctx.fillText(
      'Explanatory overlays only (not literal emission). Adsorbents & cycles vary; no total removal guarantee.',
      lx + 14,
      ly + 70
    )

    ctx.restore()
  }, [frame, overlayFilters])

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-[#0B1019] shadow-2xl">
      <canvas
        ref={canvasRef}
        className="block h-auto w-full"
        aria-label="Deterministic 1,020-frame anatomy explainer of cryogenic feed purification upstream of a cold box"
      />
    </div>
  )
}
