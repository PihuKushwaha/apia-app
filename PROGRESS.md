# APIA build progress

## PRIORITY 0 - Merg Investigation Module - CORE LOOP DONE + FIRESTORE WIRED
- [x] Modules 1-13 working
- [x] Firestore wiring (mergCases + doctorTasks collections, real-time subscriptions)
- [ ] Firestore security rules (currently open/default — MUST lock down before real use)

## Phase 1 - Main APIA app - CORE LOOP DONE + FIRESTORE WIRED
- [x] CaseContext, Dashboard, My Cases, New Case Intake, Case Workspace tabs
- [x] Firestore wiring (cases collection, real-time subscriptions)
- [x] Auth wiring - Firebase Phone OTP login (Login.jsx, AuthContext, ProtectedRoute)
- [ ] Firestore security rules
- [ ] Voice command wiring (button exists, not connected)
- [ ] AI Chat - connect to real AI backend (currently placeholder echo reply)

## Phase 2+ (not started)
- Missing Info Detection, Witness/Accused management, Cyber Crime Toolkit, Financial Investigation Module
- Legal Knowledge Base + SOP Navigator, Reports module, Notifications, Charge Sheet Assistant

## IMPORTANT before real use
- Firebase project .env values must be filled (VITE_FIREBASE_* keys)
- Phone Auth must be enabled in Firebase Console (Authentication > Sign-in method)
- Firestore must be created in Firebase Console (Native mode)
- Firestore security rules NOT written yet — add rules restricting reads/writes to `ownerId == request.auth.uid` before going live