import { useState } from "react";
import { useParams } from "react-router-dom";
import { Lock, Send, Loader2, Printer, Download } from "lucide-react";
import { useCaseContext } from "../../../../context/CaseContext.jsx";
import { askAi, generateDocument } from "../../../../utils/aiHelpers.js";

function ChatPanel({ c }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const question = input;
    setMessages((prev) => [...prev, { from: "officer", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const answer = await askAi(question, { type: "case", case: c });
      setMessages((prev) => [...prev, { from: "ai", text: answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "ai", text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg bg-white p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Ask AI about this case</p>
      <div className="h-64 overflow-y-auto space-y-2 mb-3">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400">e.g. "Is anything pending?" or "What did I find about the accused?"</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm px-3 py-2 rounded max-w-[85%] whitespace-pre-wrap ${
              m.from === "officer" ? "bg-navy text-white ml-auto" : "bg-gray-100"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <p className="text-xs text-gray-400 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Thinking...</p>}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button type="submit" disabled={loading} className="bg-navy text-white px-3 py-2 rounded text-sm">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

function PreviewAndPrint({ c }) {
  const [language, setLanguage] = useState("english");
  const [docText, setDocText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const { documentText } = await generateDocument(c, language);
      setDocText(documentText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<pre style="font-family: 'Noto Sans Devanagari', Arial, sans-serif; white-space: pre-wrap; font-size: 14px; padding: 24px;">${docText}</pre>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const blob = new Blob([docText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.crimeNo}-final-document.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border rounded-lg bg-white p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Preview & print final document</p>
      <div className="flex gap-2 mb-3">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border rounded px-3 py-1.5 text-sm">
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>
        <button onClick={handleGenerate} disabled={loading} className="bg-navy text-white px-3 py-1.5 rounded text-sm flex items-center gap-1.5">
          {loading && <Loader2 size={13} className="animate-spin" />}
          Generate document
        </button>
      </div>

      {error && <p className="text-xs text-alertRed mb-2">{error}</p>}

      {docText && (
        <>
          <div className="border rounded p-3 bg-gray-50 max-h-80 overflow-y-auto text-sm whitespace-pre-wrap mb-3">
            {docText}
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="border rounded px-3 py-1.5 text-sm flex items-center gap-1.5">
              <Printer size={14} /> Print
            </button>
            <button onClick={handleDownload} className="border rounded px-3 py-1.5 text-sm flex items-center gap-1.5">
              <Download size={14} /> Download .txt
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function CaseConclusion() {
  const { caseId } = useParams();
  const { getCase, isCaseComplete } = useCaseContext();
  const c = getCase(caseId);

  if (!c) return <p className="text-sm text-gray-500">Case not found.</p>;

  if (!isCaseComplete(c)) {
    const pending = c.workflow.filter((w) => !w.done).map((w) => w.step);
    return (
      <div className="border rounded-lg p-6 bg-gray-50 text-center">
        <Lock size={24} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-600 mb-1">Case Conclusion is locked</p>
        <p className="text-xs text-gray-400 mb-3">Complete all steps in Docs & Details to unlock it.</p>
        <div className="text-left inline-block text-xs text-gray-500">
          {pending.map((p) => <p key={p}>• {p}</p>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ChatPanel c={c} />
      <PreviewAndPrint c={c} />
    </div>
  );
}