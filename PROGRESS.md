# APIA build progress

## This session - Case system rebuilt around real data + case-type-specific flow
- [x] 20 case types with proper document/step lists (src/utils/caseTypes.js) — no generic "other" catch-all
- [x] AI extraction rewritten - pulls crime number, police station, district, dates, complainant,
      ALL accused (array), ALL witnesses (array), acts/sections, brief facts - not just a summary
- [x] Case type auto-detected from the list above; steps shown match the case type
- [x] Case Workspace restructured to 2 tabs: "Docs & Details" and "Case Conclusion" (locked until every step done)
- [x] Case Conclusion (once unlocked): real AI chat scoped to that case's data + bilingual document generation with Print/Download
- [x] My Cases: green/red blinking status dot, done/pending filter, floating AI chat across ALL cases
- [x] Dashboard: Total / Done / Pending / Not Started counts

## Honest limitations
- AI chat can only ANSWER using data already saved - can't take actions via chat yet (e.g. "mark step X done")
- Step content is free text per step, not an auto-drafted official-format document for each of the ~200 document types - only the final Case Conclusion document is fully AI-drafted
- Legal Knowledge Base (BNS/BNSS/BSA) is still empty - needs a decision on sourcing (web search vs your own PDF) before I write it, since getting legal sections wrong is risky
- Evidence Center, Court Management, Calendar, Notifications, Reports & Analytics, Document Center, Administration - not built yet
- Firestore/Storage security rules still not written

## Setup reminder
- npm install (no new packages this session)