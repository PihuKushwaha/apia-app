import { useNavigate } from "react-router-dom";
import { CheckCircle2, FolderClock, AlertOctagon, Files } from "lucide-react";
import { useCaseContext } from "../../context/CaseContext.jsx";
import StatusCard from "../../components/common/StatusCard.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { cases, isCaseComplete } = useCaseContext();

  const doneCases = cases.filter((c) => isCaseComplete(c)).length;
  const pendingCases = cases.filter((c) => !isCaseComplete(c)).length;
  const noStepsDone = cases.filter((c) => c.workflow.every((w) => !w.done) && c.workflow.length > 0).length;

  const stats = [
    { title: "Total Cases", count: cases.length, status: "neutral", icon: Files },
    { title: "Done", count: doneCases, status: "green", icon: CheckCircle2 },
    { title: "Pending", count: pendingCases, status: "red", icon: FolderClock },
    { title: "Not Started", count: noStepsDone, status: "orange", icon: AlertOctagon },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Overview</p>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <StatusCard
            key={stat.title}
            title={stat.title}
            count={stat.count}
            status={stat.status}
            onClick={() => navigate(`/cases`)}
          />
        ))}
      </div>
    </div>
  );
}