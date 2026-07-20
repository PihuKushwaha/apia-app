import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircleQuestion, Send, Loader2, X } from "lucide-react";
import { useCaseContext } from "../../context/CaseContext.jsx";
import CaseCard from "../../components/common/CaseCard.jsx";
import { askAi } from "../../utils/aiHelpers.js";

const tabs = ["all", "pending", "done"];

function CasesChat({ cases, onClose }) {
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
      const summaries = cases.map((c) => ({
        id: c.id, crimeNo: c.crimeNo, type: c.typeLabel, title: c.title,
        workflow: c.workflow, extraction: c.extraction,
      }));
      const answer = await askAi(question, { type: "cases", cases: summaries });
      setMessages((prev) => [...prev, { from: "ai", text: answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "ai", text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[90vw] max-w-sm border rounded-lg bg-white shadow-xl z-40 flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <p className="text-sm font-medium">Ask about your cases</p>
        <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
      </div>
      <div className="h-72 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400">e.g. "Which cases are pending?" or "How many cyber crime cases do I have?"</p>
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
      <form onSubmit={handleSend} className="flex gap-2 p-3 border-t">
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

export default function MyCases() {
  const navigate = useNavigate();
  const { cases } = useCaseContext();
  const [activeTab, setActiveTab] = useState("all");
  const [chatOpen, setChatOpen] = useState(false);

  const isDone = (c) => c.workflow.length > 0 && c.workflow.every((w) => w.done);
  const filtered =
    activeTab === "all" ? cases : cases.filter((c) => (activeTab === "done" ? isDone(c) : !isDone(c)));

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
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      )}

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-navy text-white rounded-full p-3 shadow-lg z-40"
        >
          <MessageCircleQuestion size={20} />
        </button>
      )}
      {chatOpen && <CasesChat cases={cases} onClose={() => setChatOpen(false)} />}
    </div>
  );
}
