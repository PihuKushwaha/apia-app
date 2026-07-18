import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext.jsx";
import {
  subscribeCases,
  createCaseDoc,
  toggleWorkflowStepDoc,
  updateDocumentsField,
  pushEvidence,
  pushTimelineEvent,
  pushChatMessage,
} from "../services/casesService.js";

const CaseContext = createContext(null);

export function CaseProvider({ children }) {
  const { officer } = useAuthContext() || {};
  const [cases, setCases] = useState([]);

  useEffect(() => {
    if (!officer) {
      setCases([]);
      return;
    }
    const unsub = subscribeCases(officer.uid, setCases);
    return () => unsub();
  }, [officer]);

  const createCase = async (data) => {
    if (!officer) return null;
    return await createCaseDoc({ ownerId: officer.uid, ...data });
  };

  const getCase = (id) => cases.find((c) => c.id === id);

  const toggleWorkflowStep = async (id, stepIndex) => {
    const c = getCase(id);
    if (!c) return;
    const workflow = c.workflow.map((w, i) => (i === stepIndex ? { ...w, done: !w.done } : w));
    await toggleWorkflowStepDoc(id, workflow);
  };

  const approveDocument = async (id, docIndex) => {
    const c = getCase(id);
    if (!c) return;
    const documents = c.documents.map((d, i) => (i === docIndex ? { ...d, status: "approved" } : d));
    await updateDocumentsField(id, documents);
  };

  const addDocument = async (id, doc) => {
    const c = getCase(id);
    if (!c) return;
    await updateDocumentsField(id, [...c.documents, doc]);
  };

  const addEvidence = async (id, item) => {
    await pushEvidence(id, item);
  };

  const addTimelineEvent = async (id, label) => {
    await pushTimelineEvent(id, { time: new Date().toLocaleTimeString(), label });
  };

  const addChatMessage = async (id, message) => {
    await pushChatMessage(id, message);
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        createCase,
        getCase,
        toggleWorkflowStep,
        approveDocument,
        addDocument,
        addEvidence,
        addTimelineEvent,
        addChatMessage,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export const useCaseContext = () => useContext(CaseContext);