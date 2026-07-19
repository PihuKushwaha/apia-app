export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on the server." });
  }

  const { question, context } = req.body || {};
  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  const systemPrompt =
    context?.type === "case"
      ? `You are an investigation assistant helping a police officer with ONE specific case. Use only the case data given below (as JSON) to answer. If information is not in the data, say so clearly - never invent facts.

Case data:
${JSON.stringify(context.case)}`
      : `You are an investigation assistant helping a police officer navigate their full case list. Use only the case summaries given below (as JSON array) to answer. If asked about something not present in the data, say so clearly - never invent facts.

Case summaries:
${JSON.stringify(context?.cases || [])}`;

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
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const textBlock = (data.content || []).find((b) => b.type === "text");
    return res.status(200).json({ answer: textBlock?.text || "" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}