export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY is not set on the server." });
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
      content: question,
    },
  ],
  max_tokens: 1024,
}),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const answer = data.choices?.[0]?.message?.content || "";

return res.status(200).json({ answer });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
