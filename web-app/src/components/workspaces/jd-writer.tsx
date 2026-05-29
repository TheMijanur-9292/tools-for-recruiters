"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OutputActions } from "./output-actions";

const TONES = ["Professional & Corporate", "Modern & Startup", "Conversational & Friendly", "Bold & Direct"];
const WORK_TYPES = ["On-site", "Remote", "Hybrid"];
const LEVELS = ["Intern", "Junior", "Mid-Level", "Senior", "Lead", "Manager", "Director", "VP / C-Suite"];

export function JDWriterWorkspace() {
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("Hybrid");
  const [level, setLevel] = useState("Mid-Level");
  const [about, setAbout] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [niceToHave, setNiceToHave] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!jobTitle.trim()) { setError("Please enter a Job Title."); return; }
    setError("");
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Write a complete, professional job description for the following role. Format it with clear section headers.

**Role Details:**
- Job Title: ${jobTitle}
- Department: ${department || "Not specified"}
- Location: ${location || "India"} (${workType})
- Seniority Level: ${level}
- Salary Range: ${salaryRange || "Competitive, based on experience"}
- Preferred Tone: ${tone}

**About the Company** (provided context):
${about || "A growing, innovative company with a collaborative culture focused on excellence."}

**Key Responsibilities** (raw input to refine):
${responsibilities || "Build and maintain core systems, collaborate with cross-functional teams, deliver high-quality output."}

**Requirements** (raw input to refine):
${requirements || "Relevant experience, strong communication, problem-solving mindset."}

**Nice-to-Have:**
${niceToHave || "Additional relevant skills or domain knowledge."}

Create a complete, polished JD with:
1. About the Company (2-3 sentences)
2. Role Overview (2-3 sentences with value proposition)
3. Key Responsibilities (6-8 bullet points)
4. Must-Have Requirements (5-6 points)
5. Nice-to-Have (3-4 points)
6. What We Offer (4-5 perks/benefits)
7. A closing inclusion/diversity statement

Make it compelling, bias-free, and ready to post on LinkedIn/job boards.`;

      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: "jd-writer", userInput: prompt }),
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
      {/* LEFT: Form */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <h2 className="font-display text-lg font-semibold">Role Details</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Job Title *</label>
            <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
              placeholder="e.g. Senior Product Manager" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Department</label>
            <input value={department} onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
              placeholder="e.g. Product & Engineering" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
              placeholder="e.g. Bangalore" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Salary Range</label>
            <input value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
              placeholder="e.g. ₹18–25 LPA" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Work Type</label>
            <div className="mt-1.5 flex gap-2">
              {WORK_TYPES.map((w) => (
                <button key={w} type="button" onClick={() => setWorkType(w)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${workType === w ? "bg-sky-600 text-white" : "border border-border text-muted-foreground hover:bg-muted-surface"}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Seniority Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2">
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">About Company <span className="font-normal">(optional)</span></label>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)}
            className="mt-1 h-20 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            placeholder="Brief company description..." />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Key Responsibilities</label>
          <textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)}
            className="mt-1 h-24 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            placeholder="List main responsibilities (rough notes OK, AI will polish)..." />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Requirements</label>
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)}
            className="mt-1 h-20 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            placeholder="Must-have skills, experience, qualifications..." />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Nice-to-Have</label>
          <textarea value={niceToHave} onChange={(e) => setNiceToHave(e.target.value)}
            className="mt-1 h-16 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            placeholder="Bonus skills or preferred experience..." />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">JD Tone</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button key={t} type="button" onClick={() => setTone(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${tone === t ? "bg-sky-600 text-white" : "border border-border text-muted-foreground hover:bg-muted-surface"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        <button type="button" onClick={generate} disabled={loading}
          className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Writing JD...</> : "Generate Full Job Description"}
        </button>
      </div>

      {/* RIGHT: Generated JD */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Generated Job Description</h2>
          {jobTitle && <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">{jobTitle}</span>}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Polished, bias-free, ready to post</p>
        <div className="mt-4 min-h-[500px] max-h-[700px] overflow-y-auto rounded-xl border border-border bg-muted-surface p-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Writing your job description...
            </div>
          ) : output ? (
            <article className="prose prose-sm max-w-none text-foreground dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </article>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <p className="text-sm">Fill in the form and click Generate</p>
              <p className="text-xs">AI will create a complete, polished JD ready to post</p>
            </div>
          )}
        </div>
        {output && <OutputActions output={output} subject={`Job Description — ${jobTitle || "Role"}`} />}
      </div>
    </div>
  );
}
