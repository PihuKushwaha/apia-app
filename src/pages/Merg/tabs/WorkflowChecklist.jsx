import { useParams } from "react-router-dom";
import { useMerg } from "../../../context/MergContext.jsx";

// Module 3 - Investigation Workflow Engine. Checking a step auto-highlights the next one.
export default function WorkflowChecklist() {
  const { mergId } = useParams();
  const { getCase, toggleWorkflowStep } = useMerg();
  const mergCase = getCase(mergId);

  if (!mergCase) return <p className="text-sm text-gray-500">Case not found.</p>;

  const nextIndex = mergCase.workflow.findIndex((w) => !w.done);

  return (
    <div className="space-y-2">
      {mergCase.workflow.map((w, i) => (
        <label
          key={w.step}
          className={`flex items-center gap-3 border rounded p-3 cursor-pointer ${
            i === nextIndex ? "border-alertOrange bg-alertOrange/5" : "border-gray-200"
          }`}
        >
          <input
            type="checkbox"
            checked={w.done}
            onChange={() => toggleWorkflowStep(mergId, i)}
          />
          <span className={w.done ? "line-through text-gray-400" : ""}>{w.step}</span>
          {i === nextIndex && (
            <span className="ml-auto text-xs text-alertOrange">Next step</span>
          )}
        </label>
      ))}
    </div>
  );
}
