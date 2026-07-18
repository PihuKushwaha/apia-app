import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CaseCard({ id, crimeNo, title, type, status = "active" }) {
  const navigate = useNavigate();

  const dotColor = { active: "bg-alertGreen", pending: "bg-alertOrange", done: "bg-gray-400" }[status];
  const badgeStyle = {
    active: "bg-alertGreen/10 text-alertGreen",
    pending: "bg-alertOrange/10 text-alertOrange",
    done: "bg-gray-100 text-gray-500",
  }[status];

  return (
    <button
      onClick={() => navigate(`/cases/${id}`)}
      className="border border-gray-100 rounded-lg p-4 bg-white text-left w-full hover:border-navy hover:shadow-md transition-all flex items-center justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          <span className="text-xs font-mono text-gray-400">{crimeNo}</span>
        </div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{type}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-medium ${badgeStyle}`}>{status}</span>
        <ChevronRight size={16} className="text-gray-300" />
      </div>
    </button>
  );
}