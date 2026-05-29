type GroqResult = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

const GROQ_MODEL = process.env.EXPO_PUBLIC_GROQ_MODEL ?? "llama-3.3-70b-versatile";

export async function generateWithGroq(moduleTitle: string, input: string) {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("EXPO_PUBLIC_GROQ_API_KEY is missing. Add it in mobile-app/.env.");
  }

  const prompt = [
    "You are an enterprise AI copilot for 2Coms Consulting Pvt Ltd.",
    "The company works in recruitment and outsourcing, including international hiring and HR operations.",
    `Current mobile module: ${moduleTitle}.`,
    "Return concise practical output with sections: Summary, Action Plan, Expected Impact.",
    "Use clean professional text and readable bullets.",
    "Avoid markdown symbols like ### and **.",
    `Task context: ${input}`,
  ].join(" ");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.35,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const result = (await response.json()) as GroqResult;

  if (!response.ok) {
    throw new Error(result.error?.message ?? "Failed to generate response from Groq.");
  }

  const content = result.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Groq returned an empty output.");
  }

  return content;
}
