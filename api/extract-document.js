// Vercel serverless function. Calls Anthropic's API to read an uploaded
// FIR/complaint (PDF, image, or plain text) and pull out structured case fields.
// Needs ANTHROPIC_API_KEY set in Vercel project env vars (Settings > Environment Variables).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on the server." });
  }

  const { mode, extractedText, fileBase64, mediaType } = req.body || {};

  const systemPrompt = `You are analyzing a police investigation document (FIR, complaint, hospital record, or report).
Extract the following fields as accurately as possible from the document content given.
Respond with ONLY valid JSON, no markdown formatting, no preamble, in exactly this shape:
{
  "crimeType": "one of: Missing Person, Marg Inquiry, Murder, Attempt to Murder, Theft, Burglary, Robbery, Dacoity, Cheating, Cyber Crime, UPI Fraud, Domestic Violence, POCSO, Other Criminal Cases",
  "complainantName": "string or empty",
  "complainantMobile": "string or empty",
  "accusedName": "string or empty",
  "incidentDate": "string or empty",
  "incidentLocation": "string or empty",
  "summary": "2-3 sentence plain summary of what happened",
  "missingFields": ["list of important fields the document does not mention"]
}
If a field is not present in the document, use an empty string. Be accurate - never invent information that is not present in the document.`;

  let content;
  if (mode === "text") {
    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({ error: "No text provided to analyze." });
    }
    content = [{ type: "text", text: extractedText }];
  } else if (mode === "file") {
    if (!fileBase64) {
      return res.status(400).json({ error: "No file data provided." });
    }
    if (mediaType === "application/pdf") {
      content = [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: fileBase64 } },
        { type: "text", text: "Extract the case details from this document." },
      ];
    } else {
      content = [
        { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: fileBase64 } },
        { type: "text", text: "Extract the case details from this document image." },
      ];
    }
  } else {
    return res.status(400).json({ error: "Invalid mode. Use 'text' or 'file'." });
  }

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
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const textBlock = (data.content || []).find((b) => b.type === "text");
    const raw = textBlock?.text || "{}";
    const clean = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: "AI response was not valid JSON.", raw: clean });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}