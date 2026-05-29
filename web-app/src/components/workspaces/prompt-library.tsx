"use client";

import { useState, FormEvent } from "react";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Category = "sourcing" | "boolean" | "outreach" | "screening" | "jd";

interface Prompt {
  title: string;
  desc: string;
  text: string;
}

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "sourcing", label: "Sourcing", emoji: "🔍" },
  { id: "boolean", label: "Boolean Search", emoji: "⚙️" },
  { id: "outreach", label: "LinkedIn Outreach", emoji: "💬" },
  { id: "screening", label: "Candidate Screening", emoji: "📋" },
  { id: "jd", label: "JD Creation", emoji: "📝" },
];

const PROMPTS: Record<Category, Prompt[]> = {
  sourcing: [
    {
      title: "Senior Tech Talent Sourcing",
      desc: "Full sourcing strategy for a developer role",
      text: "Build a complete sourcing strategy to find 15–20 qualified Senior React Developer candidates (5–8 years, Bangalore) within 7 days. List: 5 platforms to source from, 3 search strategies per platform, a target company list, and a daily sourcing activity plan.",
    },
    {
      title: "Niche Role Deep Dive",
      desc: "Rare skill set — where to look",
      text: "I need to source candidates for a rare role: Embedded Systems Engineer with RTOS and CAN bus experience in Pune. Where do I find them? List 6 unconventional sourcing channels, 3 community groups, 2 conference databases, and a GitHub search approach.",
    },
    {
      title: "Passive Candidate Pipeline",
      desc: "Build a warm talent pool from scratch",
      text: "Create a 30-day passive candidate pipeline strategy for hiring 10 Data Scientists for a Series B fintech. Include: sourcing channels, engagement touchpoints, content to share, and a tracking template with columns for status and last contact.",
    },
    {
      title: "Volume Hiring Sourcing Plan",
      desc: "Bulk sourcing for high-volume roles",
      text: "I need to source 200 candidates for BPO voice process roles (Hindi + English, any grad, 0–2 years experience, Mumbai and Pune) in 2 weeks. Provide a day-by-day sourcing plan, job boards to use, walk-in drive script, and referral push strategy.",
    },
    {
      title: "Campus Hiring Strategy",
      desc: "Fresh talent from colleges",
      text: "Design a campus hiring strategy to hire 50 Management Trainees from Tier-2 MBA colleges in India. Include: target institutes list, pre-placement talk outline, online test structure, interview process, and offer timeline.",
    },
    {
      title: "Diversity Sourcing Brief",
      desc: "Build an inclusive talent pipeline",
      text: "Create a diversity sourcing brief to increase women representation in tech roles at a 500-person product company. List: 8 platforms focused on diverse talent, outreach messaging tips, returnship program pitch, and partnership organizations to contact.",
    },
  ],
  boolean: [
    {
      title: "Senior Full-Stack Developer",
      desc: "React + Node + PostgreSQL in Bangalore",
      text: '(React OR ReactJS OR "React.js") AND ("Node.js" OR NodeJS) AND (PostgreSQL OR MySQL OR MongoDB) AND ("senior" OR "lead" OR "principal") AND (Bangalore OR "Bengaluru") NOT (intern OR fresher OR trainee OR HR OR recruiter)',
    },
    {
      title: "Product Manager — Fintech",
      desc: "B2C fintech PM with startup background",
      text: '("product manager" OR "product owner" OR "PM") AND (fintech OR "financial technology" OR payments OR lending) AND ("B2C" OR "consumer" OR "mobile app") AND (Bangalore OR Mumbai OR Delhi) NOT (intern OR "looking for work" OR recruiter)',
    },
    {
      title: "DevOps Engineer — Cloud Native",
      desc: "Kubernetes + AWS + CI/CD specialist",
      text: '("DevOps engineer" OR "SRE" OR "platform engineer") AND (Kubernetes OR K8s) AND (AWS OR GCP OR Azure) AND ("CI/CD" OR Jenkins OR "GitHub Actions" OR ArgoCD) AND (Hyderabad OR Bangalore OR Pune) NOT (fresher OR junior OR intern)',
    },
    {
      title: "Data Scientist — ML Focus",
      desc: "Python ML engineer with NLP/DL",
      text: '("data scientist" OR "ML engineer" OR "machine learning engineer") AND (Python OR PyTorch OR TensorFlow) AND ("NLP" OR "deep learning" OR "LLM" OR "transformer") AND ("4 years" OR "5 years" OR "senior" OR "lead") NOT (intern OR student OR "data entry")',
    },
    {
      title: "HR Business Partner",
      desc: "Senior HRBP with business exposure",
      text: '("HR business partner" OR HRBP OR "human resources business partner") AND ("business partnering" OR "OD" OR "talent management" OR "workforce planning") AND (Pune OR Mumbai OR Bangalore) AND ("8 years" OR "senior" OR "lead") NOT (fresher OR intern)',
    },
    {
      title: "Sales Head — B2B SaaS",
      desc: "Enterprise sales leader",
      text: '("VP sales" OR "sales head" OR "director of sales" OR "head of sales") AND ("B2B" OR "enterprise" OR "SaaS" OR "software") AND ("quota" OR "revenue" OR "ARR" OR "pipeline") AND (Bangalore OR Mumbai OR Delhi) NOT (BPO OR retail OR "field sales")',
    },
  ],
  outreach: [
    {
      title: "First InMail — Passive Candidate",
      desc: "Warm intro to someone not actively looking",
      text: "Hi [Name], I came across your profile and your work on [specific project / skill] genuinely stood out. We're working on a [Role] search for [Company/Client type] that's a strong match for your background. The team is [2-3 sentence culture/growth hook]. Would you be open to a 10-minute chat this week? No pressure at all.",
    },
    {
      title: "Follow-Up After No Reply",
      desc: "Second touch — light and non-pushy",
      text: "Hi [Name], just circling back on my earlier message about the [Role] opportunity. I know inboxes get busy — wanted to make sure this didn't get buried. It's a genuinely exciting role and I think your background in [skill] is a great fit. Happy to share a quick JD if that helps. Worth a brief call?",
    },
    {
      title: "Referral Request InMail",
      desc: "Ask a connection for a referral",
      text: "Hi [Name], hope you're doing well! I'm working on a [Role] search and immediately thought of you — not for the role itself, but to see if you know someone in your network who might be a fit. Profile: [2-line candidate description]. If anyone comes to mind, I'd really appreciate an intro. Happy to return the favour anytime.",
    },
    {
      title: "Urgent Role — Deadline InMail",
      desc: "Time-sensitive opening with deadline",
      text: "Hi [Name], I'm reaching out because we have a [Role] opening that's moving very quickly — final interviews are this week and we'd love to include the right person. Your background in [skill] is exactly what the hiring team is looking for. Could you spare 10 minutes tomorrow or the day after? I'll keep it brief and respect your time.",
    },
    {
      title: "Campus / Fresher Outreach",
      desc: "Reach out to a fresh graduate",
      text: "Hi [Name], congratulations on your [Degree/Achievement]! I'm reaching out from [Company/Agency] about a [Management Trainee / Graduate Program] opportunity that I think would be a great start to your career. We're a [company description], and this role offers [2-line value prop]. Would love to tell you more — are you open to a quick chat?",
    },
    {
      title: "Reconnect After Past Rejection",
      desc: "Re-engage a previously rejected candidate",
      text: "Hi [Name], it's been a while! I hope things are going well at [their current company]. I remember we spoke earlier this year about [previous role] — while the timing didn't work out then, we now have a [new role] that feels much more aligned with where you are now. Would you be open to reconnecting for a quick catch-up?",
    },
  ],
  screening: [
    {
      title: "Opening Screen — Any Role",
      desc: "First 5 questions for any phone screen",
      text: "What is your current role and company, and what motivated you to explore new opportunities at this point in your career?\n\nWhat is your current CTC (fixed + variable) and what are your expectations for the new role?\n\nWhat is your notice period, and is there any flexibility for an early joining?\n\nCan you briefly walk me through your career highlights — the 2–3 experiences most relevant to the role we're discussing?\n\nWhat are your top 3 criteria when evaluating a new opportunity?",
    },
    {
      title: "Technical Role Depth Questions",
      desc: "Probe technical skills without being a test",
      text: "Tell me about a technically complex problem you solved in your last role — what was the challenge, your approach, and the outcome?\n\nWhat's the largest scale system / dataset / team you've worked with, and what were the unique challenges at that scale?\n\nWhat tools and technologies are you most productive in right now, and where are you actively learning or upskilling?\n\nDescribe a time when a technical decision you made caused a problem — how did you identify it and fix it?\n\nIf you had to mentor a junior engineer for 3 months, what are the top 5 things you'd focus on?",
    },
    {
      title: "Culture & Motivation Screening",
      desc: "Check culture fit and stability signals",
      text: "Describe the type of manager or leadership style you work best under, with an example.\n\nWhat does a great day at work look like for you?\n\nTell me about a time you disagreed with a decision at work — how did you handle it?\n\nWhat are you looking for in your next company that you don't have today?\n\nWhere do you see yourself in 3 years, and how does this role fit into that path?",
    },
    {
      title: "Leadership & Senior Role Assessment",
      desc: "Questions for manager and above roles",
      text: "Tell me about a team you built or significantly grew — what was your hiring philosophy and how did you develop people?\n\nDescribe a high-stakes business decision you made with incomplete information. What was your process?\n\nHow have you managed a situation where your team's goals and another team's goals were in conflict?\n\nWhat's the toughest performance issue you've dealt with as a manager — how did you handle it?\n\nHow do you keep yourself and your team motivated during a difficult quarter?",
    },
    {
      title: "Offer Stage Final Check",
      desc: "Questions before making an offer",
      text: "Now that you've been through the full interview process, how excited are you about this role on a scale of 1–10 — and what would make it a 10?\n\nAre you in any other processes currently, and where are you with them?\n\nIf we were to make you an offer, would your notice period be the only constraint, or are there other considerations we should know about?\n\nIs there anything about the role, team, or company that you'd like us to address before you make a decision?",
    },
  ],
  jd: [
    {
      title: "JD Writing Prompt — Tech Role",
      desc: "Full JD for a software engineering position",
      text: "Write a compelling Job Description for a Senior Backend Engineer role. Company: Product-based SaaS startup, Series B, 150 employees, remote-first culture. Tech stack: Python, FastAPI, PostgreSQL, Redis, AWS. Experience: 5–8 years. Include: compelling intro paragraph, responsibilities (8 points), requirements (must-have and nice-to-have), why join us section (3 points), and compensation range mention. Tone: modern, human, not corporate-jargon-heavy.",
    },
    {
      title: "JD Writing Prompt — Sales Role",
      desc: "JD for a B2B enterprise sales position",
      text: "Write a Job Description for an Enterprise Sales Manager (B2B SaaS). Company: A fast-growing HR tech company targeting mid-market and enterprise clients in India. The role involves owning the full sales cycle, managing 3 junior SDRs, and a revenue target of ₹3Cr/year. Include: role summary, key responsibilities, ideal candidate profile, what we offer (comp + ESOPs + culture), and a closing call-to-action.",
    },
    {
      title: "Inclusive JD Rewrite",
      desc: "Remove bias from an existing JD",
      text: "Rewrite the following JD to make it more inclusive, gender-neutral, and welcoming to diverse candidates including career-break returners. Remove: jargon, age-coded language (rockstar, ninja, young & dynamic), and unnecessary requirements. Add: welcoming diversity statement, flexible work policy mention, and growth path for the role. [PASTE YOUR JD HERE]",
    },
    {
      title: "Quick JD — 5 Minutes",
      desc: "Fast JD when you have no time",
      text: "Create a concise Job Description (under 350 words) for [Job Title] at [Company Name]. Focus on the 3 most important responsibilities, 5 must-have requirements, and 3 key benefits. Tone should be direct and modern. The JD should be copy-paste ready for LinkedIn and Naukri posting.",
    },
  ],
};

