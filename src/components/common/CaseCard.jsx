import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CaseCard({ c }) {
  const navigate = useNavigate();
  const done = c.workflow.length > 0 && c.workflow.every((w) => w.done);
  const doneCount = c.workflow.filter((w) => w.done).length;

  return (
    <button
      onClick={() => navigate(`/cases/${c.id}`)}
      className="border border-gray-100 rounded-lg p-4 bg-white text-left w-full hover:border-navy hover:shadow-md transition-all flex items-center justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${done ? "bg-alertGreen" : "bg-alertRed animate-pulse"}`} />
          <span className="text-xs font-mono text-gray-400">{c.crimeNo}</span>
        </div>
        <p className="text-sm font-medium text-gray-800">{c.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{c.typeLabel} — {doneCount}/{c.workflow.length} steps</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-medium ${
          done ? "bg-alertGreen/10 text-alertGreen" : "bg-alertRed/10 text-alertRed"
        }`}>
          {done ? "done" : "pending"}
        </span>
        <ChevronRight size={16} className="text-gray-300" />
      </div>
    </button>
  );
}