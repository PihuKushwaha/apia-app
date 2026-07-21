import { CASE_TYPES } from "../src/utils/caseTypes.js";

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY is not set on the server." });
    }

    const { extractedText } = req.body || {};

    const typeList = CASE_TYPES.map((t) => `${t.code} = ${t.label} (${t.labelHi})`).join("\n");

    const systemPrompt = `You are analyzing a police investigation document (FIR, complaint, charge sheet, hospital record, or any related report). It may be in Hindi, English, or mixed.
Read the ENTIRE document carefully and extract every fact that is present - do not skip anything, do not summarize away details.

Pick the closest matching case type code from this list:
${typeList}

Respond with ONLY valid JSON, no markdown formatting, no preamble, in exactly this shape:
{
  "crimeType": "one of the codes above",
  "crimeNumber": "FIR/Crime/Merg number if present, else empty",
  "policeStation": "",
  "district": "",
  "fircDate": "",
  "actsAndSections": [{"act": "", "sections": ""}],
  "complainant": {"name": "", "fatherName": "", "mobile": "", "address": ""},
  "accused": [{"name": "", "aliases": "", "fatherOrHusbandName": "", "dobOrAge": "", "gender": "", "address": "", "sections": ""}],
  "witnesses": [{"name": "", "relation": "", "mobile": "", "address": "", "occupation": "", "typeOfEvidence": ""}],
  "incidentDate": "",
  "incidentLocation": "",
  "ioName": "",
  "ioRank": "",
  "forwardingOfficer": "",
  "briefFacts": "the fuller narrative of what happened, in the document's own language, condensed but not losing facts",
  "summary": "2-3 sentence plain-language summary",
  "missingFields": ["list important fields this document does not mention"]
}

Rules:
- List EVERY accused person found, not just the first one. Same for witnesses.
- Never invent information. If a field is not present, use an empty string ("") or empty array ([]).
- Keep names, numbers, dates exactly as written in the document (do not translate names).
- accused[].sections and complainant fields should be filled per-person where the document specifies them.`;

   if (!extractedText || !extractedText.trim()) {
    return res.status(400).json({
      error: "No extracted text received.",
    });
  }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "system",
      content: systemPrompt,
    },
   {
  role: "user",
  content: extractedText,
},
  ],
  temperature: 0,
  max_tokens: 4096,
}),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const raw = data.choices?.[0]?.message?.content || "{}";
    const clean = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: "AI response was not valid JSON.", raw: clean });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    // Catch-all so the client always gets JSON, never a raw crash page
    console.error("extract-document crashed:", err);
    return res.status(500).json({ error: err.message || "Unexpected server error." });
  }
}
