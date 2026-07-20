import { useNavigate } from "react-router-dom";
import { useMerg } from "../../context/MergContext.jsx";
import StatusCard from "../../components/common/StatusCard.jsx";
import ReminderList from "./components/ReminderList.jsx";

export default function MergDashboard() {
  const navigate = useNavigate();
  const { mergCases } = useMerg();

  const pendingPostmortem = mergCases.filter((c) =>
    c.workflow.some((w) => w.step === "Receive Postmortem Report" && !w.done)
  ).length;

  const pendingStatements = mergCases.filter((c) =>
    c.workflow.some((w) => w.step === "Witness Statements" && !w.done)
  ).length;

  const pendingCaseDiary = mergCases.filter((c) =>
    c.workflow.some((w) => w.step === "Case Diary" && !w.done)
  ).length;

  const pendingClosure = mergCases.filter((c) => !c.workflow.every((w) => w.done)).length;

  const stats = [
    { title: "Today's Merg Cases", count: mergCases.length, status: "neutral" },
    { title: "Pending Postmortem Reports", count: pendingPostmortem, status: "red" },
    { title: "Pending Witness Statements", count: pendingStatements, status: "orange" },
    { title: "Pending Case Diaries", count: pendingCaseDiary, status: "red" },
    { title: "Pending Cases (overall)", count: pendingClosure, status: "orange" },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Merg Dashboard</h1>
        <button onClick={() => navigate("/merg/new")} className="bg-navy text-white px-4 py-2 rounded text-sm">
          + New Merg Case
        </button>
      </div>

      <ReminderList />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {stats.map((s) => (
          <StatusCard key={s.title} title={s.title} count={s.count} status={s.status} />
        ))}
      </div>

      <div className="flex gap-4 text-sm">
        <button onClick={() => navigate("/merg/cases")} className="text-navy underline">All Merg cases →</button>
        <button onClick={() => navigate("/merg/doctors")} className="text-navy underline">Doctor management →</button>
        <button onClick={() => navigate("/merg/pending")} className="text-navy underline">Pending overview →</button>
      </div>
    </div>
  );
}
