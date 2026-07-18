import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMerg } from "../../context/MergContext.jsx";

export default function MergList() {
  const navigate = useNavigate();
  const { mergCases } = useMerg();
  const [query, setQuery] = useState("");

  // Module 11 - Smart Search (basic): matches name, merg id, hospital, doctor, mobile
  const filtered = mergCases.filter((c) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      c.id.toLowerCase().includes(q) ||
      c.deceasedName?.toLowerCase().includes(q) ||
      c.hospitalName?.toLowerCase().includes(q) ||
      c.treatingDoctor?.toLowerCase().includes(q) ||
      c.mobile?.includes(q)
    );
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Master Merg Database</h1>
        <button onClick={() => navigate("/merg/new")} className="bg-navy text-white px-4 py-2 rounded text-sm">
          + New Merg Case
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by deceased name, Merg No., hospital, doctor, mobile..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm mb-4"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No Merg cases yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">Merg No.</th>
                <th className="py-2 pr-4">Deceased</th>
                <th className="py-2 pr-4">Hospital</th>
                <th className="py-2 pr-4">Doctor</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const done = c.workflow.filter((w) => w.done).length;
                const total = c.workflow.length;
                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/merg/cases/${c.id}`)}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-2 pr-4 font-medium">{c.id}</td>
                    <td className="py-2 pr-4">{c.deceasedName || "-"}</td>
                    <td className="py-2 pr-4">{c.hospitalName || "-"}</td>
                    <td className="py-2 pr-4">{c.treatingDoctor || "-"}</td>
                    <td className="py-2 pr-4">{done}/{total} steps done</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
