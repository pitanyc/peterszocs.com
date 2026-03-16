# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Peter Szocs, built on the Start Bootstrap Agency theme (v7.0.12). Single-page site with portfolio, about timeline, music section, and contact form.

## Build Commands

- `npm start` — Build everything, launch BrowserSync dev server with live reload, and watch for changes
- `npm run build` — Full production build (clean → pug → scss → scripts → assets)
- `npm run build:pug` — Compile Pug templates to HTML
- `npm run build:scss` — Compile SCSS to CSS with autoprefixer
- `npm run build:scripts` — Copy JS to dist with copyright header
- `npm run build:assets` — Copy assets to dist
- `npm run clean` — Delete dist directory

No test framework or linter is configured.

## Architecture

**Build system**: Custom Node.js scripts in `scripts/` using shelljs, chokidar, sass, postcss/autoprefixer, and prettier. No Gulp or Webpack.

**Source → Output pipeline**: All source files live in `src/`, compiled output goes to `dist/`. Never edit `dist/` directly.

- `src/pug/` → `dist/index.html` (Pug templates compiled and formatted with Prettier)
- `src/scss/` → `dist/css/styles.css` (SCSS compiled with autoprefixer)
- `src/js/scripts.js` → `dist/js/scripts.js` (copied with copyright header)
- `src/assets/` → `dist/assets/` (copied as-is)

**Pug template structure**: `src/pug/index.pug` is the entry point that includes partials from `src/pug/includes/` (nav, header, about, portfolio, music, contact, footer) and modals from `includes/modals/`.

**SCSS structure**: `src/scss/styles.scss` imports Bootstrap from node_modules, then layers custom overrides organized as `variables/`, `components/`, and `sections/`. Primary brand color is `#ffc800`.

**Stack**: Bootstrap 5.2.3, Font Awesome 6.3.0 (CDN), Google Fonts (Montserrat, Roboto Slab).

## Key Conventions

- 4-space indentation, UTF-8, LF line endings (per `.editorconfig`)
- Contact form uses SB Forms — requires `data-sb-form-api-token` attribute with a valid API token
