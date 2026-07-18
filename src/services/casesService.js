import { db } from "../firebase/config.js";
import {
  collection, doc, addDoc, updateDoc, onSnapshot, query, where, arrayUnion, serverTimestamp,
} from "firebase/firestore";
import { getWorkflowForType } from "../utils/caseWorkflows.js";

const casesCol = collection(db, "cases");

export function subscribeCases(ownerId, callback) {
  const q = query(casesCol, where("ownerId", "==", ownerId));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createCaseDoc({ ownerId, crimeType, sourceText, sourceMode, extraction }) {
  const steps = getWorkflowForType(crimeType);
  const crimeNo = `Crime No. ${Math.floor(100 + Math.random() * 900)}/2026`;
  const docRef = await addDoc(casesCol, {
    ownerId,
    crimeNo,
    title: extraction?.summary?.slice(0, 60) || (sourceText ? sourceText.slice(0, 60) : `${crimeType} case`),
    type: crimeType,
    status: "active",
    sourceMode,
    workflow: steps.map((step, i) => ({ step, done: i === 0 })),
    documents: [
      { title: "FIR / Complaint", status: "approved", content: sourceText || extraction?.summary || `${crimeType} complaint received.` },
    ],
    extraction: extraction || null,
    evidence: [],
    timeline: [{ time: new Date().toLocaleTimeString(), label: "Case created" }],
    chat: [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
 

export async function toggleWorkflowStepDoc(caseId, workflow) {
  await updateDoc(doc(db, "cases", caseId), { workflow });
}

export async function updateDocumentsField(caseId, documents) {
  await updateDoc(doc(db, "cases", caseId), { documents });
}

export async function pushEvidence(caseId, item) {
  await updateDoc(doc(db, "cases", caseId), { evidence: arrayUnion(item) });
}

export async function pushTimelineEvent(caseId, event) {
  await updateDoc(doc(db, "cases", caseId), { timeline: arrayUnion(event) });
}

export async function pushChatMessage(caseId, message) {
  await updateDoc(doc(db, "cases", caseId), { chat: arrayUnion(message) });
}