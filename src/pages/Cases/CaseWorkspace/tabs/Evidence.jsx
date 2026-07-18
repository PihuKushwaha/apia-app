import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCaseContext } from "../../../../context/CaseContext.jsx";

export default function Evidence() {
  const { caseId } = useParams();
  const { getCase, addEvidence } = useCaseContext();
  const c = getCase(caseId);
  const [label, setLabel] = useState("");

  if (!c) return <p className="text-sm text-gray-500">Case not found.</p>;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    addEvidence(caseId, { label, addedAt: new Date().toLocaleString() });
    setLabel("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Evidence label (e.g. Crime scene photo 1)"
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <input type="file" className="text-sm" />
        <button type="submit" className="bg-navy text-white px-4 py-2 rounded text-sm">Add</button>
      </form>

      {c.evidence.length === 0 ? (
        <p className="text-sm text-gray-500">No evidence added yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {c.evidence.map((item, i) => (
            <div key={i} className="border rounded p-3 text-sm bg-white">
              <p className="font-medium">{item.label}</p>
              <p className="text-xs text-gray-400">{item.addedAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}