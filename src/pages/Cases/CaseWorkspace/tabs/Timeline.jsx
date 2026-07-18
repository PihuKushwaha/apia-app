import { useParams } from "react-router-dom";
import { useCaseContext } from "../../../../context/CaseContext.jsx";

export default function Timeline() {
  const { caseId } = useParams();
  const { getCase } = useCaseContext();
  const c = getCase(caseId);

  if (!c) return <p className="text-sm text-gray-500">Case not found.</p>;

  return (
    <div className="space-y-3">
      {c.timeline.map((t, i) => (
        <div key={i} className="flex gap-3 text-sm">
          <span className="text-gray-400 w-20 shrink-0">{t.time}</span>
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}