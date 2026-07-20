export default function TimelineStep({ label, status = "pending" }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-3 h-3 rounded-full ${
          status === "done" ? "bg-alertGreen" : "bg-gray-300"
        }`}
      />
      <span className={status === "done" ? "text-gray-900" : "text-gray-400"}>{label}</span>
    </div>
  );
}