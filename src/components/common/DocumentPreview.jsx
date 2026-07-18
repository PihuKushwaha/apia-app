// Shows a generated draft with "Draft - Review pending" badge until officer approves.
export default function DocumentPreview({ title, approved = false, children }) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            approved ? "bg-alertGreen/10 text-alertGreen" : "bg-alertOrange/10 text-alertOrange"
          }`}
        >
          {approved ? "Approved" : "Draft - Review pending"}
        </span>
      </div>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}
