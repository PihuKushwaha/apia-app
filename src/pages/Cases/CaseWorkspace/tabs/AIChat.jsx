import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCaseContext } from "../../../../context/CaseContext.jsx";

export default function AIChat() {
  const { caseId } = useParams();
  const { getCase, addChatMessage } = useCaseContext();
  const c = getCase(caseId);
  const [input, setInput] = useState("");

  if (!c) return <p className="text-sm text-gray-500">Case not found.</p>;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    addChatMessage(caseId, { from: "officer", text: input });
    setTimeout(() => {
      addChatMessage(caseId, { from: "ai", text: "Noted. (AI response wiring pending.)" });
    }, 300);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {c.chat.length === 0 && <p className="text-sm text-gray-500">Ask the AI anything about this case.</p>}
        {c.chat.map((m, i) => (
          <div
            key={i}
            className={`text-sm px-3 py-2 rounded max-w-[80%] ${
              m.from === "officer" ? "bg-navy text-white ml-auto" : "bg-gray-100"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button type="submit" className="bg-navy text-white px-4 py-2 rounded text-sm">Send</button>
      </form>
    </div>
  );
}