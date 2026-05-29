"use client";

import { useState, FormEvent, useRef } from "react";
import { Check, Copy, Loader2, Mail, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MessageType = "linkedin" | "cold-email" | "follow-up";
type Tone = "professional" | "friendly" | "urgent";

const MESSAGE_TYPES: { id: MessageType; label: string; emoji: string; desc: string }[] = [
  { id: "linkedin", label: "LinkedIn InMail", emoji: "💼", desc: "Direct message on LinkedIn" },
  { id: "cold-email", label: "Cold Email", emoji: "📧", desc: "First-touch email outreach" },
  { id: "follow-up", label: "Follow-Up", emoji: "🔁", desc: "Re-engage after no reply" },
];

const TONES: { id: Tone; label: string; color: string; activeRing: string; desc: string }[] = [
  { id: "professional", label: "Professional", color: "from-blue-500 to-blue-600", activeRing: "border-blue-500", desc: "Formal, credibility-first" },
  { id: "friendly", label: "Friendly", color: "from-emerald-500 to-green-500", activeRing: "border-emerald-500", desc: "Warm, conversational" },
  { id: "urgent", label: "Urgent", color: "from-orange-500 to-red-500", activeRing: "border-orange-500", desc: "Time-sensitive, action-driven" },
];

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
      <path d="M2 6C2 4.9 2.9 4 4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill="#F2F2F2" />
      <path d="M2 6L12 13L22 6" stroke="#EA4335" strokeWidth="2" />
      <path d="M2 6V18L7.5 12M22 6V18L16.5 12" fill="none" stroke="#34A853" strokeWidth="1.5" />
      <path d="M2 18L7.5 12L12 15.5L16.5 12L22 18" fill="#4285F4" />
      <path d="M2 6L12 13L22 6H2Z" fill="#EA4335" />
    </svg>
  );
}

function ZohoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
      <rect width="24" height="24" rx="5" fill="#E42527" />
      <text x="12" y="17.5" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Arial, sans-serif">Z</text>
    </svg>
  );
}

function buildPrompt(type: MessageType, tone: Tone, context: string): string {
  const typeLabel =
    type === "linkedin" ? "LinkedIn InMail" : type === "cold-email" ? "cold email" : "follow-up email";
  const isEmail = type !== "linkedin";
  return `You are an expert recruitment copywriter. Generate a ${typeLabel} with a ${tone} tone.

Context:
${context}

Requirements:
- Generate exactly 3 variants labeled as **Variant 1**, **Variant 2**, **Variant 3**
${isEmail ? "- For EACH variant include:\n  **Subject:** [subject line]\n  **Body:** [email body]" : "- Each LinkedIn message should be complete and send-ready"}
- Tone: ${tone === "professional" ? "formal, credibility-focused, structured" : tone === "friendly" ? "warm, human, conversational, slightly casual but professional" : "creates genuine urgency, deadline-aware, action-oriented without being pushy"}
- Length: ${isEmail ? "120–160 words per email body" : "80–120 words per message"}
- End every variant with a specific, clear call-to-action
- Write complete ready-to-send messages — no [brackets] or placeholders
- Separate variants with ---`;
}

function extractSubject(text: string): string {
  const match = text.match(/\*{0,2}Subject:?\*{0,2}\s*(.+)/i);
  if (match) return match[1].replace(/\*+/g, "").trim();
  return "Recruitment Opportunity";
}

function toPlainText(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, "").trim())
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .trim();
}

