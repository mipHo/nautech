# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Ammonita** website — a static frontend for a DevOps consulting company focused on reducing cloud costs for small enterprises and startups, plus a Cloudflare Worker backend for the contact form. The codebase was originally built for Huella Gestión and is being repurposed for Ammonita.

## Running the Frontend

Serve the static site locally:

```bash
python -m http.server 8000
```

The site is a single-page static HTML/CSS/JS app (`index.html`, `index.js`, `css/`). No build step required.

## Backend (Contact Form API)

The backend lives in `backend/contact-form-api/` and is a Cloudflare Worker deployed via Wrangler.

```bash
cd backend/contact-form-api

# Install dependencies
npm install

# Local development server (http://localhost:8787)
npm run dev

# Run tests
npm test

# Deploy to Cloudflare
npm run deploy
```

Tests use Vitest with `@cloudflare/vitest-pool-workers`.

## Architecture

- **Frontend** (`index.html` + `index.js`): Single-page static site using Bootstrap 4. The contact form POSTs JSON to `https://contacto.huellagestion.cl`.
- **Backend** (`backend/contact-form-api/src/index.js`): Cloudflare Worker that receives POST requests, validates fields, and sends email via the Resend API. CORS is restricted to `huellagestion.cl` and `www.huellagestion.cl`.
- **Email delivery**: Uses Resend API. `FROM_EMAIL`, `TO_EMAIL`, and `RESEND_API_KEY` are configured in `wrangler.jsonc` vars (note: the API key in `wrangler.jsonc` is exposed in plaintext — it should be moved to a Wrangler secret).

## Key Notes

- The `RESEND_API_KEY` in `wrangler.jsonc` should be stored as a Wrangler secret (`wrangler secret put RESEND_API_KEY`) rather than in the config file.
- The frontend alert messages in `index.js` are in English while the rest of the site is in Spanish — these may need to be localized.
