import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Image as ImageIcon, Mic, Type, Loader2, Sparkles } from "lucide-react";
import { useCaseContext } from "../../context/CaseContext.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { CASE_TYPES } from "../../utils/caseTypes.js";
import { fileToBase64, uploadFileToStorage, extractDocument } from "../../utils/fileHelpers.js";

const uploadModes = [
  { key: "document", label: "PDF / DOCX", icon: FileText },
  { key: "photo", label: "Photo / Scan", icon: ImageIcon },
  { key: "voice", label: "Voice Recording", icon: Mic },
  { key: "text", label: "Type / Paste Text", icon: Type },
];

export default function NewCaseIntake() {
  const navigate = useNavigate();
  const { createCase } = useCaseContext();
  const { officer } = useAuthContext();
  const [mode, setMode] = useState("document");
  const [crimeTypeCode, setCrimeTypeCode] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [pendingManualCreate, setPendingManualCreate] = useState(false);

  const runExtraction = async () => {
    if (mode === "document" && file) {
      if (file.name.toLowerCase().endsWith(".docx")) {
        setStatusMsg("Reading DOCX file...");
        const mammoth = (await import("mammoth")).default;
        const arrayBuffer = await file.arrayBuffer();
        let result;
        try {
          result = await mammoth.extractRawText({ arrayBuffer });
        } catch {
          throw new Error(
            'This file does not look like a valid .docx. If it is actually a PDF that was renamed to .docx, please pick the real .pdf file instead. If it is an old .doc file, open it in Word and use "Save As" to convert it to .docx first.'
          );
        }
        setStatusMsg("AI is reading every detail in the document...");
        return await extractDocument({ mode: "text", extractedText: result.value });
      }
      setStatusMsg("Reading PDF file...");
      setStatusMsg("AI is reading every detail in the document...");
      if (file.size < 4 * 1024 * 1024) {
        const base64 = await fileToBase64(file);
        return await extractDocument({ mode: "file", fileBase64: base64, mediaType: file.type || "application/pdf" });
      }
      const url = await uploadFileToStorage(file, officer.uid);
      return await extractDocument({ mode: "url", fileUrl: url, mediaType: file.type || "application/pdf" });
    }

    if (mode === "photo" && file) {
      setStatusMsg("AI is reading every detail in the photo...");
      if (file.size < 4 * 1024 * 1024) {
        const base64 = await fileToBase64(file);
        return await extractDocument({ mode: "file", fileBase64: base64, mediaType: file.type || "image/jpeg" });
      }
      const url = await uploadFileToStorage(file, officer.uid);
      return await extractDocument({ mode: "url", fileUrl: url, mediaType: file.type || "image/jpeg" });
    }

    if (mode === "text" && text.trim()) {
      setStatusMsg("AI is reading every detail in the text...");
      return await extractDocument({ mode: "text", extractedText: text });
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setPendingManualCreate(false);
    try {
      let extraction = null;
      try {
        extraction = await runExtraction();
      } catch (aiErr) {
        setError(
          `AI could not read the document (${aiErr.message}). If you're testing on "npm run dev" locally, AI reading only works when deployed on Vercel (or via "vercel dev") - it won't work on plain localhost. You can still create the case and fill everything manually below.`
        );
        setPendingManualCreate(true);
        setLoading(false);
        setStatusMsg("");
        return;
      }

      const finalTypeCode = crimeTypeCode || extraction?.crimeType;
      if (!finalTypeCode) {
        setError("Could not detect investigation type automatically. Please select it above.");
        setLoading(false);
        return;
      }

      const id = await createCase({ crimeTypeCode: finalTypeCode, sourceMode: mode, extraction });
      navigate(`/cases/${id}`);
    } catch (err) {
      setError(err.message || "Something went wrong creating the case.");
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  const handleManualCreate = async () => {
    if (!crimeTypeCode) {
      setError("Please select an investigation type to continue without AI.");
      return;
    }
    setLoading(true);
    try {
      const id = await createCase({ crimeTypeCode, sourceMode: mode, extraction: null });
      navigate(`/cases/${id}`);
    } catch (err) {
      setError(err.message || "Something went wrong creating the case.");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-xl">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={18} className="text-navy" />
        <h1 className="text-xl font-semibold">New case intake</h1>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Upload the FIR, complaint, or any investigation document. AI reads every detail and sets up the case.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">Investigation type (auto-detected, override if needed)</label>
          <select
            value={crimeTypeCode}
            onChange={(e) => setCrimeTypeCode(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Let AI detect it</option>
            {CASE_TYPES.map((t) => (
              <option key={t.code} value={t.code}>{t.label} ({t.labelHi})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Source</label>
          <div className="flex gap-2 flex-wrap">
            {uploadModes.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  type="button"
                  key={m.key}
                  onClick={() => { setMode(m.key); setFile(null); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                    mode === m.key ? "bg-navy text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon size={14} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {mode === "document" && (
          <input
            type="file"
            accept="application/pdf,.docx"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="text-sm"
          />
        )}
        {mode === "photo" && (
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="text-sm"
          />
        )}
        {mode === "voice" && (
          <button type="button" className="border rounded px-4 py-2 text-sm flex items-center gap-2">
            <Mic size={16} /> Start recording
          </button>
        )}
        {mode === "text" && (
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste complaint or FIR text here..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        )}

        {error && <p className="text-xs text-alertRed">{error}</p>}
        {statusMsg && (
          <p className="text-xs text-navy flex items-center gap-1.5">
            <Loader2 size={12} className="animate-spin" /> {statusMsg}
          </p>
        )}

        {pendingManualCreate && (
          <button
            type="button"
            onClick={handleManualCreate}
            disabled={loading}
            className="border border-navy text-navy px-4 py-2 rounded text-sm w-full"
          >
            Create case without AI (fill everything manually)
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-navy text-white px-4 py-2 rounded text-sm w-full flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? "Processing..." : "Create case and let AI read it"}
        </button>
      </form>
    </div>
  );
}