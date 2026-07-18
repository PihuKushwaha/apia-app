import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCaseContext } from "../../context/CaseContext.jsx";
import CaseCard from "../../components/common/CaseCard.jsx";

const tabs = ["all", "active", "pending", "done"];

export default function MyCases() {
  const navigate = useNavigate();
  const { cases } = useCaseContext();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? cases : cases.filter((c) => c.status === activeTab);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">My Cases</h1>
        <button onClick={() => navigate("/cases/new")} className="bg-navy text-white px-4 py-2 rounded text-sm">
          + New Case
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-sm capitalize ${
              activeTab === tab ? "bg-navy text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No cases in this filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((c) => (
            <CaseCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}