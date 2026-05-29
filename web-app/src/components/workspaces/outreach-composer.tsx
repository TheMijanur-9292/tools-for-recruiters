"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OutputActions } from "./output-actions";

const TEMPLATES = [
  {
    category: "LinkedIn InMail",
    color: "bg-[#0077b5] text-white",
    items: [
      {
        label: "Passive Candidate Pitch",
        note: "Senior pro not actively looking",
        prompt: (name: string, role: string, company: string, hook: string) =>
          `Write a personalized LinkedIn InMail to reach out to ${name || "a senior professional"} for the role of ${role || "a key position"} at ${company || "our company"}. Hook: ${hook || "their recent career achievement"}. Make it concise (under 120 words), personal, and value-driven. Include 3 variants: Formal, Conversational, and Ultra-short.`,
      },
      {
        label: "Follow-Up After No Reply",
        note: "2nd touch after ignored InMail",
        prompt: (name: string, role: string, company: string) =>
          `Write a polite 2nd follow-up LinkedIn message to ${name || "a candidate"} who didn't reply to an earlier InMail about the ${role || "role"} at ${company || "our company"}. Keep it under 80 words. Be light, not pushy. Include 2 tone variants.`,
      },
    ],
  },
  {
    category: "Cold Email",
    color: "bg-sky-600 text-white",
    items: [
      {
        label: "Sourcing Email",
        note: "First cold outreach via email",
        prompt: (name: string, role: string, company: string, hook: string) =>
          `Write a cold recruitment email to ${name || "a candidate"} for the role of ${role || "a position"} at ${company || "our company"}. Reference: ${hook || "their professional background"}. Include a compelling subject line, personalized opener, value proposition, and a soft CTA. Under 150 words. Provide 2 subject line options.`,
      },
      {
        label: "Referral Request Email",
        note: "Ask a contact for a referral",
        prompt: (name: string, role: string, company: string) =>
          `Write a professional email to ${name || "a contact"} asking for referrals for the ${role || "open role"} at ${company || "our company"}. Make it warm, specific, and easy to forward. Include what type of candidate we're looking for and a brief incentive mention.`,
      },
    ],
  },
  {
    category: "WhatsApp",
    color: "bg-green-600 text-white",
    items: [
      {
        label: "Quick Intro Message",
        note: "Short WhatsApp first contact",
        prompt: (name: string, role: string, company: string) =>
          `Write a short, friendly WhatsApp message to ${name || "a candidate"} about an opportunity for ${role || "a role"} at ${company || "our company"}. Under 60 words. Conversational tone. End with a question to get a reply.`,
      },
    ],
  },
  {
    category: "Campus / Fresh Hire",
    color: "bg-violet-600 text-white",
    items: [
      {
        label: "Campus Outreach",
        note: "Reach fresh graduates",
        prompt: (name: string, role: string, company: string) =>
          `Write a recruitment message for a fresh graduate (${name || "student"}) for a ${role || "Management Trainee"} role at ${company || "our company"}. Highlight growth, learning, and culture. Enthusiastic tone. Under 100 words. Include a LinkedIn post version and a WhatsApp version.`,
      },
    ],
  },
  {
    category: "Diversity Outreach",
    color: "bg-pink-600 text-white",
    items: [
      {
        label: "Returnship Outreach",
        note: "Women returning after career break",
        prompt: (name: string, role: string, company: string) =>
          `Write a warm, inclusive outreach message for ${name || "a professional"} returning from a career break. Role: ${role || "Data Analyst"}. Company: ${company || "our company"}. Highlight our returnship program, flexibility, and support network. Welcoming and empowering tone.`,
      },
    ],
  },
];

export function OutreachWorkspace() {
  const [candidateName, setCandidateName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hookNote, setHookNote] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<string>("");

  function pickTemplate(label: string, promptFn: (...args: string[]) => string) {
    const p = promptFn(candidateName, roleName, companyName, hookNote);
    setSelectedPrompt(p);
    setActiveTemplate(label);
  }

  async function generate() {
    if (!selectedPrompt.trim()) { setError("Select a template first."); return; }
    setError("");
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: "candidate-outreach-composer", userInput: selectedPrompt }),
      });
      const data = await res.json() as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error ?? "Failed to generate.");
      setOutput(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      {/* LEFT: Templates + form */}
      <div className="space-y-5">
        {/* Quick fill form */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Personalize Your Message</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Candidate Name", value: candidateName, set: setCandidateName, placeholder: "e.g. Arjun Mehta" },
              { label: "Role", value: roleName, set: setRoleName, placeholder: "e.g. Head of Product" },
              { label: "Company", value: companyName, set: setCompanyName, placeholder: "e.g. HealthTech Co." },
              { label: "Hook / Achievement", value: hookNote, set: setHookNote, placeholder: "e.g. Led mobile payments launch" },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="text-xs font-semibold text-muted-foreground">{label}</label>
                <input value={value} onChange={(e) => set(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
                  placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>

        {/* Template library */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Template Library</h2>
          <div className="mt-4 space-y-4">
            {TEMPLATES.map(({ category, color, items }) => (
              <div key={category}>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${color}`}>{category}</span>
                <div className="mt-2 space-y-2">
                  {items.map(({ label, note, prompt: promptFn }) => (
                    <button key={label} type="button"
                      onClick={() => pickTemplate(label, promptFn)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${activeTemplate === label ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted-surface"}`}>
                      <p className="text-sm font-semibold text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{note}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        <button type="button" onClick={generate} disabled={loading || !activeTemplate}
          className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating Messages...</> : "Generate Outreach Messages"}
        </button>
      </div>

      {/* RIGHT: Output */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Generated Messages</h2>
          {activeTemplate && <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">{activeTemplate}</span>}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Multiple variants ready to copy and send</p>
        <div className="mt-4 min-h-[450px] max-h-[650px] overflow-y-auto rounded-xl border border-border bg-muted-surface p-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Crafting personalized messages...
            </div>
          ) : output ? (
            <article className="prose prose-sm max-w-none text-foreground dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </article>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <p className="text-sm">Fill in details, pick a template, and generate</p>
            </div>
          )}
        </div>
        {output && <OutputActions output={output} subject={`Candidate Outreach — ${activeTemplate}`} />}
      </div>
    </div>
  );
}
