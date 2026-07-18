import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext.jsx";
import {
  subscribeMergCases,
  subscribeDoctorTasks,
  createMergCaseDoc,
  updateWorkflow,
  updateDrafts,
  pushMergTimeline,
  pushStatement,
  savePanchanamaDoc,
  resolveDoctorTaskDoc,
} from "../services/mergService.js";

const MergContext = createContext(null);

export function MergProvider({ children }) {
  const { officer } = useAuthContext() || {};
  const [mergCases, setMergCases] = useState([]);
  const [doctorTasks, setDoctorTasks] = useState([]);

  useEffect(() => {
    if (!officer) {
      setMergCases([]);
      setDoctorTasks([]);
      return;
    }
    const unsub1 = subscribeMergCases(officer.uid, setMergCases);
    const unsub2 = subscribeDoctorTasks(officer.uid, setDoctorTasks);
    return () => {
      unsub1();
      unsub2();
    };
  }, [officer]);

  const createMergCase = async (formData) => {
    if (!officer) return null;
    return await createMergCaseDoc({ ownerId: officer.uid, formData });
  };

  const getCase = (id) => mergCases.find((c) => c.id === id);

  const toggleWorkflowStep = async (id, stepIndex) => {
    const c = getCase(id);
    if (!c) return;
    const workflow = c.workflow.map((w, i) => (i === stepIndex ? { ...w, done: !w.done } : w));
    await updateWorkflow(id, workflow);
  };

  const approveDraft = async (id, draftIndex) => {
    const c = getCase(id);
    if (!c) return;
    const drafts = c.drafts.map((d, i) => (i === draftIndex ? { ...d, status: "approved" } : d));
    await updateDrafts(id, drafts);
  };

  const addTimelineEvent = async (id, label) => {
    await pushMergTimeline(id, { time: new Date().toLocaleTimeString(), label });
  };

  const addStatement = async (id, statement) => {
    await pushStatement(id, statement);
    await addTimelineEvent(id, `Statement recorded - ${statement.witnessName}`);
    const c = getCase(id);
    if (c) {
      const stepName = statement.isDoctor ? "Doctor Statement" : "Witness Statements";
      const workflow = c.workflow.map((w) => (w.step === stepName ? { ...w, done: true } : w));
      await updateWorkflow(id, workflow);
    }
  };

  const savePanchanama = async (id, panchanamaData) => {
    const c = getCase(id);
    if (!c) return;
    const draftText = buildPanchanamaText(c, panchanamaData);
    const drafts = [...c.drafts, { title: "Inquest Panchanama", status: "draft", content: draftText }];
    await savePanchanamaDoc(id, panchanamaData, drafts);
    const workflow = c.workflow.map((w) => (w.step === "Prepare Panchanama" ? { ...w, done: true } : w));
    await updateWorkflow(id, workflow);
    await addTimelineEvent(id, "Panchanama prepared");
  };

  const resolveDoctorTask = async (id) => {
    await resolveDoctorTaskDoc(id);
  };

  return (
    <MergContext.Provider
      value={{
        mergCases,
        createMergCase,
        getCase,
        toggleWorkflowStep,
        approveDraft,
        addTimelineEvent,
        addStatement,
        savePanchanama,
        doctorTasks,
        resolveDoctorTask,
      }}
    >
      {children}
    </MergContext.Provider>
  );
}

function buildPanchanamaText(mergCase, p) {
  return [
    `Inquest Panchanama - Merg No. ${mergCase.id}`,
    `Panch Witness 1: ${p.panch1Name}, ${p.panch1Address}`,
    `Panch Witness 2: ${p.panch2Name}, ${p.panch2Address}`,
    `Condition of body: ${p.bodyCondition}`,
    `Clothing: ${p.clothing}`,
    `Visible injuries: ${p.injuries}`,
    `Articles found in pockets: ${p.articles}`,
    `Identification marks: ${p.identificationMarks}`,
    `Personal belongings: ${p.belongings}`,
    `Other observations: ${p.otherObservations}`,
  ].join("\n");
}

export const useMerg = () => useContext(MergContext);