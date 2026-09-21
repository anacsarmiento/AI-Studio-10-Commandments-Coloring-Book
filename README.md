# 10 Commandments Coloring Book

> An experimental app testing **Gemini's image generation capabilities** for creating themed, family-friendly coloring pages on demand.

Built with React, TypeScript, Vite, and Google's Gemini API.

---

## The Experiment

Generative image models are increasingly capable — but how well do they handle the very specific constraints of a coloring book? Clean line art. No shading. Kid-appropriate composition. Recognizable subjects.

This project puts Gemini's image generation to the test using a classic themed series — the Ten Commandments — as the creative brief.

---

## What It Does

The app generates a printable coloring page for each commandment, styled as clean black-and-white line art suitable for a child (or adult) to color. Each generation is a live test of:

- **Prompt engineering** — how much creative direction the model needs
- **Style consistency** — whether outputs feel like a cohesive series
- **Content appropriateness** — automatic guardrails for a family audience
- **Print readiness** — line weight, contrast, and white-space balance

---

## Why This Matters

Applied AI isn't only about revenue dashboards and enterprise workflows. Some of the most interesting learnings about model capabilities come from small, constrained experiments with clear success criteria — like "does this look like a coloring page a 6-year-old could color?"

This repo is a public notebook: build fast, test a capability, document the learning.

---

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite
- **AI:** Google Gemini API (image generation)
- **Deployment:** Google AI Studio compatible

---

## Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone and install
git clone https://github.com/anacsarmiento/AI-Studio-10-Commandments-Coloring-Book.git
cd AI-Studio-10-Commandments-Coloring-Book
npm install

# 2. Configure your API key
# Create .env.local and add:
GEMINI_API_KEY=your_key_here

# 3. Run the dev server
npm run dev
```

Grab your Gemini API key from [Google AI Studio](https://aistudio.google.com/).

---

## Project Structure

```
AI-Studio-10-Commandments-Coloring-Book/
├── Home.tsx          # Main app component
├── index.tsx         # Entry point
├── index.html        # HTML shell
├── index.css         # Styles
├── metadata.json     # App configuration
└── vite.config.ts    # Build configuration
```

---

## Observations

Some of what this experiment surfaced (documented for future reference):

- Coloring-book-appropriate line art requires very specific style anchoring in prompts
- Gemini's image outputs benefit from explicit "no shading, no gradients, black outlines only" instructions
- Consistency across a series is harder than any single generation
- Content appropriateness is well-handled by default guardrails for kid-friendly themes

---

## About the Builder

Built by [Ana C. Sarmiento](https://acsarmiento.com) — Applied AI Practitioner.

I build production AI systems for revenue and media — and small experiments like this to stress-test what new model capabilities can actually do.

- **Website:** [acsarmiento.com](https://acsarmiento.com)
- **LinkedIn:** [linkedin.com/in/anasarmiento](https://www.linkedin.com/in/anasarmiento)
- **X:** [@AC_Sarmiento_](https://x.com/AC_Sarmiento_)

---

*Small experiments. Real learnings.*
