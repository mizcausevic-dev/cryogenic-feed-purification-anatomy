# Cryogenic Feed Purification: 1,020-Frame Code-Driven Anatomy Explainer

![Cryogenic Feed Purification Hero Diagram](./public/assets/cryo-purification-hero.png)

> **GitHub About (1-line):** Deterministic 34s (1,020-frame @ 30fps) code-driven anatomy explainer of cryogenic feed purification upstream of a cold box, with interactive cutaway stage and SEO-optimized Medium article.
>
> **GitHub Topics:** `cryogenics`, `air-separation`, `molecular-sieve`, `adsorption`, `chemical-engineering`, `motion-explainer`, `canvas-2d`, `typescript`, `react`, `technical-visualization`

---

## Overview

This repository implements a deterministic **34-second, 30 fps (`1,020` frames, indexed `0–1019`)** anatomy-style motion explainer of **cryogenic feed purification** in the **Industrial Gases & Cryogenics** vertical, grounded in the [Air Products Cryogenic Nitrogen Plant](https://www.airproducts.com/supply-modes/gen-gas-on-site/onsite-nitrogen-generation/cryogenic-nitrogen-plant) process architecture.

Before atmospheric air enters a cryogenic cold box, water vapor ($\text{H}_2\text{O}$) and carbon dioxide ($\text{CO}_2$) must be stripped so they do not solidify inside millimeter-scale brazed aluminum plate-fin heat exchanger passages or distillation columns.

### Visual & Explanatory Color Grammar

* **Technical Stage (`#0B1019`):** High-contrast dark reference plane with spatial coordinate grid.
* **Neutral Structural Material (`#344257`):** Adsorber pressure vessels, manifolds, particulate filter housing, brazed aluminum heat exchanger (PHX), and cryogenic distillation column.
* **Primary Transport / Signal (`#00E5FF`):** Feed air carrier stream, moisture front arrest, and purified feed pathway into the cold box.
* **Energy / Actuation (`#FFD166`):** Regeneration heater thermal input, counter-current thermal desorption wave, valve actuation states, and visible thermodynamic/purge losses.
* **Control / State (`#9D4EDD`):** Molecular sieve $\text{CO}_2$ capture zone, advancing Mass-Transfer Zone (MTZ) guard, sequence controller, and `AT-101` trace analyzer interlock.

*Note: Colors are explanatory overlays, not literal optical emission.*

---

## Camera & Frame Choreography (`Frames 0–1019` | `34s @ 30 fps`)

| Scene | Frame Index | Timecode | Camera & Cutaway Action | Primary Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `0–149` | `0.0s–5.0s` | Establish full assembly, then measured three-quarter push toward active region | Reveal dual switching adsorber vessels upstream of the cryogenic cold box (`Vessel A` online adsorption, `Vessel B` isolated). |
| **2** | `150–299` | `5.0s–10.0s` | Sectional close-up of `Vessel A` + qualitative axial MTZ loading inset | Selective removal of bulk $\text{H}_2\text{O}$ in the lower desiccant layer and trace $\text{CO}_2$ in the upper molecular sieve layer. |
| **3** | `300–509` | `10.0s–17.0s` | Track purified feed pathway across top header, dust filter, and analyzer | Separate primary transport (`#00E5FF`), valve actuation (`#FFD166`), and trace analyzer control interlock (`#9D4EDD`). |
| **4** | `510–749` | `17.0s–25.0s` | Focus on `Vessel B` regeneration + qualitative thermal/desorption curve inset | Conceptual counter-current heated dry waste-$\text{N}_2$ sweep (Depressurize $\rightarrow$ Thermal Desorption $\rightarrow$ Cooling $\rightarrow$ Repressurize). |
| **5** | `750–1019` | `25.0s–34.0s` | Pull back to stable system overview with cold box & losses ledger | Protect downstream plate-fin heat exchanger and distillation column while retaining visible $\Delta P$, heater duty, and purge losses. |

---

## Included Artifacts

* **Interactive Web Application (`src/`):** Vite + React 19 + TypeScript + Tailwind CSS v4 + HTML5 Canvas 2D deterministic renderer.
* **Full Medium Publication Article:** [`MEDIUM-ARTICLE-Cursor.md`](./MEDIUM-ARTICLE-Cursor.md) (and [`cryogenic-feed-purification-article-Claude.md`](./cryogenic-feed-purification-article-Claude.md)), written in Senior Editor / Product / Developer-Writer voice with SEO/GEO/AEO structure.
* **Hero Architectural Diagram:** [`public/assets/cryo-purification-hero.svg`](./public/assets/cryo-purification-hero.svg) and rasterized [`public/assets/cryo-purification-hero.png`](./public/assets/cryo-purification-hero.png) (`1600x840`).
* **7-Theme Executive Dashboard:** [`dashboard-Cursor.html`](./dashboard-Cursor.html) (Bento Grid, Cosmic Cyber, Swiss Architect, Aqua Web 2.0, Pop Brutalist, Steel Tactical, Parchment, with light/dark persistence).
* **Standalone State-Machine Visualizer:** [`visualization-Cursor.html`](./visualization-Cursor.html) (single-file HTML with zero external dependencies).

---

## Running Locally

```bash
npm install
npm run dev
```

To run typechecking, linting, and production build:

```bash
npm run lint
npm run build
```

---

## Technical Limits & Reference Scope

* **Mechanism Reference:** [Air Products — Cryogenic Nitrogen Plant](https://www.airproducts.com/supply-modes/gen-gas-on-site/onsite-nitrogen-generation/cryogenic-nitrogen-plant).
* **Guardrails:** Adsorbents and cycles vary across plants and licensors. No regeneration recipe or total contaminant-removal guarantee is claimed. All curves are qualitative illustrations of physical trends, not empirical plant telemetry or certified engineering designs. No operational instructions for hazardous equipment are provided.
