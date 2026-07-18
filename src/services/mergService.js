import { db } from "../firebase/config.js";
import {
  collection, doc, addDoc, updateDoc, onSnapshot, query, where, arrayUnion, serverTimestamp,
} from "firebase/firestore";

export const DEFAULT_WORKFLOW = [
  "Hospital Intimation", "Merg Registration", "Call Panch Witnesses", "Prepare Panchanama",
  "Identification of Deceased", "Body Inspection", "Witness Statements", "Doctor Statement",
  "Postmortem Requisition", "Receive Postmortem Report", "Case Diary", "Final Closure",
];

const mergCol = collection(db, "mergCases");
const doctorCol = collection(db, "doctorTasks");

export function subscribeMergCases(ownerId, callback) {
  const q = query(mergCol, where("ownerId", "==", ownerId));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export function subscribeDoctorTasks(ownerId, callback) {
  const q = query(doctorCol, where("ownerId", "==", ownerId));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function createMergCaseDoc({ ownerId, formData }) {
  const docRef = await addDoc(mergCol, {
    ownerId,
    ...formData,
    workflow: DEFAULT_WORKFLOW.map((step, i) => ({ step, done: i === 0 })),
    drafts: [
      { title: "Hospital Intimation", status: "approved", content: "Hospital intimation received." },
      { title: "Merg Registration", status: "draft", content: `Merg registered on ${formData.registrationDate || "-"}.` },
    ],
    timeline: [{ time: new Date().toLocaleTimeString(), label: "Merg Registered" }],
    statements: [],
    panchanama: null,
    createdAt: serverTimestamp(),
  });

  if (formData.treatingDoctor) {
    await addDoc(doctorCol, {
      ownerId,
      doctorName: formData.treatingDoctor,
      type: "Statement",
      mergId: docRef.id,
      dueDate: "",
      priority: "normal",
      status: "pending",
    });
  }

  return docRef.id;
}

export async function updateWorkflow(mergId, workflow) {
  await updateDoc(doc(db, "mergCases", mergId), { workflow });
}

export async function updateDrafts(mergId, drafts) {
  await updateDoc(doc(db, "mergCases", mergId), { drafts });
}

export async function pushMergTimeline(mergId, event) {
  await updateDoc(doc(db, "mergCases", mergId), { timeline: arrayUnion(event) });
}

export async function pushStatement(mergId, statement) {
  await updateDoc(doc(db, "mergCases", mergId), { statements: arrayUnion(statement) });
}

export async function savePanchanamaDoc(mergId, panchanama, drafts) {
  await updateDoc(doc(db, "mergCases", mergId), { panchanama, drafts });
}

export async function resolveDoctorTaskDoc(taskId) {
  await updateDoc(doc(db, "doctorTasks", taskId), { status: "done" });
}