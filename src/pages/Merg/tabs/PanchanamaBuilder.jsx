import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMerg } from "../../../context/MergContext.jsx";

// Module 6 - Panchanama Builder
const fields = [
  { key: "bodyCondition", label: "Condition of the body" },
  { key: "clothing", label: "Clothing" },
  { key: "injuries", label: "Visible injuries" },
  { key: "articles", label: "Articles found in pockets" },
  { key: "identificationMarks", label: "Identification marks" },
  { key: "belongings", label: "Personal belongings" },
  { key: "otherObservations", label: "Other observations" },
];

export default function PanchanamaBuilder() {
  const { mergId } = useParams();
  const { getCase, savePanchanama } = useMerg();
  const mergCase = getCase(mergId);
  const [form, setForm] = useState({
    panch1Name: "", panch1Address: "",
    panch2Name: "", panch2Address: "",
    bodyCondition: "", clothing: "", injuries: "",
    articles: "", identificationMarks: "", belongings: "", otherObservations: "",
  });

  if (!mergCase) return <p className="text-sm text-gray-500">Case not found.</p>;

  if (mergCase.panchanama) {
    return (
      <div className="border rounded p-3 bg-white text-sm">
        <p className="text-alertGreen text-xs font-medium mb-2">Panchanama already prepared</p>
        <p><strong>Panch 1:</strong> {mergCase.panchanama.panch1Name}, {mergCase.panchanama.panch1Address}</p>
        <p><strong>Panch 2:</strong> {mergCase.panchanama.panch2Name}, {mergCase.panchanama.panch2Address}</p>
        <p className="mt-2 text-gray-500">Full draft is available in the Drafts tab.</p>
      </div>
    );
  }

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    savePanchanama(mergId, form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Panch Witness 1</h3>
        <div className="flex gap-2">
          <input placeholder="Name" value={form.panch1Name} onChange={(e) => handleChange("panch1Name", e.target.value)} required className="flex-1 border rounded px-3 py-2 text-sm" />
          <input placeholder="Address" value={form.panch1Address} onChange={(e) => handleChange("panch1Address", e.target.value)} required className="flex-1 border rounded px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Panch Witness 2</h3>
        <div className="flex gap-2">
          <input placeholder="Name" value={form.panch2Name} onChange={(e) => handleChange("panch2Name", e.target.value)} required className="flex-1 border rounded px-3 py-2 text-sm" />
          <input placeholder="Address" value={form.panch2Address} onChange={(e) => handleChange("panch2Address", e.target.value)} required className="flex-1 border rounded px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm block mb-1">{f.label}</label>
            <textarea
              value={form[f.key]}
              onChange={(e) => handleChange(f.key, e.target.value)}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>

      <button type="submit" className="bg-navy text-white px-4 py-2 rounded text-sm">
        Prepare draft Panchanama
      </button>
    </form>
  );
}
