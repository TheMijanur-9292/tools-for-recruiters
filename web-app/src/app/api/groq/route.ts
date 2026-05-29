import { NextResponse } from "next/server";
import { MODULES } from "@/lib/modules";

type RequestBody = {
  moduleId?: string;
  userInput?: string;
};

const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

function buildSystemPrompt(moduleTitle: string) {
  return [
    "You are an enterprise AI copilot for 2Coms Consulting Pvt Ltd.",
    "The company works in recruitment and outsourcing, including international hiring and HR operations.",
    `Current module: ${moduleTitle}.`,
    "Respond with practical, implementation-ready output in concise sections.",
    "Use clean section headers and readable bullet points.",
    "Avoid cluttered symbols and keep language professional.",
    "Always include: Quick Summary, Actionable Output, and Measurable Impact Ideas.",
  ].join(" ");
}

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing in environment variables." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RequestBody;
    const userInput = body.userInput?.trim();
    const featureModule = MODULES.find((item) => item.id === body.moduleId);

    if (!userInput) {
      return NextResponse.json(
        { error: "Please provide task details in userInput." },
        { status: 400 }
      );
    }

    const completion = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.35,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(
              featureModule?.title ?? "General AI Assistant"
            ),
          },
          {
            role: "user",
            content: userInput,
          },
        ],
      }),
    });

    const payload = (await completion.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (!completion.ok) {
      return NextResponse.json(
        { error: payload.error?.message ?? "Failed to generate Groq output." },
        { status: completion.status }
      );
    }

    const text = payload.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Groq returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while processing Groq request." },
      { status: 500 }
    );
  }
}