export function OutreachGeneratorWorkspace() {
  const [messageType, setMessageType] = useState<MessageType>("linkedin");
  const [tone, setTone] = useState<Tone>("professional");
  const [context, setContext] = useState(
    "Candidate: Priya Mehra, Senior Data Scientist at Flipkart, 7 years ML experience, Python + TensorFlow. Role: Lead Data Scientist at a Series B healthtech startup in Bangalore, ₹28–32 LPA. She hasn't replied to our first LinkedIn message sent 5 days ago."
  );
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLElement>(null);

  const isEmail = messageType !== "linkedin";
  const selectedTone = TONES.find((t) => t.id === tone)!;
  const selectedType = MESSAGE_TYPES.find((m) => m.id === messageType)!;

  async function copyOutput() {
    if (!output || !outputRef.current) return;
    try { await navigator.clipboard.writeText(outputRef.current.innerText); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function openGmail() {
    if (!output) return;
    const plain = toPlainText(output);
    const subject = isEmail ? extractSubject(output) : "Exciting Opportunity for You";
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(plain)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function openZoho() {
    if (!output) return;
    const plain = toPlainText(output);
    const subject = isEmail ? extractSubject(output) : "Exciting Opportunity for You";
    window.open(
      `https://mail.zoho.com/zm/#compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plain)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!context.trim()) return;
    setError("");
    setIsLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: "outreach-message-generator",
          userInput: buildPrompt(messageType, tone, context),
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error ?? "Generation failed.");
      setOutput(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[370px_1fr]">

      {/* ────────────── LEFT: Controls ────────────── */}
      <div className="space-y-4 xl:sticky xl:top-[72px] xl:self-start xl:max-h-[calc(100vh-96px)] xl:overflow-y-auto xl:pr-0.5">

        {/* Step 1 – Message Type */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Step 1 — Message Type
          </p>
          <div className="flex flex-col gap-2">
            {MESSAGE_TYPES.map((mt) => (
              <button
                key={mt.id}
                onClick={() => setMessageType(mt.id)}
                className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                  messageType === mt.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-muted-surface hover:border-primary/40"
                }`}
              >
                <span className="text-xl leading-none">{mt.emoji}</span>
                <div>
                  <p className="text-sm font-semibold leading-tight text-foreground">{mt.label}</p>
                  <p className="text-[11px] text-muted-foreground">{mt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 – Tone */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Step 2 — Tone
          </p>
          <div className="flex flex-col gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                  tone === t.id
                    ? `${t.activeRing} bg-primary/5 shadow-sm`
                    : "border-border bg-muted-surface hover:border-primary/40"
                }`}
              >
                <span
                  className={`shrink-0 rounded-full bg-gradient-to-r ${t.color} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white`}
                >
                  {t.label}
                </span>
                <p className="text-[11px] text-muted-foreground">{t.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3 – Context + Generate */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Step 3 — Candidate &amp; Situation
          </p>
          <form onSubmit={handleGenerate} className="space-y-3">
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={6}
              placeholder="Candidate name, current role, company, experience, target role, CTC, situation context..."
              className="w-full resize-none rounded-xl border border-border bg-muted-surface p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />

            {/* Live badge */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-muted-surface px-2.5 py-1.5 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">{selectedType.emoji} {selectedType.label}</span>
              <span className="text-border">·</span>
              <span className={`font-bold bg-gradient-to-r ${selectedTone.color} bg-clip-text text-transparent`}>
                {selectedTone.label} Tone
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !context.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
              ) : (
                <><Zap className="h-4 w-4" /> Generate Messages</>
              )}
            </button>

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </form>
        </section>
      </div>

      {/* ────────────── RIGHT: Output ────────────── */}
      <div>
        {!output && !isLoading && (
          <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted-surface/40 p-8 text-center">
            <div className="mb-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <Mail className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-semibold text-foreground">Output appears here</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Choose message type and tone, describe the candidate, then click Generate.
            </p>
            <div className="mt-5 flex items-center gap-3 opacity-35">
              <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium">
                <GmailIcon /> Gmail
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium">
                <ZohoIcon /> Zoho Mail
              </span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm font-semibold text-foreground">Crafting your messages…</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Generating 3 variants · {selectedTone.label} tone
            </p>
          </div>
        )}

        {output && !isLoading && (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

            {/* Email chrome / header */}
            <div className="border-b border-border bg-muted-surface px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/70" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                  <span className="h-3 w-3 rounded-full bg-green-400/70" />
                </div>
                <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate font-medium text-foreground">
                    {isEmail ? extractSubject(output) : `${selectedType.label} · ${selectedTone.label} Tone · 3 Variants`}
                  </span>
                </div>
              </div>

              {isEmail && (
                <div className="mt-2.5 space-y-0.5 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-16 shrink-0 font-semibold text-foreground/50">From:</span>
                    <span>you@yourcompany.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-16 shrink-0 font-semibold text-foreground/50">To:</span>
                    <span>candidate@email.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 shrink-0 text-xs font-semibold text-foreground/50">Subject:</span>
                    <span className="font-semibold text-foreground">{extractSubject(output)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Message body */}
            <article
              ref={outputRef}
              className="ai-output prose prose-sm max-w-none p-5 text-foreground"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </article>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted-surface px-5 py-3">
              {/* Copy */}
              <button
                onClick={copyOutput}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  copied
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {copied ? (
                  <><Check className="h-3 w-3" /> Copied!</>
                ) : (
                  <><Copy className="h-3 w-3" /> Copy All</>
                )}
              </button>

              <div className="h-4 w-px bg-border" />

              {/* Gmail */}
              <button
                onClick={openGmail}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-red-400/50 hover:text-foreground"
                title="Open in Gmail with subject and body pre-filled"
              >
                <GmailIcon />
                Open in Gmail
              </button>

              {/* Zoho */}
              <button
                onClick={openZoho}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-orange-400/50 hover:text-foreground"
                title="Open in Zoho Mail with subject and body pre-filled"
              >
                <ZohoIcon />
                Open in Zoho Mail
              </button>

              <span className="ml-auto hidden text-[10px] text-muted-foreground/50 sm:block">
                Subject &amp; body pre-filled
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
