export const config = { maxDuration: 60 };
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on the server." });
  }

  const { caseData, language } = req.body || {};
  if (!caseData) {
    return res.status(400).json({ error: "caseData is required" });
  }

  const langInstruction =
    language === "hindi"
      ? "Write the entire document in Hindi (Devanagari script)."
      : "Write the entire document in English.";

  const systemPrompt = `You are drafting a final police investigation document/summary for closing or handover of a case.
Use ONLY the information given in the case JSON below - never invent facts.
${langInstruction}
Structure it as a formal document: case identification (crime number, police station, district, date), parties involved (complainant, accused, witnesses), acts and sections applied, brief facts, investigation steps completed with status, and a closing statement.
Where the case JSON does not have a piece of information, write "Not available" for that field rather than guessing.
Respond with the document text only - no JSON, no markdown code fences, no commentary.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 3072,
        system: systemPrompt,
        messages: [{ role: "user", content: JSON.stringify(caseData) }],
      }),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const textBlock = (data.content || []).find((b) => b.type === "text");
    return res.status(200).json({ documentText: textBlock?.text || "" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}