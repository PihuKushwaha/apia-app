export default function StatusCard({ title, count, status = "neutral", onClick }) {
  const styles = {
    red: { border: "border-l-alertRed", text: "text-alertRed", bg: "bg-alertRed/5" },
    orange: { border: "border-l-alertOrange", text: "text-alertOrange", bg: "bg-alertOrange/5" },
    green: { border: "border-l-alertGreen", text: "text-alertGreen", bg: "bg-alertGreen/5" },
    neutral: { border: "border-l-navy", text: "text-navy", bg: "bg-navy/5" },
  }[status];

  return (
    <button
      onClick={onClick}
      className={`border-l-4 ${styles.border} ${styles.bg} bg-white rounded-lg p-4 text-left shadow-sm hover:shadow-md transition-shadow w-full border border-gray-100`}
    >
      <p className={`text-3xl font-bold ${styles.text} tabular-nums`}>{count}</p>
      <p className="text-xs text-gray-500 mt-1 leading-tight">{title}</p>
    </button>
  );
}