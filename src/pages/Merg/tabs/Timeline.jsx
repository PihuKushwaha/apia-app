import { useParams } from "react-router-dom";
import { useMerg } from "../../../context/MergContext.jsx";

// Module 10 - Timeline Manager
export default function Timeline() {
  const { mergId } = useParams();
  const { getCase } = useMerg();
  const mergCase = getCase(mergId);

  if (!mergCase) return <p className="text-sm text-gray-500">Case not found.</p>;

  return (
    <div className="space-y-3">
      {mergCase.timeline.map((t, i) => (
        <div key={i} className="flex gap-3 text-sm">
          <span className="text-gray-400 w-20 shrink-0">{t.time}</span>
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}
