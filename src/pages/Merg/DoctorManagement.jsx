import { useMerg } from "../../context/MergContext.jsx";

export default function DoctorManagement() {
  const { doctorTasks, resolveDoctorTask } = useMerg();

  const sorted = [...doctorTasks].sort((a, b) => {
    const priorityRank = { urgent: 0, normal: 1 };
    const rankDiff = (priorityRank[a.priority] ?? 1) - (priorityRank[b.priority] ?? 1);
    if (rankDiff !== 0) return rankDiff;
    return (a.dueDate || "").localeCompare(b.dueDate || "");
  });

  const pending = sorted.filter((t) => t.status === "pending");
  const done = sorted.filter((t) => t.status === "done");

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-semibold mb-4">Doctor Management</h1>

      <h3 className="text-sm font-semibold mb-2">Pending ({pending.length})</h3>
      <div className="space-y-2 mb-6">
        {pending.length === 0 && <p className="text-sm text-gray-500">Nothing pending.</p>}
        {pending.map((t) => (
          <div key={t.id} className="border rounded p-3 flex justify-between items-center bg-white">
            <div>
              <p className="text-sm font-medium">{t.doctorName} - {t.type}</p>
              <p className="text-xs text-gray-500">Merg {t.mergId} • Due {t.dueDate || "not set"}</p>
            </div>
            <div className="flex items-center gap-2">
              {t.priority === "urgent" && (
                <span className="text-xs px-2 py-0.5 rounded bg-alertRed/10 text-alertRed">Urgent</span>
              )}
              <button onClick={() => resolveDoctorTask(t.id)} className="text-xs border rounded px-2 py-1">
                Mark done
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold mb-2">Completed ({done.length})</h3>
      <div className="space-y-2">
        {done.map((t) => (
          <div key={t.id} className="border rounded p-3 bg-gray-50 text-sm text-gray-400 line-through">
            {t.doctorName} - {t.type} (Merg {t.mergId})
          </div>
        ))}
      </div>
    </div>
  );
}