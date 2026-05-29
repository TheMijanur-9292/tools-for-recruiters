"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OutputActions } from "./output-actions";

type EmailType = "screening" | "interview-invite" | "technical-assessment" | "rejection" | "offer" | "hold";

const EMAIL_TYPES: { id: EmailType; label: string; color: string; activeColor: string }[] = [
  { id: "screening", label: "Screening Call", color: "border-border text-muted-foreground", activeColor: "bg-sky-600 text-white border-sky-600" },
  { id: "interview-invite", label: "Interview Invite", color: "border-border text-muted-foreground", activeColor: "bg-indigo-600 text-white border-indigo-600" },
  { id: "technical-assessment", label: "Assessment", color: "border-border text-muted-foreground", activeColor: "bg-violet-600 text-white border-violet-600" },
  { id: "offer", label: "Offer Letter", color: "border-border text-muted-foreground", activeColor: "bg-emerald-600 text-white border-emerald-600" },
  { id: "rejection", label: "Rejection", color: "border-border text-muted-foreground", activeColor: "bg-rose-600 text-white border-rose-600" },
  { id: "hold", label: "On Hold", color: "border-border text-muted-foreground", activeColor: "bg-amber-500 text-white border-amber-500" },
];

type FormField = { label: string; key: string; placeholder: string; type?: "textarea" };

const FORM_FIELDS: Record<EmailType, FormField[]> = {
  screening: [
    { label: "Candidate Name", key: "name", placeholder: "e.g. Priya Sharma" },
    { label: "Role Applied For", key: "role", placeholder: "e.g. Senior UX Designer" },
    { label: "Screening Call Date & Time", key: "datetime", placeholder: "e.g. Tuesday 27 May, 3:00 PM IST" },
    { label: "Platform / Link", key: "platform", placeholder: "e.g. Zoom / Google Meet link" },
    { label: "Duration", key: "duration", placeholder: "e.g. 30 minutes" },
  ],
  "interview-invite": [
    { label: "Candidate Name", key: "name", placeholder: "e.g. Rahul Verma" },
    { label: "Role", key: "role", placeholder: "e.g. Backend Engineer" },
    { label: "Interview Stage", key: "stage", placeholder: "e.g. Technical Round 2" },
    { label: "Date & Time", key: "datetime", placeholder: "e.g. Friday 30 May, 2:00 PM" },
    { label: "Format", key: "format", placeholder: "e.g. Video call / In-person" },
    { label: "Interviewers", key: "interviewers", placeholder: "e.g. Arun (Tech Lead), Smita (HR)" },
    { label: "Topics / Preparation Note", key: "topics", placeholder: "e.g. System design, coding round" },
  ],
  "technical-assessment": [
    { label: "Candidate Name", key: "name", placeholder: "e.g. Anjali Nair" },
    { label: "Role", key: "role", placeholder: "e.g. Data Scientist" },
    { label: "Assessment Type", key: "type", placeholder: "e.g. Take-home case study / HackerRank" },
    { label: "Deadline", key: "deadline", placeholder: "e.g. 48 hours from receiving the link" },
    { label: "Assessment Link", key: "link", placeholder: "e.g. https://..." },
  ],
  offer: [
    { label: "Candidate Name", key: "name", placeholder: "e.g. Karan Malhotra" },
    { label: "Role", key: "role", placeholder: "e.g. Product Manager" },
    { label: "CTC Offered", key: "ctc", placeholder: "e.g. ₹24 LPA" },
    { label: "Joining Date", key: "joining", placeholder: "e.g. 16 June 2026" },
    { label: "Location", key: "location", placeholder: "e.g. Mumbai — Hybrid 3 days" },
    { label: "Reporting To", key: "reporting", placeholder: "e.g. VP of Product" },
    { label: "Offer Expiry", key: "expiry", placeholder: "e.g. 5 working days" },
    { label: "Special Terms / Benefits", key: "benefits", placeholder: "e.g. ESOPs, health insurance, joining bonus" },
  ],
  rejection: [
    { label: "Candidate Name", key: "name", placeholder: "e.g. Meera Pillai" },
    { label: "Role Applied For", key: "role", placeholder: "e.g. Sales Team Lead" },
    { label: "Stage Reached", key: "stage", placeholder: "e.g. Final round / Technical interview" },
    { label: "Reason (optional, internal use)", key: "reason", placeholder: "e.g. Another candidate had stronger domain expertise" },
    { label: "Tone Preference", key: "tone", placeholder: "e.g. Empathetic and warm / Professional and brief" },
  ],
  hold: [
    { label: "Candidate Name", key: "name", placeholder: "e.g. Deepak Joshi" },
    { label: "Role", key: "role", placeholder: "e.g. Marketing Manager" },
    { label: "Hold Reason", key: "reason", placeholder: "e.g. Position put on hold due to budget review" },
    { label: "Expected Timeline", key: "timeline", placeholder: "e.g. Will update within 3-4 weeks" },
  ],
};

