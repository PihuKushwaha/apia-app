import { useMerg } from "../../../context/MergContext.jsx";

// Module 8 - Reminder Engine. Derives reminders from workflow + doctor task state.
const REMINDER_STEPS = [
  "Receive Postmortem Report",
  "Doctor Statement",
  "Witness Statements",
  "Case Diary",
];

export default function ReminderList() {
  const { mergCases, doctorTasks } = useMerg();

  const reminders = [];

  mergCases.forEach((c) => {
    c.workflow.forEach((w) => {
      if (REMINDER_STEPS.includes(w.step) && !w.done) {
        reminders.push({ label: `${w.step} pending`, caseId: c.id, level: "orange" });
      }
    });
  });

  doctorTasks
    .filter((t) => t.status === "pending")
    .forEach((t) => {
      reminders.push({
        label: `${t.doctorName} - ${t.type} pending`,
        caseId: t.mergId,
        level: t.priority === "urgent" ? "red" : "orange",
      });
    });

  if (reminders.length === 0) return null;

  return (
    <div className="border rounded p-3 bg-white mb-4">
      <h3 className="text-sm font-semibold mb-2">Reminders</h3>
      <div className="space-y-1">
        {reminders.map((r, i) => (
          <p key={i} className="text-sm">
            <span className={r.level === "red" ? "text-alertRed" : "text-alertOrange"}>●</span>{" "}
            {r.label} <span className="text-gray-400">(Merg {r.caseId})</span>
          </p>
        ))}
      </div>
    </div>
  );
}
