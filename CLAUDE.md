# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Minga** website — a static landing page for a two-person DevOps consultancy focused on reducing cloud costs for startups and small enterprises in Chile. The site is in Spanish and uses a deliberately austere, monochromatic visual language with `Geist` / `Geist Mono` (Google Fonts) and a small blue accent.

The repo was originally built for *Huella Gestión*, then briefly repurposed for *Ammonita*, and is now Minga. Some artifacts of those earlier iterations may still be present.

## Running locally

```bash
python -m http.server 8000
```

No build step. Open `http://localhost:8000`.

## Architecture

- `index.html` — the entire site. Single page, semantic sections (`hero`, `services`, `approach`, `team`, `cta`, `footer`).
- `css/styles.css` — all styles. Uses CSS custom properties for the color/typography system; sections are clearly delimited with banner comments (`/* ================== HERO ================== */`).
- Brand mark is an inline SVG inside `nav.top` and reused in the footer.
- The "before / after migration" cost dashboard in the hero is a hand-built inline SVG chart (`.chart-svg`). The y-axis maps `y=150 → $0`, `y=110 → $5k`, `y=70 → $10k`, `y=30 → $15k` (i.e. ~8px per $1k). Keep the chart values consistent with the KPI tile (`Gasto mensual`).
- Skill icons under each engineer load from the Devicon CDN (`https://cdn.jsdelivr.net/gh/devicons/devicon/...`).

## Contact form

The current site has **no contact form** — the CTA is a `mailto:hola@minga.cl` link. No backend is invoked at runtime.

A `backend/contact-form-api/` directory still exists from the prior Ammonita iteration (a Cloudflare Worker that posted to Resend). It is **not wired to the current site** and references `contacto.ammonita.cl` / `ammonita.cl` CORS / `contacto-web@ammonita.cl`. If a contact form is reintroduced for Minga, this Worker would need its env vars, CORS origins, and the frontend `fetch` URL all updated.

## Conventions

- Site copy is Spanish. Avoid mixing in English/anglicisms (e.g. `pricing`, `lock-in`, `engagement`, `handoffs`) — prefer Spanish equivalents (`modelo`, `sin amarras`, etc.).
- Voice is direct and austere; do not write copy that diminishes competitors.
- Tech terms that are universally used in industry (e.g. `DevOps`, `IAM`, `Kubernetes`) are fine to keep in English.
