import { useMerg } from "../../context/MergContext.jsx";
import { useNavigate } from "react-router-dom";

// Module 13 - Pending Dashboard (detailed breakdown)
export default function PendingDashboard() {
  const { mergCases, doctorTasks } = useMerg();
  const navigate = useNavigate();

  const total = mergCases.length;
  const pendingCases = mergCases.filter((c) => !c.workflow.every((w) => w.done));
  const pendingByStep = {};
  mergCases.forEach((c) => {
    c.workflow.forEach((w) => {
      if (!w.done) pendingByStep[w.step] = (pendingByStep[w.step] || 0) + 1;
    });
  });
  const pendingNotices = doctorTasks.filter((t) => t.type === "Notice" && t.status === "pending").length;
  const pendingSummons = doctorTasks.filter((t) => t.type === "Summons" && t.status === "pending").length;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-semibold mb-4">Pending Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 text-sm">
        <div className="border rounded p-3 bg-white"><p className="text-2xl font-semibold">{total}</p><p className="text-gray-500">Total Merg Cases</p></div>
        <div className="border rounded p-3 bg-white"><p className="text-2xl font-semibold text-alertOrange">{pendingCases.length}</p><p className="text-gray-500">Pending Cases</p></div>
        <div className="border rounded p-3 bg-white"><p className="text-2xl font-semibold text-alertRed">{pendingNotices}</p><p className="text-gray-500">Pending Notices</p></div>
        <div className="border rounded p-3 bg-white"><p className="text-2xl font-semibold text-alertRed">{pendingSummons}</p><p className="text-gray-500">Pending Summons</p></div>
      </div>

      <h3 className="text-sm font-semibold mb-2">Pending by step</h3>
      <div className="space-y-1 mb-6">
        {Object.entries(pendingByStep).map(([step, count]) => (
          <p key={step} className="text-sm flex justify-between border-b py-1">
            <span>{step}</span><span className="text-gray-500">{count}</span>
          </p>
        ))}
      </div>

      <h3 className="text-sm font-semibold mb-2">Pending cases</h3>
      <div className="space-y-2">
        {pendingCases.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/merg/cases/${c.id}`)}
            className="border rounded p-3 w-full text-left text-sm bg-white hover:border-navy"
          >
            {c.id} - {c.deceasedName}
          </button>
        ))}
      </div>
    </div>
  );
}
