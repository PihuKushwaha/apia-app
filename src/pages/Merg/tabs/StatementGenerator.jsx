import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMerg } from "../../../context/MergContext.jsx";

// Module 5 - Statement Generation Engine
// Asks structured questions based on witness relationship, then builds a draft statement.
const QUESTION_SETS = {
  relative: [
    { key: "howInformed", q: "How did you receive information about the incident?" },
    { key: "whoBrought", q: "Who brought the deceased to the hospital?" },
    { key: "whenDeath", q: "When did the death occur?" },
    { key: "priorTreatment", q: "Was treatment provided elsewhere before admission?" },
  ],
  doctor: [
    { key: "whenExamined", q: "When did you examine the patient?" },
    { key: "conditionOnArrival", q: "What was the condition of the patient on arrival?" },
    { key: "treatmentGiven", q: "What treatment was given?" },
    { key: "causeOpinion", q: "What is your preliminary opinion on cause of death?" },
  ],
  hospitalStaff: [
    { key: "role", q: "What is your role and when did you attend to the patient?" },
    { key: "observations", q: "What did you observe about the patient's condition?" },
  ],
};

export default function StatementGenerator() {
  const { mergId } = useParams();
  const { getCase, addStatement } = useMerg();
  const mergCase = getCase(mergId);

  const [witnessName, setWitnessName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [category, setCategory] = useState("relative");
  const [answers, setAnswers] = useState({});
  const [generated, setGenerated] = useState(null);

  if (!mergCase) return <p className="text-sm text-gray-500">Case not found.</p>;

  const questions = QUESTION_SETS[category];

  const handleAnswerChange = (key, value) => setAnswers((prev) => ({ ...prev, [key]: value }));

  const handleGenerate = (e) => {
    e.preventDefault();
    const lines = questions.map((q) => `${q.q}\n${answers[q.key] || "-"}`);
    const content = `Statement of ${witnessName} (${relationship})\n\n${lines.join("\n\n")}`;
    setGenerated(content);
  };

  const handleSave = () => {
    addStatement(mergId, {
      witnessName,
      relationship,
      isDoctor: category === "doctor",
      content: generated,
    });
    setWitnessName("");
    setRelationship("");
    setAnswers({});
    setGenerated(null);
  };

  return (
    <div className="space-y-6">
      {mergCase.statements.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Recorded statements</h3>
          {mergCase.statements.map((s, i) => (
            <div key={i} className="border rounded p-3 text-sm bg-white">
              <p className="font-medium">{s.witnessName} - {s.relationship}</p>
              <p className="text-gray-500 whitespace-pre-wrap text-xs mt-1">{s.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-3 border-t pt-4">
        <h3 className="text-sm font-semibold">Record a new statement</h3>

        <div className="flex gap-2">
          <input
            placeholder="Witness name"
            value={witnessName}
            onChange={(e) => setWitnessName(e.target.value)}
            required
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Relationship (e.g. Brother of deceased)"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            required
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
        </div>

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setAnswers({}); setGenerated(null); }}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="relative">Relative / General witness</option>
          <option value="doctor">Doctor</option>
          <option value="hospitalStaff">Hospital staff</option>
        </select>

        {questions.map((q) => (
          <div key={q.key}>
            <label className="text-sm block mb-1">{q.q}</label>
            <textarea
              value={answers[q.key] || ""}
              onChange={(e) => handleAnswerChange(q.key, e.target.value)}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        ))}

        <button type="submit" className="bg-navy text-white px-4 py-2 rounded text-sm">
          Generate draft statement
        </button>
      </form>

      {generated && (
        <div className="border rounded p-3 bg-gray-50">
          <p className="text-xs font-medium mb-2 text-alertOrange">Draft - Review pending</p>
          <p className="text-sm whitespace-pre-wrap mb-3">{generated}</p>
          <button onClick={handleSave} className="bg-alertGreen text-white px-4 py-2 rounded text-sm">
            Confirm and save statement
          </button>
        </div>
      )}
    </div>
  );
}
