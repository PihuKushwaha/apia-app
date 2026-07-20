export async function askAi(question, context) {
  const res = await fetch("/api/ai-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.answer;
}

export async function generateDocument(caseData, language) {
  const res = await fetch("/api/generate-document", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caseData, language }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}
