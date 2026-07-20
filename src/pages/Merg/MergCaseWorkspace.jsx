import { useParams, NavLink, Routes, Route } from "react-router-dom";
import { useMerg } from "../../context/MergContext.jsx";

import WorkflowChecklist from "./tabs/WorkflowChecklist.jsx";
import DraftDocuments from "./tabs/DraftDocuments.jsx";
import Timeline from "./tabs/Timeline.jsx";
import StatementGenerator from "./tabs/StatementGenerator.jsx";
import PanchanamaBuilder from "./tabs/PanchanamaBuilder.jsx";

const tabs = [
  { to: "", label: "Workflow", end: true },
  { to: "panchanama", label: "Panchanama" },
  { to: "statements", label: "Statements" },
  { to: "drafts", label: "Drafts" },
  { to: "timeline", label: "Timeline" },
];

export default function MergCaseWorkspace() {
  const { mergId } = useParams();
  const { getCase } = useMerg();
  const mergCase = getCase(mergId);

  if (!mergCase) {
    return <div className="p-4 md:p-8 text-sm text-gray-500">Case not found. It may have reset on page refresh (in-memory data for now).</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-semibold mb-1">Merg {mergCase.id} — {mergCase.deceasedName}</h1>
      <p className="text-sm text-gray-500 mb-4">{mergCase.hospitalName} • {mergCase.treatingDoctor}</p>

      <div className="flex gap-2 border-b mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `px-3 py-2 text-sm whitespace-nowrap ${isActive ? "border-b-2 border-navy font-semibold" : "text-gray-500"}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index element={<WorkflowChecklist />} />
        <Route path="panchanama" element={<PanchanamaBuilder />} />
        <Route path="statements" element={<StatementGenerator />} />
        <Route path="drafts" element={<DraftDocuments />} />
        <Route path="timeline" element={<Timeline />} />
      </Routes>
    </div>
  );
}
