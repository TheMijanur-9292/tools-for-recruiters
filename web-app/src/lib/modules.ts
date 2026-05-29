export type ModuleIconName =
  | "resume"
  | "jd"
  | "interview"
  | "outreach"
  | "email"
  | "salary"
  | "todo"
  | "outreach-gen"
  | "prompt-lib"
  | "banner";

export type ModuleDefinition = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  audience: string[];
  icon: ModuleIconName;
  color: string;
  unsplashId: string;
  badge: string;
  pageIntro: string[];
  capabilities: string[];
  sampleInput: string;
};

export const MODULES: ModuleDefinition[] = [
  {
    id: "resume-screener",
    slug: "resume-screener",
    title: "Resume Screener & Scorer",
    shortDescription:
      "Paste a CV and job description — AI scores the fit, highlights strengths, and surfaces key gaps instantly.",
    audience: ["Recruiters", "Talent Acquisition", "HR Managers"],
    icon: "resume",
    color: "from-violet-500 to-purple-600",
    unsplashId: "photo-1586281380349-632531db7ed4",
    badge: "Assessment",
    pageIntro: [
      "Upload or paste any resume alongside the target job description.",
      "AI assigns a fit score out of 100 with a breakdown by skill, experience, and culture alignment.",
      "Get a shortlist recommendation and specific follow-up questions for the interview.",
    ],
    capabilities: [
      "Fit score out of 100 with category-wise breakdown.",
      "Key strengths and missing requirements extracted automatically.",
      "Interview follow-up questions based on identified gaps.",
      "Candidate summary in 3 sentences for sharing with hiring managers.",
    ],
    sampleInput:
      "Job: Senior React Developer, 5+ years, fintech background. Candidate: 4 years React, banking domain, led a team of 3.",
  },
  {
    id: "jd-writer",
    slug: "jd-writer",
    title: "Job Description Writer",
    shortDescription:
      "Turn a rough role brief into a polished, bias-free, SEO-optimized job description ready to post.",
    audience: ["HR Business Partners", "Recruiters", "Talent Branding"],
    icon: "jd",
    color: "from-sky-500 to-cyan-600",
    unsplashId: "photo-1521737711867-e3b97375f902",
    badge: "Sourcing",
    pageIntro: [
      "Describe the role in plain language — title, team, responsibilities, and must-haves.",
      "AI produces a complete JD with inclusive language, clear structure, and strong employer branding.",
      "Output is ready to copy into LinkedIn, job boards, or your ATS.",
    ],
    capabilities: [
      "Full JD with About Us, Role Summary, Responsibilities, and Requirements sections.",
      "Bias-free language check and inclusive rewrite suggestions.",
      "SEO keyword optimization for higher job board visibility.",
      "Multiple tone variants: corporate, startup, conversational.",
    ],
    sampleInput:
      "Role: Customer Success Manager. Team: 8 people. Must have: SaaS experience, Hindi + English fluency. Location: Bangalore, hybrid.",
  },
  {
    id: "interview-kit-generator",
    slug: "interview-kit-generator",
    title: "Interview Kit Generator",
    shortDescription:
      "Generate a full interview kit — structured questions, scoring rubric, and evaluation guide — in seconds.",
    audience: ["Hiring Managers", "Panel Interviewers", "L&D Teams"],
    icon: "interview",
    color: "from-emerald-500 to-teal-600",
    unsplashId: "photo-1573497019940-1c28c88b4f3e",
    badge: "Assessment",
    pageIntro: [
      "Provide the role title, seniority level, and key competencies you are assessing.",
      "AI creates a full structured interview with behavioral, technical, and situational questions.",
      "Each question comes with a scoring guide so all panel members evaluate consistently.",
    ],
    capabilities: [
      "10–15 structured questions mapped to key competencies.",
      "STAR-format behavioral questions with evaluation criteria.",
      "Scoring rubric from 1–5 per competency with anchor descriptions.",
      "Red flag indicators for each question type.",
    ],
    sampleInput:
      "Role: Sales Team Lead, mid-senior level. Key competencies: leadership, objection handling, pipeline management, coaching.",
  },
  {
    id: "candidate-outreach-composer",
    slug: "candidate-outreach-composer",
    title: "Candidate Outreach Composer",
    shortDescription:
      "Write personalized LinkedIn messages and cold emails that get replies — tailored to each candidate's profile.",
    audience: ["Sourcers", "Recruiters", "Executive Search"],
    icon: "outreach",
    color: "from-orange-500 to-amber-500",
    unsplashId: "photo-1516321318423-f06f85e504b3",
    badge: "Sourcing",
    pageIntro: [
      "Paste the candidate's background and the role you are pitching.",
      "AI writes a personalized outreach that references their specific experience and explains why the role fits them.",
      "Choose from LinkedIn InMail, email, or WhatsApp formats.",
    ],
    capabilities: [
      "Hyper-personalized first line referencing candidate's actual experience.",
      "Value proposition matched to the candidate's career stage.",
      "LinkedIn InMail, cold email, and short WhatsApp message variants.",
      "A/B subject line options for higher open rates.",
    ],
    sampleInput:
      "Candidate: 6 years in fintech product management, recently led mobile payments launch. Role: Head of Product at a Series B startup.",
  },
  {
    id: "offer-rejection-email-writer",
    slug: "offer-rejection-email-writer",
    title: "Offer & Rejection Email Writer",
    shortDescription:
      "Draft professional offer letters and empathetic rejection emails that protect your employer brand.",
    audience: ["HR Operations", "Recruiters", "Talent Acquisition Leads"],
    icon: "email",
    color: "from-rose-500 to-pink-600",
    unsplashId: "photo-1554224155-8d04cb21cd6c",
    badge: "Communication",
    pageIntro: [
      "Provide candidate name, role, and key offer details — or the rejection reason.",
      "AI drafts a warm, professional email with all necessary details and the right tone.",
      "Offer emails are legally neutral; rejection emails preserve future relationship potential.",
    ],
    capabilities: [
      "Offer emails with compensation, start date, and next-step instructions.",
      "Rejection emails segmented by stage: screening, interview, final round.",
      "Candidate hold and waitlist message variants.",
      "Counter-offer response drafts for negotiation scenarios.",
    ],
    sampleInput:
      "Candidate: Priya Mehta. Role: UX Designer. Offer: ₹18 LPA, joining 15 June, hybrid Pune. Needs offer letter email.",
  },
  {
    id: "salary-benchmarking",
    slug: "salary-benchmarking",
    title: "Salary Calculator",
    shortDescription:
      "Instantly calculate CTC to take-home salary with full breakdowns — Basic, HRA, EPF, tax under old and new regime.",
    audience: ["HR Business Partners", "Total Rewards", "Hiring Managers", "Candidates"],
    icon: "salary",
    color: "from-yellow-500 to-orange-500",
    unsplashId: "photo-1579621970563-ebec7560ff3e",
    badge: "Compensation",
    pageIntro: [
      "Enter annual CTC and bonus percentage to get a complete salary breakdown instantly.",
      "Compare New Regime vs Old Regime tax to choose the one that maximises your take-home.",
      "All calculations follow India FY 2025-26 tax rules — EPF, gratuity, professional tax included.",
    ],
    capabilities: [
      "Full salary split: Basic, HRA, LTA, Special Allowance, Bonus.",
      "Employee EPF, employer EPF, and gratuity auto-calculated.",
      "Income tax under New Regime (FY 2025-26 slabs) and Old Regime (with 80C).",
      "Annual and monthly view toggle with net take-home highlighted.",
    ],
    sampleInput:
      "Annual CTC: Rs.18 LPA. Bonus: 10%. Tax Regime: New Regime. Compare take-home under both regimes.",
  },
  {
    id: "recruiter-todo",
    slug: "recruiter-todo",
    title: "Recruiter To-Do Planner",
    shortDescription:
      "Smart daily task manager for recruiters — add, prioritize, and track every hiring activity with AI-powered organization.",
    audience: ["Recruiters", "HR Operations", "Talent Acquisition Leads"],
    icon: "todo",
    color: "from-fuchsia-500 to-pink-600",
    unsplashId: "photo-1484480974693-6ca0a78fb36b",
    badge: "Productivity",
    pageIntro: [
      "Add your daily recruiting tasks — sourcing, interviews, offers, follow-ups, and admin.",
      "AI prioritizes your task list by urgency, impact, and deadline.",
      "Track progress in real time with category tags and completion status.",
    ],
    capabilities: [
      "Task creation with category (Sourcing, Interview, Offer, Onboarding, Admin) and priority.",
      "AI-powered task prioritization with reasoning.",
      "Progress tracking with completion percentage.",
      "Daily planning summary generation.",
    ],
    sampleInput:
      "Tasks: Call 5 candidates for screening, send 3 offer letters, schedule panel for Backend role, update ATS for 12 candidates, send weekly report to manager.",
  },
  {
    id: "outreach-message-generator",
    slug: "outreach-message-generator",
    title: "Outreach Message Generator",
    shortDescription:
      "Pick message type and tone, describe the candidate — AI generates a ready-to-send LinkedIn message, cold email, or follow-up in seconds.",
    audience: ["Recruiters", "Sourcers", "Talent Acquisition", "Staffing Consultants"],
    icon: "outreach-gen",
    color: "from-sky-500 to-cyan-600",
    unsplashId: "photo-1611532736597-de2d4265fba3",
    badge: "Communication",
    pageIntro: [
      "Select the message format: LinkedIn InMail, Cold Email, or Follow-up.",
      "Choose the tone that fits the situation: Professional, Friendly, or Urgent.",
      "Paste the candidate context — AI writes a polished, ready-to-send message instantly.",
    ],
    capabilities: [
      "3 message types: LinkedIn InMail, Cold Email, Follow-up message.",
      "3 tone modes: Professional, Friendly, Urgent — each produces different copy style.",
      "AI generates 2–3 message variants per request for A/B testing.",
      "Subject lines for emails included automatically.",
    ],
    sampleInput:
      "Candidate: Priya Mehra, Senior Data Scientist at Flipkart, 7 years experience, ML specialist. Role: Lead Data Scientist at a Series B healthtech in Bangalore. She hasn't replied to our first message.",
  },
  {
    id: "bulk-banner-generator",
    slug: "bulk-banner-generator",
    title: "Bulk Banner Generator",
    shortDescription:
      "Upload XLSX or PPTX data, pick one field, apply bulk updates across all rows/slides, and download an updated XLSX for Canva bulk import.",
    audience: ["HR Teams", "Marketing", "Talent Branding", "Recruiters"],
    icon: "banner",
    color: "from-blue-500 to-indigo-600",
    unsplashId: "photo-1561070791-2526d30994b5",
    badge: "Productivity",
    pageIntro: [
      "Upload your Canva bulk data file in XLSX/XLS format or upload a PPTX to extract slide text.",
      "Select one field to edit and choose a transform: Find & Replace, Set All Same, or Copy Column.",
      "Preview changes and download an updated XLSX that can be re-imported into Canva bulk create.",
    ],
    capabilities: [
      "Parses XLSX/XLS files and auto-detects available columns.",
      "Extracts slide text from PPTX files into editable rows.",
      "Supports three bulk transforms: Find & Replace, Set All Same, and Copy Column.",
      "Shows before/after preview with affected row counts before download.",
      "Exports updated data as XLSX for Canva bulk re-import.",
      "Works fully in the browser for local data processing.",
    ],
    sampleInput:
      "Upload a Canva bulk XLSX (or a PPTX with slide text), select Email field, replace @2coms.com with @globaltalentsquare.com, preview affected rows, and download updated XLSX.",
  },
  {
    id: "recruiter-prompt-library",
    slug: "recruiter-prompt-library",
    title: "Recruiter Prompt Library",
    shortDescription:
      "A curated, copy-paste library of 30+ recruitment prompts — Boolean search strings, sourcing queries, screening scripts, and more. All instantly ready.",
    audience: ["Recruiters", "Sourcers", "HR Teams", "Talent Leads"],
    icon: "prompt-lib",
    color: "from-amber-500 to-orange-600",
    unsplashId: "photo-1507003211169-0a1dd7228f2d",
    badge: "Productivity",
    pageIntro: [
      "Browse 5 categories: Sourcing, Boolean Search, LinkedIn Outreach, Candidate Screening, and JD Creation.",
      "One click copies any prompt directly to your clipboard — no editing needed.",
      "Use the AI Prompt Enhancer to paste any weak prompt and get an upgraded version.",
    ],
    capabilities: [
      "30+ ready-to-use prompts across 5 categories.",
      "One-click copy — paste directly into ChatGPT, Groq, or LinkedIn search.",
      "AI Prompt Enhancer converts vague prompts into precise, structured ones.",
      "Boolean strings ready for LinkedIn Recruiter, Naukri, and GitHub.",
    ],
    sampleInput:
      "I need a Boolean search string for a Senior DevOps Engineer with Kubernetes and AWS experience in Hyderabad.",
  },
];

export function getModuleBySlug(slug: string): ModuleDefinition | undefined {
  return MODULES.find((module) => module.slug === slug);
}
