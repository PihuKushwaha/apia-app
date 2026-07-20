import { useState } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Save, Pencil } from "lucide-react";
import { useCaseContext } from "../../../../context/CaseContext.jsx";

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function ExtractedDataPanel({ c, updateExtraction }) {
  const ex = c.extraction || {};
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    crimeNumber: ex.crimeNumber || "",
    policeStation: ex.policeStation || "",
    district: ex.district || "",
    fircDate: ex.fircDate || "",
    incidentDate: ex.incidentDate || "",
    incidentLocation: ex.incidentLocation || "",
    ioName: ex.ioName || "",
    ioRank: ex.ioRank || "",
    forwardingOfficer: ex.forwardingOfficer || "",
    complainant: ex.complainant || { name: "", fatherName: "", mobile: "", address: "" },
    briefFacts: ex.briefFacts || "",
  });

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleComplainantChange = (key, value) =>
    setForm((prev) => ({ ...prev, complainant: { ...prev.complainant, [key]: value } }));

  const handleSave = async () => {
    await updateExtraction(c.id, { ...ex, ...form });
    setEditing(false);
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide">AI-extracted case data</p>
        <button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          className="text-xs text-navy flex items-center gap-1"
        >
          {editing ? <><Save size={12} /> Save</> : <><Pencil size={12} /> Edit</>}
        </button>
      </div>

      {!editing ? (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Crime/FIR/Merg No." value={form.crimeNumber} />
          <Field label="Police Station" value={form.policeStation} />
          <Field label="District" value={form.district} />
          <Field label="FIR Date" value={form.fircDate} />
          <Field label="Incident Date" value={form.incidentDate} />
          <Field label="Incident Location" value={form.incidentLocation} />
          <Field label="I.O. Name" value={form.ioName} />
          <Field label="I.O. Rank" value={form.ioRank} />
          <Field label="Complainant" value={form.complainant.name} />
          <Field label="Complainant Mobile" value={form.complainant.mobile} />
          {form.briefFacts && (
            <div className="col-span-2 border-t pt-3 mt-1">
              <p className="text-xs text-gray-400 mb-1">Brief facts</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{form.briefFacts}</p>
            </div>
          )}
          {!Object.values(form).some((v) => (typeof v === "string" ? v : v?.name)) && (
            <p className="text-sm text-gray-400 col-span-2">No data extracted yet.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {["crimeNumber", "policeStation", "district", "fircDate", "incidentDate", "incidentLocation", "ioName", "ioRank", "forwardingOfficer"].map((key) => (
            <input
              key={key}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={key}
              className="border rounded px-2 py-1.5 text-sm"
            />
          ))}
          <input
            value={form.complainant.name}
            onChange={(e) => handleComplainantChange("name", e.target.value)}
            placeholder="Complainant name"
            className="border rounded px-2 py-1.5 text-sm"
          />
          <input
            value={form.complainant.mobile}
            onChange={(e) => handleComplainantChange("mobile", e.target.value)}
            placeholder="Complainant mobile"
            className="border rounded px-2 py-1.5 text-sm"
          />
          <textarea
            value={form.briefFacts}
            onChange={(e) => handleChange("briefFacts", e.target.value)}
            placeholder="Brief facts"
            rows={4}
            className="border rounded px-2 py-1.5 text-sm col-span-2"
          />
        </div>
      )}

      {(ex.accused?.length > 0 || ex.witnesses?.length > 0 || ex.actsAndSections?.length > 0) && (
        <div className="border-t mt-3 pt-3 space-y-3">
          {ex.actsAndSections?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Acts & Sections</p>
              {ex.actsAndSections.map((a, i) => (
                <p key={i} className="text-sm">{a.act} — {a.sections}</p>
              ))}
            </div>
          )}
          {ex.accused?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Accused ({ex.accused.length})</p>
              {ex.accused.map((a, i) => (
                <p key={i} className="text-sm">
                  {i + 1}. {a.name} {a.aliases && `alias ${a.aliases}`} — {a.gender}, {a.dobOrAge} — {a.address}
                </p>
              ))}
            </div>
          )}
          {ex.witnesses?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Witnesses ({ex.witnesses.length})</p>
              {ex.witnesses.map((w, i) => (
                <p key={i} className="text-sm">
                  {i + 1}. {w.name} ({w.relation || w.occupation}) — {w.mobile}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DocsAndDetails() {
  const { caseId } = useParams();
  const { getCase, toggleWorkflowStep, saveStepContent, updateExtraction } = useCaseContext();
  const c = getCase(caseId);
  const [openStep, setOpenStep] = useState(null);
  const [drafts, setDrafts] = useState({});

  if (!c) return <p className="text-sm text-gray-500">Case not found.</p>;

  const ex = c.extraction;

  const handleSaveStep = async (index) => {
    await saveStepContent(caseId, index, drafts[index] ?? c.workflow[index].content ?? "");
    setOpenStep(null);
  };

  return (
    <div className="space-y-4">
      <ExtractedDataPanel c={c} updateExtraction={updateExtraction} />

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
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Investigation steps</p>
        <div className="space-y-2">
          {c.workflow.map((w, i) => (
            <div key={w.step} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenStep(openStep === i ? null : i)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left"
              >
                <span className="flex items-center gap-2 text-sm">
                  {w.done ? (
                    <CheckCircle2 size={16} className="text-alertGreen" />
                  ) : (
                    <span className="w-4 h-4 border rounded-full inline-block border-gray-300" />
                  )}
                  <span className={w.done ? "text-gray-700" : "text-gray-500"}>{w.step}</span>
                </span>
                <span
                  onClick={(e) => { e.stopPropagation(); toggleWorkflowStep(caseId, i); }}
                  className="text-[10px] px-2 py-0.5 rounded-full border text-gray-400 hover:bg-gray-50"
                >
                  {w.done ? "Mark pending" : "Mark done"}
                </span>
              </button>
              {openStep === i && (
                <div className="border-t p-3 bg-gray-50">
                  <textarea
                    defaultValue={w.content}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [i]: e.target.value }))}
                    rows={4}
                    placeholder={`Details for "${w.step}"...`}
                    className="w-full border rounded px-3 py-2 text-sm bg-white"
                  />
                  <button
                    onClick={() => handleSaveStep(i)}
                    className="mt-2 bg-navy text-white text-xs px-3 py-1.5 rounded"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
