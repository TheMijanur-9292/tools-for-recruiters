"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OutputActions } from "./output-actions";

const JOB_FUNCTIONS = ["Technology", "Sales", "Marketing", "HR & People", "Finance", "Operations", "Customer Success", "Leadership / Executive"];
const SENIORITY_LEVELS = ["Intern / Trainee", "Junior (0–2 yrs)", "Mid-Level (3–5 yrs)", "Senior (6–9 yrs)", "Lead / Manager", "Director / VP", "C-Suite / Partner"];
const COMPETENCY_OPTIONS = [
  "Problem Solving", "Communication", "Leadership", "Teamwork", "Adaptability",
  "Technical Skills", "Data Analysis", "Project Management", "Customer Focus",
  "Strategic Thinking", "Sales & Negotiation", "Coaching & Mentoring",
  "Product Thinking", "Process Improvement", "Decision Making",
];

export function InterviewKitWorkspace() {
  const [mode, setMode] = useState<"filters" | "jd">("filters");
  const [jobFunction, setJobFunction] = useState("");
  const [seniority, setSeniority] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  const [jdText, setJdText] = useState("");
  const [customCompetency, setCustomCompetency] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleCompetency(c: string) {
    setSelectedCompetencies((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function addCustom() {
    const val = customCompetency.trim();
    if (val && !selectedCompetencies.includes(val)) {
      setSelectedCompetencies((prev) => [...prev, val]);
      setCustomCompetency("");
    }
  }

  async function generate() {
    setError("");
    if (mode === "jd" && !jdText.trim()) { setError("Paste the job description first."); return; }
    if (mode === "filters" && !jobFunction && !seniority) { setError("Select at least Job Function or Seniority Level."); return; }
    setLoading(true);
    setOutput("");
    try {
      const competencyStr = selectedCompetencies.length ? selectedCompetencies.join(", ") : "general competencies";
      const prompt = mode === "jd"
        ? `Generate a complete structured interview kit based on this JD:\n\n${jdText}\n\nNumber of questions: ${numQuestions}.\nFor each question include: competency being assessed, question type (Behavioral/Situational/Technical), STAR format guide, scoring rubric (1–5 with anchor descriptions), and 1 red flag to watch for. Format cleanly.`
        : `Generate a complete structured interview kit for:\n- Job Function: ${jobFunction || "General"}\n- Seniority Level: ${seniority || "Mid-Level"}\n- Key Competencies: ${competencyStr}\n- Number of Questions: ${numQuestions}\n\nFor each question include: competency assessed, question type (Behavioral/Situational/Technical), STAR format guide, scoring rubric (1–5 with anchor descriptions), and 1 red flag to watch for. Also include a suggested panel structure and time allocation. Format cleanly with section headers.`;
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: "interview-kit-generator", userInput: prompt }),
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
      {/* LEFT: Filters */}
      <div className="space-y-5">
        {/* Mode toggle */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode("filters")}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${mode === "filters" ? "bg-emerald-600 text-white" : "border border-border text-muted-foreground hover:bg-muted-surface"}`}>
              Filter Builder
            </button>
            <button type="button" onClick={() => setMode("jd")}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${mode === "jd" ? "bg-emerald-600 text-white" : "border border-border text-muted-foreground hover:bg-muted-surface"}`}>
              From Job Description
            </button>
          </div>
        </div>

        {mode === "filters" ? (
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <h2 className="font-display text-lg font-semibold">Interview Kit Filters</h2>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Job Function</label>
              <select value={jobFunction} onChange={(e) => setJobFunction(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2">
                <option value="">Select job function...</option>
                {JOB_FUNCTIONS.map((j) => <option key={j}>{j}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Seniority Level</label>
              <select value={seniority} onChange={(e) => setSeniority(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2">
                <option value="">Select level...</option>
                {SENIORITY_LEVELS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Number of Questions: <span className="text-foreground font-bold">{numQuestions}</span></label>
              <input type="range" min={5} max={20} value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="mt-1.5 w-full accent-emerald-600" />
              <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground"><span>5</span><span>20</span></div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Key Competencies</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {COMPETENCY_OPTIONS.map((c) => (
                  <button key={c} type="button" onClick={() => toggleCompetency(c)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${selectedCompetencies.includes(c) ? "bg-emerald-600 text-white" : "border border-border text-muted-foreground hover:border-emerald-500 hover:text-foreground"}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input value={customCompetency} onChange={(e) => setCustomCompetency(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustom()}
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none ring-primary focus:ring-2"
                  placeholder="Add custom competency..." />
                <button type="button" onClick={addCustom} className="rounded-xl bg-emerald-600 p-1.5 text-white hover:bg-emerald-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {selectedCompetencies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedCompetencies.map((c) => (
                    <span key={c} className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {c}
                      <button type="button" onClick={() => toggleCompetency(c)} className="ml-0.5 hover:text-red-500"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <h2 className="font-display text-lg font-semibold">Paste Job Description</h2>
            <textarea value={jdText} onChange={(e) => setJdText(e.target.value)}
              className="h-48 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
              placeholder="Paste the full job description here. AI will extract competencies and generate matching interview questions..." />
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Number of Questions: <span className="text-foreground font-bold">{numQuestions}</span></label>
              <input type="range" min={5} max={20} value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="mt-1.5 w-full accent-emerald-600" />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}
        <button type="button" onClick={generate} disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating Kit...</> : `Generate ${numQuestions}-Question Interview Kit`}
        </button>
      </div>

      {/* RIGHT: Output */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">Interview Kit Output</h2>
        <p className="mt-1 text-xs text-muted-foreground">Structured questions with STAR guide, scoring rubric, and red flags</p>
        <div className="mt-4 min-h-[500px] max-h-[700px] overflow-y-auto rounded-xl border border-border bg-muted-surface p-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Building your interview kit...
            </div>
          ) : output ? (
            <article className="prose prose-sm max-w-none text-foreground dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </article>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <p className="text-sm">Set filters or paste a JD, then generate your kit</p>
            </div>
          )}
        </div>
        {output && <OutputActions output={output} subject="Interview Kit — Structured Assessment Guide" />}
      </div>
    </div>
  );
}
