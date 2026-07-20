import { useParams, NavLink, Routes, Route } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import { useCaseContext } from "../../../context/CaseContext.jsx";
import DocsAndDetails from "./tabs/DocsAndDetails.jsx";
import CaseConclusion from "./tabs/CaseConclusion.jsx";

export default function CaseWorkspace() {
  const { caseId } = useParams();
  const { getCase, isCaseComplete } = useCaseContext();
  const c = getCase(caseId);

  if (!c) {
    return <div className="p-4 md:p-8 text-sm text-gray-500">Loading case, or it doesn't exist.</div>;
  }

  const complete = isCaseComplete(c);
  const doneCount = c.workflow.filter((w) => w.done).length;

  return (
    <div className="p-4 md:p-8">
      <p className="text-xs text-gray-400 font-mono">{c.crimeNo}</p>
      <h1 className="text-xl font-semibold mb-1">{c.typeLabel}</h1>
      <p className="text-sm text-gray-500 mb-4">{doneCount}/{c.workflow.length} steps completed</p>

      <div className="flex gap-2 border-b mb-4">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `px-3 py-2 text-sm ${isActive ? "border-b-2 border-navy font-semibold" : "text-gray-500"}`
          }
        >
          Docs & Details
        </NavLink>
        <NavLink
          to="conclusion"
          className={({ isActive }) =>
            `px-3 py-2 text-sm flex items-center gap-1.5 ${isActive ? "border-b-2 border-navy font-semibold" : "text-gray-500"}`
          }
        >
          {complete ? <Unlock size={13} /> : <Lock size={13} />}
          Case Conclusion
        </NavLink>
      </div>

      <Routes>
        <Route index element={<DocsAndDetails />} />
        <Route path="conclusion" element={<CaseConclusion />} />
      </Routes>
    </div>
  );
}
