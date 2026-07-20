import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext.jsx";
import {
  subscribeCases,
  createCaseDoc,
  updateWorkflowField,
  updateExtractionField,
  pushTimelineEvent,
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

  const isCaseComplete = (c) => c.workflow.length > 0 && c.workflow.every((w) => w.done);

  const toggleWorkflowStep = async (id, stepIndex) => {
    const c = getCase(id);
    if (!c) return;
    const workflow = c.workflow.map((w, i) => (i === stepIndex ? { ...w, done: !w.done } : w));
    await updateWorkflowField(id, workflow);
  };

  const saveStepContent = async (id, stepIndex, content) => {
    const c = getCase(id);
    if (!c) return;
    const workflow = c.workflow.map((w, i) =>
      i === stepIndex ? { ...w, content, done: content.trim().length > 0 } : w
    );
    await updateWorkflowField(id, workflow);
  };

  const updateExtraction = async (id, extraction) => {
    await updateExtractionField(id, extraction);
  };

  const addTimelineEvent = async (id, label) => {
    await pushTimelineEvent(id, { time: new Date().toLocaleTimeString(), label });
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        createCase,
        getCase,
        isCaseComplete,
        toggleWorkflowStep,
        saveStepContent,
        updateExtraction,
        addTimelineEvent,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export const useCaseContext = () => useContext(CaseContext);
