import { useNavigate } from "react-router-dom";
import { ClipboardList, FolderClock, AlertOctagon, Files } from "lucide-react";
import { useCaseContext } from "../../context/CaseContext.jsx";
import StatusCard from "../../components/common/StatusCard.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { cases } = useCaseContext();

  const pendingCases = cases.filter((c) => c.status !== "done").length;
  const overdue = cases.filter((c) => c.workflow.every((w) => !w.done) && c.workflow.length > 0).length;
  const todaysTasks = cases.reduce((sum, c) => sum + c.workflow.filter((w) => !w.done).length, 0);

  const stats = [
    { title: "Today's Tasks", count: todaysTasks, status: "orange", filter: "today", icon: ClipboardList },
    { title: "Pending Cases", count: pendingCases, status: "neutral", filter: "pending", icon: FolderClock },
    { title: "Overdue", count: overdue, status: "red", filter: "overdue", icon: AlertOctagon },
    { title: "Total Cases", count: cases.length, status: "green", filter: "all", icon: Files },
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
            onClick={() => navigate(`/cases?filter=${stat.filter}`)}
          />
        ))}
      </div>
    </div>
  );
}