import React, { useState } from 'react'
import { Copy, Check, ExternalLink, BookOpen, ShieldAlert, PlayCircle } from 'lucide-react'
import { SCENES } from '../data/explainerTimeline'
import { trackCanonicalEvent } from '../utils/analytics'

interface MediumArticleSectionProps {
  onJumpToFrame: (frame: number) => void
}

export const MediumArticleSection: React.FC<MediumArticleSectionProps> = ({ onJumpToFrame }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyMarkdown = () => {
    const summaryText = `# Why Cryogenic Air Separation Freezes Solid Without Front-End Feed Purification: A 1,020-Frame Code-Driven Anatomy\n\nBLUF: A cryogenic nitrogen or air separation plant cannot cool atmospheric air to distillation temperatures until water vapor (H2O) and carbon dioxide (CO2) are stripped upstream. See MEDIUM-ARTICLE-Cursor.md in the repository for the full SEO/GEO/AEO publication markdown.`
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true)
      trackCanonicalEvent('content_engagement_click', {
        content_type: 'medium_article_copy',
        cta_target: 'copy_markdown_btn',
        placement: 'article_header',
      })
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <article className="mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-[#111927]/90 p-6 sm:p-10 shadow-2xl">
      {/* Editorial Metadata Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 py-1 font-mono text-xs font-semibold text-[#00E5FF]">
            <BookOpen className="h-3.5 w-3.5" />
            MEDIUM PUBLICATION EDITION // SEO / GEO / AEO OPTIMIZED
          </span>
          <span className="font-mono text-xs text-slate-400">
            Sr. Editor / Product / Developer-Writer Desk
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0B1019] px-3 py-1.5 font-mono text-xs text-slate-200 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'COPIED BLUF' : 'COPY ARTICLE BLUF'}
          </button>
          <a
            href="https://www.airproducts.com/supply-modes/gen-gas-on-site/onsite-nitrogen-generation/cryogenic-nitrogen-plant"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackCanonicalEvent('content_engagement_click', {
                content_type: 'external_reference',
                destination: 'airproducts_cryogenic_n2',
                placement: 'article_header',
              })
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFD166]/40 bg-[#FFD166]/10 px-3 py-1.5 font-mono text-xs font-semibold text-[#FFD166] transition hover:bg-[#FFD166]/20"
          >
            Mechanism Reference: Air Products
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Article H1 */}
      <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-4xl leading-tight">
        Why Cryogenic Air Separation Freezes Solid Without Front-End Feed Purification: A 1,020-Frame Code-Driven Anatomy
      </h1>

      <p className="mt-3 text-base text-slate-400 sm:text-lg">
        How dual-vessel molecular sieve and desiccant adsorption removes moisture and carbon dioxide upstream of a cryogenic cold box, explained through a deterministic 34-second (30 fps) interactive motion schematic.
      </p>

      {/* Hero Image Showcase */}
      <figure className="my-8 overflow-hidden rounded-xl border border-slate-800 bg-[#0B1019]">
        <img
          src="./assets/cryo-purification-hero.svg"
          alt="Cryogenic Feed Purification Front-End Adsorber Cutaway and Cold Box Protection Hero Diagram"
          className="h-auto w-full object-cover"
        />
        <figcaption className="border-t border-slate-800/80 bg-[#0B1019] px-4 py-2.5 font-mono text-xs text-slate-400">
          FIG 1. HERO ARCHITECTURAL DIAGRAM: Dual-vessel front-end purification skid (Vessel A online co-current adsorption; Vessel B counter-current heated waste-N2 regeneration) protecting the downstream cryogenic plate-fin heat exchanger and distillation column.
        </figcaption>
      </figure>

      {/* BLUF Callout */}
      <div className="my-6 rounded-xl border-l-4 border-[#00E5FF] bg-[#0B1019] p-5">
        <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#00E5FF]">
          Bottom Line Up Front (BLUF)
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base">
          A cryogenic nitrogen or air separation plant cannot cool atmospheric air to distillation temperatures until water vapor (H2O) and carbon dioxide (CO2) are stripped upstream. If either compound crosses the cold box boundary, it transitions directly into solid ice or dry-ice frost inside millimeter-scale brazed aluminum heat exchanger passages, restricting flow, degrading heat transfer, and forcing a costly plant warm-up defrost. Front-end purification solves this through alternating dual-vessel adsorption beds that arrest bulk moisture first and trace CO2 second, while regenerating the offline vessel with dry waste nitrogen returning from the distillation column.
        </p>
      </div>

      {/* Section 1 */}
      <section className="mt-8 space-y-4 text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-100 sm:text-2xl">
          1. The Engineering Problem: Phase-Change Plugging Before Distillation Begins
        </h2>
        <p>
          Atmospheric air looks clean at ambient temperature, yet every cubic meter of compressed intake air carries water vapor, roughly 400+ ppm of carbon dioxide, and trace light hydrocarbons. In an on-site cryogenic nitrogen plant, such as the process architecture documented by{' '}
          <a
            href="https://www.airproducts.com/supply-modes/gen-gas-on-site/onsite-nitrogen-generation/cryogenic-nitrogen-plant"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00E5FF] underline decoration-[#00E5FF]/40 underline-offset-4 hover:decoration-[#00E5FF]"
          >
            Air Products for Cryogenic Nitrogen Generation
          </a>
          , separating nitrogen from oxygen relies on fractional distillation at cryogenic temperatures inside an insulated cold box.
        </p>
        <p>
          To reach cryogenic temperatures economically, incoming compressed air must pass through a <strong>Main Heat Exchanger (PHX)</strong>, typically a brazed aluminum plate-fin heat exchanger containing serrated millimeter-scale passages. Inside those passages, warm feed air cools against returning cold product nitrogen and waste gas streams:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-slate-300">
          <li>
            <strong className="text-[#00E5FF]">Water Vapor (H2O):</strong> Freezes at 0°C (273.15 K). Even after mechanical compression aftercoolers and condensate knock-out drums remove liquid droplets, the air leaves saturated with water vapor at operating pressure.
          </li>
          <li>
            <strong className="text-[#9D4EDD]">Carbon Dioxide (CO2):</strong> Undergoes desublimation (direct vapor-to-solid deposition) at cryogenic temperatures well above the boiling point of nitrogen and oxygen.
          </li>
          <li>
            <strong className="text-[#FFD166]">Micro-Channel Vulnerability:</strong> Solid deposition of either H2O or CO2 inside narrow plate-fin passages rapidly increases differential pressure (Delta-P), starves the distillation column of feed, and requires shutting down the cold box for a full thermal warm-up (derime).
          </li>
        </ul>
      </section>

      {/* Section 2: Interactive Scene Breakdown Table */}
      <section className="mt-10 space-y-4 text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-100 sm:text-2xl">
          2. Frame-Exact Choreography: How the 34-Second (1,020-Frame) Explainer Dissects the Process
        </h2>
        <p>
          Static Piping and Instrumentation Diagrams (P&amp;IDs) represent adsorber vessels as identical boxes, obscuring axial selectivity, advancing Mass-Transfer Zones (MTZ), and counter-current regeneration coupling. Click any scene below to jump the live canvas directly to that frame window:
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {SCENES.map((s) => (
            <div
              key={s.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-[#0B1019] p-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-[#00E5FF]">
                  <span>SCENE 0{s.index}</span>
                  <span>•</span>
                  <span>FRAMES {s.startFrame}–{s.endFrame}</span>
                  <span>•</span>
                  <span className="text-[#FFD166]">{s.startSec}–{s.endSec}s</span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.mechanismSummary}</p>
                <p className="font-mono text-[11px] text-slate-500">
                  Limit / Uncertainty: {s.uncertaintyAndLimits}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onJumpToFrame(s.startFrame)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-[#00E5FF]/50 bg-[#00E5FF]/10 px-3.5 py-2 font-mono text-xs font-bold text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-[#0B1019] sm:self-center"
              >
                <PlayCircle className="h-4 w-4" />
                SCRUB TO F{s.startFrame}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Technical Deep Dive */}
      <section className="mt-10 space-y-4 text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-100 sm:text-2xl">
          3. Why Layered Adsorbents and Counter-Current Regeneration Matter
        </h2>
        <p>
          Two physical mechanisms separate an industrial front-end purifier from a simple desiccant cartridge:
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-[#0B1019] p-5">
            <h3 className="font-mono text-sm font-bold text-[#00E5FF]">
              A. Staged Selectivity (Preventing CO2 Roll-Up)
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Hydrophilic molecular sieve zeolites (such as 13X/NaX) have a strong electrostatic affinity for polar water molecules. If bulk water vapor enters an unlayered zeolite bed, water competitively displaces already-adsorbed CO2 deeper into the bed and demands high regeneration heat. Placing a moisture-selective desiccant (activated alumina or silica gel) in the bottom inlet layer arrests bulk moisture first, leaving the upper molecular sieve layer to capture trace CO2 and light hydrocarbons.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0B1019] p-5">
            <h3 className="font-mono text-sm font-bold text-[#FFD166]">
              B. Counter-Current Dry Waste-N2 Sweep
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              During adsorption, feed air flows upward (bottom-to-top), concentrating trapped moisture near the bottom inlet. During regeneration (Frames 510–749), dry low-pressure waste nitrogen returning from the cold box is warmed and swept downward (top-to-bottom). This counter-current reversal expels moisture directly out the bottom vent without pushing hot water vapor upward through the sensitive upper zeolite sieve.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: FAQ for AEO */}
      <section className="mt-10 space-y-4 text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-100 sm:text-2xl">
          4. Technical FAQ (Answer Engine &amp; Engineering Reference)
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-800 bg-[#0B1019] p-4">
            <h3 className="font-semibold text-slate-100">
              What do the four explanatory colors (#344257, #00E5FF, #FFD166, #9D4EDD) represent?
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              They are non-literal engineering overlays on a #0B1019 dark stage: #344257 denotes neutral structural pressure boundaries; #00E5FF denotes primary carrier gas transport and moisture capture; #FFD166 denotes thermal energy input, valve actuation, and purge losses; and #9D4EDD denotes sequence control logic, CO2 molecular sieve capture, and trace analyzer interlocks.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0B1019] p-4">
            <h3 className="font-semibold text-slate-100">
              Does a front-end purifier operate without thermodynamic losses?
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              No. As shown in Scene 5 (Frames 750–1019), front-end purification incurs packed-bed and filter pressure drop (Delta-P), regeneration heater energy consumption, blowdown gas loss during vessel depressurization, and dry waste nitrogen purge diversion.
            </p>
          </div>
        </div>
      </section>

      {/* Factual & Production Guardrail Box */}
      <div className="mt-10 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-slate-300">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#FFD166]" />
        <div>
          <strong className="font-mono text-[#FFD166]">
            FACTUAL SCOPE &amp; PRODUCTION GUARDRAILS:
          </strong>{' '}
          The Air Products reference supports the underlying industrial process and front-end purification role upstream of a cryogenic cold box. Camera moves, color palette, cutaways, and 1,020-frame timing are original illustrative directions, not experimentally validated observations. Adsorbents and cycles vary; no regeneration recipe or total contaminant-removal guarantee is claimed. This explainer is not a certified design, simulation result, or operational manual for hazardous equipment.
        </div>
      </div>
    </article>
  )
}