const EMAIL_SUBJECT: Record<EmailType, (role: string) => string> = {
  screening: (role) => `Screening Call Invitation — ${role}`,
  "interview-invite": (role) => `Interview Invitation — ${role}`,
  "technical-assessment": (role) => `Technical Assessment — ${role}`,
  offer: (role) => `Job Offer — ${role}`,
  rejection: (role) => `Application Update — ${role}`,
  hold: (role) => `Application Status Update — ${role}`,
};

export function EmailWriterWorkspace() {
  const [emailType, setEmailType] = useState<EmailType>("offer");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function getField(key: string) { return formData[key] ?? ""; }

  async function generate() {
    const currentFields = FORM_FIELDS[emailType];
    const nameField = getField("name");
    if (!nameField.trim()) { setError("Please enter the candidate's name."); return; }
    setError("");
    setLoading(true);
    setOutput("");
    try {
      const fieldsSummary = currentFields.map((f) => `${f.label}: ${getField(f.key) || "Not specified"}`).join("\n");
      const prompt = `Write a professional ${EMAIL_TYPES.find(e => e.id === emailType)?.label} email for a recruitment context.

Email Details:
${fieldsSummary}

Requirements:
- Include a proper email Subject line
- Start with "Dear [Candidate Name],"
- Body should be warm, professional, and clear
- Include all relevant details from above
- End with a professional sign-off with "Talent Acquisition Team" signature
- ${emailType === "offer" ? "Make it exciting and welcoming" : ""}
- ${emailType === "rejection" ? "Be empathetic, specific, leave door open for future roles" : ""}
- ${emailType === "hold" ? "Be transparent but reassuring" : ""}
- Format cleanly with clear paragraphs

Also provide: 1 alternate subject line`;

      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: "offer-rejection-email-writer", userInput: prompt }),
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

  const currentType = EMAIL_TYPES.find((e) => e.id === emailType);
  const roleName = getField("role");
  const subject = EMAIL_SUBJECT[emailType](roleName || "Role");

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      {/* LEFT: Email type + form */}
      <div className="space-y-5">
        {/* Email type selector */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Email Type</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {EMAIL_TYPES.map((et) => (
              <button key={et.id} type="button" onClick={() => { setEmailType(et.id); setOutput(""); }}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${emailType === et.id ? et.activeColor : `${et.color} hover:bg-muted-surface`}`}>
                {et.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic form */}
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          <h2 className="font-display text-base font-semibold flex items-center gap-2">
            <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${currentType?.activeColor}`}>{currentType?.label}</span>
            Details
          </h2>
          {FORM_FIELDS[emailType].map((field) => (
            <div key={field.key}>
              <label className="text-xs font-semibold text-muted-foreground">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea value={getField(field.key)} onChange={(e) => setField(field.key, e.target.value)}
                  className="mt-1 h-16 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
                  placeholder={field.placeholder} />
              ) : (
                <input value={getField(field.key)} onChange={(e) => setField(field.key, e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
                  placeholder={field.placeholder} />
              )}
            </div>
          ))}
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="button" onClick={generate} disabled={loading}
            className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition disabled:opacity-60 flex items-center justify-center gap-2 ${currentType?.activeColor.split(" ")[0] ?? "bg-primary"} hover:opacity-90`}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Writing Email...</> : `Generate ${currentType?.label} Email`}
          </button>
        </div>
      </div>

      {/* RIGHT: Email preview */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">Email Preview</h2>
        <p className="mt-1 text-xs text-muted-foreground">Professional, ready-to-send format</p>

        {/* Email chrome */}
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="border-b border-border bg-muted-surface px-4 py-3 space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-16 text-xs font-semibold text-muted-foreground">To</span>
              <span className="text-xs text-foreground">{getField("name") ? `${getField("name")} <candidate@email.com>` : "candidate@email.com"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-16 text-xs font-semibold text-muted-foreground">Subject</span>
              <span className="text-xs font-medium text-foreground">{subject}</span>
            </div>
          </div>
          <div className="min-h-[350px] max-h-[500px] overflow-y-auto bg-surface p-4">
            {loading ? (
              <div className="flex h-40 items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" /> Writing your email...
              </div>
            ) : output ? (
              <article className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
              </article>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <p className="text-sm">Fill in the details and click Generate</p>
              </div>
            )}
          </div>
        </div>
        {output && <OutputActions output={output} subject={subject} />}
      </div>
    </div>
  );
}
