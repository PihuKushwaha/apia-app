import { useParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useCaseContext } from "../../../../context/CaseContext.jsx";

export default function Overview() {
  const { caseId } = useParams();
  const { getCase } = useCaseContext();
  const c = getCase(caseId);

  if (!c) return <p className="text-sm text-gray-500">Case not found.</p>;

  const doneSteps = c.workflow.filter((w) => w.done).length;
  const ex = c.extraction;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Crime No.</p>
          <p className="font-semibold">{c.crimeNo}</p>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Type</p>
          <p className="font-semibold">{c.type}</p>
        </div>
      </div>

      {ex && (
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
            AI-extracted details
          </p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {ex.complainantName && <><span className="text-gray-500">Complainant</span><span>{ex.complainantName}</span></>}
            {ex.complainantMobile && <><span className="text-gray-500">Mobile</span><span>{ex.complainantMobile}</span></>}
            {ex.accusedName && <><span className="text-gray-500">Accused</span><span>{ex.accusedName}</span></>}
            {ex.incidentDate && <><span className="text-gray-500">Incident date</span><span>{ex.incidentDate}</span></>}
            {ex.incidentLocation && <><span className="text-gray-500">Location</span><span>{ex.incidentLocation}</span></>}
          </div>
          {ex.summary && <p className="text-sm text-gray-600 mt-3 border-t pt-3">{ex.summary}</p>}
        </div>
      )}

      {ex?.missingFields?.length > 0 && (
        <div className="border border-alertOrange/40 rounded-lg p-4 bg-alertOrange/5">
          <p className="text-xs font-medium text-alertOrange uppercase tracking-wide mb-2 flex items-center gap-1">
            <AlertTriangle size={14} /> Missing information detected
          </p>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5">
            {ex.missingFields.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}

      <div className="border rounded-lg p-4 bg-white">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
          Progress — {doneSteps}/{c.workflow.length} steps done
        </p>
        <div className="space-y-1.5">
          {c.workflow.map((w) => (
            <p key={w.step} className={`text-sm flex items-center gap-2 ${w.done ? "text-alertGreen" : "text-gray-500"}`}>
              {w.done ? <CheckCircle2 size={14} /> : <span className="w-3.5 h-3.5 border rounded-full inline-block" />}
              {w.step}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}