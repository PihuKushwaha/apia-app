# APIA - AI Police Investigation Assistant

Phase-1 skeleton (Dashboard, My Cases, Case Workspace tabs, AI Checklist foundation).

## Stack
- React + Vite
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- React Router

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill Firebase project keys
3. `npm run dev`

## Structure
- `src/pages/Dashboard` - officer's home screen with alert cards
- `src/pages/Cases/MyCases.jsx` - list of officer's cases
- `src/pages/Cases/CaseWorkspace/` - everything inside a single case (Overview, Documents, Timeline, Evidence, AI Chat tabs)
- `src/pages/LegalKnowledgeBase`, `src/pages/Reports` - global (outside-case) tools, placeholders for later phase
- `src/components/common` - shared UI: StatusCard, TimelineStep, DocumentPreview, VoiceButton
- `src/context` - AuthContext, CaseContext
- `src/firebase/config.js` - Firebase init

## Deploy
Vercel: connect the GitHub repo, framework preset "Vite", it auto-detects build command.
