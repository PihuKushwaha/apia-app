import { db } from "../firebase/config.js";
import {
  collection, doc, addDoc, updateDoc, onSnapshot, query, where, arrayUnion, serverTimestamp,
} from "firebase/firestore";
import { getCaseTypeConfig } from "../utils/caseTypes.js";

const casesCol = collection(db, "cases");

export function subscribeCases(ownerId, callback) {
  const q = query(casesCol, where("ownerId", "==", ownerId));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createCaseDoc({ ownerId, crimeTypeCode, sourceMode, extraction }) {
  const typeConfig = getCaseTypeConfig(crimeTypeCode);
  const steps = typeConfig ? typeConfig.steps : ["Investigation", "Case Diary", "Closure"];
  const crimeNo = extraction?.crimeNumber || `Case ${Date.now().toString().slice(-6)}`;

  const docRef = await addDoc(casesCol, {
    ownerId,
    crimeNo,
    title: extraction?.summary?.slice(0, 60) || `${typeConfig?.label || crimeTypeCode} case`,
    type: crimeTypeCode,
    typeLabel: typeConfig?.label || crimeTypeCode,
    status: "active",
    sourceMode,
    workflow: steps.map((step, i) => ({ step, done: false, content: "" })),
    extraction: extraction || null,
    timeline: [{ time: new Date().toLocaleTimeString(), label: "Case created" }],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateWorkflowField(caseId, workflow) {
  await updateDoc(doc(db, "cases", caseId), { workflow });
}

export async function updateExtractionField(caseId, extraction) {
  await updateDoc(doc(db, "cases", caseId), { extraction });
}

export async function pushTimelineEvent(caseId, event) {
  await updateDoc(doc(db, "cases", caseId), { timeline: arrayUnion(event) });
}