type Props = {
  moduleId: string;
};

export function ModulePreview({ moduleId }: Props) {
  switch (moduleId) {
    case "resume-screener":
      return <ResumeScreenerPreview />;
    case "jd-writer":
      return <JDWriterPreview />;
    case "interview-kit-generator":
      return <InterviewKitPreview />;
    case "candidate-outreach-composer":
      return <CandidateOutreachPreview />;
    case "offer-rejection-email-writer":
      return <EmailWriterPreview />;
    case "salary-benchmarking":
      return <SalaryBenchmarkPreview />;
    default:
      return null;
  }
}

/* â”€â”€ 1. Resume Screener â”€â”€ Score card with skill bars */
function ResumeScreenerPreview() {
  const skills = [
    { label: "Technical Skills", pct: 88, color: "bg-violet-500" },
    { label: "Experience Depth", pct: 74, color: "bg-purple-400" },
    { label: "Domain Match", pct: 92, color: "bg-indigo-500" },
    { label: "Culture Fit", pct: 79, color: "bg-violet-400" },
  ];
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Candidate Fit Analysis</h2>
        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
          Live Output Preview
        </span>
      </div>

      {/* Big score */}
      <div className="mt-4 flex items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-violet-500 bg-violet-50 dark:bg-violet-950/30">
          <div>
            <p className="text-center text-2xl font-bold text-violet-600">84</p>
            <p className="text-center text-[10px] font-medium text-violet-500">/ 100</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Strong Match</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Recommended for next round</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Proceed to Interview
          </div>
        </div>
      </div>

      {/* Skill bars */}
      <div className="mt-5 space-y-3">
        {skills.map(({ label, pct, color }) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground">{pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted-surface">
              <div
                className={`h-2 rounded-full ${color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Gap note */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-300">
        <span className="font-semibold">Gap flagged:</span> No direct fintech experience â€” probe in interview
      </div>
    </article>
  );
}

/* â”€â”€ 2. JD Writer â”€â”€ Document structure preview */
function JDWriterPreview() {
  const sections = [
    { num: "01", title: "About the Company", lines: [100, 80, 60] },
    { num: "02", title: "Role Summary", lines: [90, 70] },
    { num: "03", title: "Key Responsibilities", lines: [100, 85, 90, 75, 80] },
    { num: "04", title: "Requirements", lines: [80, 95, 70] },
    { num: "05", title: "What We Offer", lines: [75, 85, 65] },
  ];
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">JD Structure Output</h2>
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
      </div>

      {/* Doc header */}
      <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 dark:border-sky-800/40 dark:bg-sky-950/30">
        <div className="h-3 w-48 rounded-full bg-sky-400/60" />
        <div className="mt-1.5 h-2 w-32 rounded-full bg-sky-300/40" />
      </div>

      {/* Section skeletons */}
      <div className="mt-3 space-y-3">
        {sections.map(({ num, title, lines }) => (
          <div key={num} className="rounded-lg border-l-2 border-sky-400 pl-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-sky-500">{num}</span>
              <span className="text-xs font-semibold text-foreground">{title}</span>
            </div>
            <div className="mt-1.5 space-y-1">
              {lines.map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-border" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">Bias-free âœ“</span>
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">SEO optimised âœ“</span>
      </div>
    </article>
  );
}

/* â”€â”€ 3. Interview Kit â”€â”€ Question card with STAR rubric */
function InterviewKitPreview() {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Interview Kit Preview</h2>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          12 Questions
        </span>
      </div>

      {/* Sample question card */}
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/30 dark:bg-emerald-950/20">
        <div className="flex items-start gap-2">
          <span className="rounded-lg bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">Q3</span>
          <p className="text-sm font-medium text-foreground leading-snug">
            &quot;Tell me about a time you led a cross-functional team through a high-pressure hiring sprint.&quot;
          </p>
        </div>
        <div className="mt-3 flex gap-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 dark:bg-emerald-900/30">STAR Format</span>
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 dark:bg-emerald-900/30">Leadership</span>
        </div>
      </div>

      {/* Scoring rubric */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scoring Rubric</p>
        <div className="mt-2 space-y-2">
          {[
            { score: 5, label: "Exceptional â€” quantified outcomes, team-first" },
            { score: 4, label: "Strong â€” clear ownership, good result" },
            { score: 3, label: "Adequate â€” partial STAR, vague impact" },
            { score: 2, label: "Weak â€” no context or outcome" },
          ].map(({ score, label }) => (
            <div key={score} className="flex items-center gap-2.5 text-xs">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${i < score ? "bg-emerald-500" : "bg-muted-surface border border-border"}`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">+ Red flags checklist included per question</p>
    </article>
  );
}

/* â”€â”€ 4. Candidate Outreach â”€â”€ LinkedIn message preview */
function CandidateOutreachPreview() {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Message Preview</h2>
        <div className="flex gap-1.5">
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">LinkedIn InMail</span>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">Email</span>
        </div>
      </div>

      {/* LinkedIn message bubble */}
      <div className="mt-4 rounded-2xl border border-[#0077b5]/20 bg-[#f3f9ff] p-4 dark:bg-[#0077b5]/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0077b5] text-xs font-bold text-white">YN</div>
          <div>
            <p className="text-xs font-semibold text-[#0077b5]">You</p>
            <p className="text-[10px] text-muted-foreground">via LinkedIn InMail</p>
          </div>
        </div>
        <p className="mt-3 text-xs font-semibold text-foreground">Re: Exciting Head of Product opportunity</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Hi Arjun, I came across your work on the mobile payments launch at Swiggy &mdash; impressive scale for 6 months. I&apos;m reaching out about a Head of Product role at a Series B healthtech...
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <div className="rounded-full border border-border bg-background px-3 py-1 text-[10px] font-semibold text-muted-foreground">Discard</div>
          <div className="rounded-full bg-[#0077b5] px-3 py-1 text-[10px] font-semibold text-white">Send</div>
        </div>
      </div>

      {/* Variants */}
      <div className="mt-3 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">3 Variants Generated</p>
        {["Formal â€” Board-level tone", "Casual â€” Startup culture fit", "Short â€” Under 80 words"].map((v) => (
          <div key={v} className="flex items-center gap-2 rounded-lg border border-border bg-muted-surface px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            <span className="text-xs text-muted-foreground">{v}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

/* â”€â”€ 5. Offer & Rejection Email â”€â”€ Email client preview */
function EmailWriterPreview() {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Email Composer Output</h2>
        <div className="flex gap-1">
          {["Offer", "Rejection", "Hold"].map((t, i) => (
            <span
              key={t}
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${i === 0 ? "bg-rose-500 text-white" : "border border-border text-muted-foreground"}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Email chrome */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        {/* Email header */}
        <div className="border-b border-border bg-muted-surface px-4 py-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-12 font-semibold text-muted-foreground">To</span>
            <span className="rounded bg-rose-100 px-2 py-0.5 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">priya.sharma@gmail.com</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            <span className="w-12 font-semibold text-muted-foreground">Subject</span>
            <span className="font-medium text-foreground">Your Offer â€” UX Designer @ Company Name</span>
          </div>
        </div>

        {/* Email body */}
        <div className="bg-surface px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <p>Dear <span className="font-semibold text-foreground">Priya</span>,</p>
          <p className="mt-2">
            We are delighted to extend you an offer for the position of <span className="font-semibold text-rose-600">UX Designer</span> with a CTC of <span className="font-semibold text-foreground">â‚¹18 LPA</span>, effective <span className="font-semibold text-foreground">15 June 2026</span>.
          </p>
          <div className="mt-3 space-y-1">
            {["Joining date: 15 June 2026", "Location: Pune â€” Hybrid (3 days)", "Reporting to: Design Director"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-rose-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground">Also generates: rejection by stage, hold email, counter-offer response</div>
    </article>
  );
}


/* -- 8. Salary Calculator -- CTC to take-home breakdown */
function SalaryBenchmarkPreview() {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-base font-semibold">Salary Calculator</h2>
        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-bold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          CTC to Take Home
        </span>
      </div>

      {/* Input summary */}
      <div className="rounded-xl bg-muted-surface p-3 text-xs space-y-2">
        {[
          { label: "Annual CTC", value: "Rs.18,00,000" },
          { label: "Bonus (10%)", value: "Rs.1,80,000" },
          { label: "Tax Regime", value: "New Regime" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-foreground">{value}</span>
          </div>
        ))}
      </div>

      {/* Visual stacked bar */}
      <div className="mt-4 h-5 rounded-full overflow-hidden flex gap-[2px]">
        <div className="bg-green-500" style={{ width: "74%" }} />
        <div className="bg-blue-400" style={{ width: "7%" }} />
        <div className="bg-orange-400" style={{ width: "11%" }} />
        <div className="bg-purple-400" style={{ width: "8%" }} />
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
        {[["bg-green-500", "Take Home 74%"], ["bg-blue-400", "EPF 7%"], ["bg-orange-400", "Tax 11%"], ["bg-purple-400", "Employer 8%"]].map(([color, label]) => (
          <span key={label} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-sm ${color}`} />{label}
          </span>
        ))}
      </div>

      {/* Breakdown rows */}
      <div className="mt-4 space-y-1.5">
        {[
          { label: "Basic Salary", value: "Rs.7,20,000", color: "" },
          { label: "HRA", value: "Rs.3,60,000", color: "" },
          { label: "Special Allowance", value: "Rs.4,13,676", color: "" },
          { label: "Employee EPF", value: "-Rs.21,600", color: "text-red-500" },
          { label: "Income Tax (TDS)", value: "-Rs.66,000", color: "text-red-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className={`font-semibold ${color || "text-foreground"}`}>{value}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">Monthly Take Home</span>
          <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">Rs.1,15,900</span>
        </div>
      </div>
    </article>
  );
}