export function PromptLibraryWorkspace() {
  const [activeCategory, setActiveCategory] = useState<Category>("sourcing");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [enhanceInput, setEnhanceInput] = useState("");
  const [enhancedOutput, setEnhancedOutput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState("");

  async function copyPrompt(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  async function handleEnhance(e: FormEvent) {
    e.preventDefault();
    if (!enhanceInput.trim()) return;
    setEnhanceError("");
    setIsEnhancing(true);
    setEnhancedOutput("");
    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: "recruiter-prompt-library",
          userInput: `You are an expert AI prompt engineer for recruitment professionals. A recruiter has written a vague or weak prompt. Rewrite it into a precise, structured, and highly effective AI prompt that will produce a much better output.\n\nOriginal prompt:\n"${enhanceInput}"\n\nYour enhanced version should:\n- Be specific and include all necessary context\n- Define the expected output format\n- Include constraints (word count, tone, structure)\n- Be ready to paste directly into ChatGPT or any AI tool\n- Add relevant industry/recruitment context the recruiter forgot to mention\n\nFirst show the enhanced prompt in a code block, then briefly explain (2–3 bullets) what you improved.`,
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error ?? "Enhancement failed.");
      setEnhancedOutput(data.text);
    } catch (err) {
      setEnhanceError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsEnhancing(false);
    }
  }

  const prompts = PROMPTS[activeCategory];

  return (
    <div className="space-y-5">
      {/* Category Tabs */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Browse by Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-muted-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Prompt Cards */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {CATEGORIES.find((c) => c.id === activeCategory)?.emoji}{" "}
            {CATEGORIES.find((c) => c.id === activeCategory)?.label} Prompts
          </p>
          <span className="rounded-full border border-border bg-muted-surface px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {prompts.length} prompts
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {prompts.map((prompt, i) => {
            const key = `${activeCategory}-${i}`;
            const isCopied = copiedIndex === key;
            return (
              <div
                key={key}
                className="group relative rounded-xl border border-border bg-muted-surface p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{prompt.title}</p>
                    <p className="text-xs text-muted-foreground">{prompt.desc}</p>
                  </div>
                  <button
                    onClick={() => copyPrompt(prompt.text, key)}
                    className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      isCopied
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                        : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {isCopied ? (
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3" /> Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="h-3 w-3" /> Copy
                      </span>
                    )}
                  </button>
                </div>
                <p className="mt-2.5 line-clamp-3 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  {prompt.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Prompt Enhancer */}
      <section className="rounded-2xl border border-amber-500/30 bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-1.5">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">AI Prompt Enhancer</p>
            <p className="text-xs text-muted-foreground">
              Paste any vague prompt — AI rewrites it into a precise, structured one
            </p>
          </div>
        </div>
        <form onSubmit={handleEnhance} className="space-y-3">
          <textarea
            value={enhanceInput}
            onChange={(e) => setEnhanceInput(e.target.value)}
            rows={3}
            placeholder='e.g. "find me python devs in hyd who are good at ml stuff"'
            className="w-full rounded-xl border border-border bg-muted-surface p-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
          />
          <button
            type="submit"
            disabled={isEnhancing || !enhanceInput.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enhancing Prompt…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Enhance My Prompt
              </>
            )}
          </button>
          {enhanceError && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {enhanceError}
            </p>
          )}
        </form>
        {enhancedOutput && (
          <div className="mt-4">
            <article className="ai-output prose prose-sm max-w-none text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{enhancedOutput}</ReactMarkdown>
            </article>
          </div>
        )}
      </section>
    </div>
  );
}
