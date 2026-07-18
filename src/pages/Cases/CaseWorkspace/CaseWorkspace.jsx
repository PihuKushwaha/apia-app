import { useParams, NavLink, Routes, Route } from "react-router-dom";

import Overview from "./tabs/Overview.jsx";
import Documents from "./tabs/Documents.jsx";
import Timeline from "./tabs/Timeline.jsx";
import Evidence from "./tabs/Evidence.jsx";
import AIChat from "./tabs/AIChat.jsx";

const tabs = [
  { to: "", label: "Overview", end: true },
  { to: "documents", label: "Documents" },
  { to: "timeline", label: "Timeline" },
  { to: "evidence", label: "Evidence" },
  { to: "chat", label: "AI Chat" },
];

export default function CaseWorkspace() {
  const { caseId } = useParams();

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-semibold mb-1">Case {caseId}</h1>
      {/* TODO: show AI-generated case summary chip here (crime type, status) */}

      <div className="flex gap-2 border-b mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `px-3 py-2 text-sm whitespace-nowrap ${
                isActive ? "border-b-2 border-navy font-semibold" : "text-gray-500"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index element={<Overview />} />
        <Route path="documents" element={<Documents />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="evidence" element={<Evidence />} />
        <Route path="chat" element={<AIChat />} />
      </Routes>
    </div>
  );
}
