export type MobileDemoTemplate = {
  title: string;
  note: string;
  prompt: string;
};

export const DEMO_TEMPLATES: Record<string, MobileDemoTemplate[]> = {
  "smart-daily-work-assistant": [
    {
      title: "Daily Recruiter Plan",
      note: "Priorities with timeline and ownership",
      prompt:
        "Create my recruiter day plan from 9:30 AM to 6:30 PM for 12 pending feedbacks, 5 offer releases, and 3 client updates.",
    },
    {
      title: "Follow-Up Drafts",
      note: "Candidate and client communication",
      prompt:
        "Prepare short follow-up drafts for interview scheduling, delayed feedback apology, and offer release confirmation.",
    },
    {
      title: "Escalation Plan",
      note: "High urgency recruitment case",
      prompt:
        "Client has escalated because closure is delayed for critical roles. Provide recovery actions and communication plan.",
    },
  ],
  "ai-report-generator": [
    {
      title: "Weekly Summary",
      note: "Leadership-ready report draft",
      prompt:
        "Data this week: sourced 520, screened 210, interviews 70, offers 26, joins 15. Build a concise weekly performance report.",
    },
    {
      title: "Risk Snapshot",
      note: "Find blockers and slippage",
      prompt:
        "Create a risk snapshot from rising no-show rate, delayed onboarding, and offer rejection trend.",
    },
    {
      title: "Client Review Notes",
      note: "Quick talking points",
      prompt:
        "Generate client review notes with achievements, challenges, and next-week measurable actions.",
    },
  ],
  "customer-reply-copilot": [
    {
      title: "SLA Delay Reply",
      note: "Professional apology and update",
      prompt:
        "Draft a polite email for delayed replacement request with clear revised timeline and preventive steps.",
    },
    {
      title: "Candidate Clarification",
      note: "Clear tone in simple language",
      prompt:
        "Candidate asks why interview format changed at the last minute. Write a reassuring update with next steps.",
    },
    {
      title: "Escalation Guidance",
      note: "Whether to escalate and why",
      prompt:
        "Issue unresolved after 3 reminders from our team. Suggest escalation path and draft escalation note.",
    },
  ],
  "marketing-content-factory": [
    {
      title: "Hiring Campaign Pack",
      note: "Social plus email copy",
      prompt:
        "Create LinkedIn post, short email campaign, and ad headline set for hiring bilingual support associates.",
    },
    {
      title: "Employer Branding",
      note: "Talent attraction narrative",
      prompt:
        "Write a concise employer branding copy set for 2Coms focusing on growth, learning, and impact.",
    },
    {
      title: "Referral Push",
      note: "Strong CTA format",
      prompt:
        "Generate internal referral campaign text with urgency and clear action steps for employees.",
    },
  ],
  "code-debug-test-assistant": [
    {
      title: "Root Cause Drill",
      note: "Error diagnosis structure",
      prompt:
        "API timeout occurs during bulk candidate sync above 200 records. Suggest likely root causes and fix strategy.",
    },
    {
      title: "Test Suite Draft",
      note: "Unit and integration coverage",
      prompt:
        "Create test scenarios for duplicate offer ID generation during parallel requests.",
    },
    {
      title: "Incident Summary",
      note: "Post-incident writeup",
      prompt:
        "Draft a short incident summary for candidate portal outage and recovery actions.",
    },
  ],
  "sop-checklist-converter": [
    {
      title: "Onboarding Checklist",
      note: "Execution-ready checklist",
      prompt:
        "Convert onboarding SOP into checklist with owner, due time, and evidence required for each step.",
    },
    {
      title: "Audit Checklist",
      note: "Compliance format",
      prompt:
        "Transform process SOP into branch-level audit checklist with mandatory controls and verification points.",
    },
    {
      title: "Training Checklist",
      note: "New joinee friendly",
      prompt:
        "Rewrite SOP into beginner-friendly checklist with common mistakes and correction guidance.",
    },
  ],
  "ticket-task-classifier": [
    {
      title: "Queue Classification",
      note: "Category, priority, owner",
      prompt:
        "Classify incoming employee issues into categories with priority score and owner team recommendation.",
    },
    {
      title: "Escalation Prediction",
      note: "Detect urgent tickets",
      prompt:
        "Identify which tickets from payroll, portal, and onboarding queues should be escalated immediately.",
    },
    {
      title: "Backlog Reduction",
      note: "Operational optimization",
      prompt:
        "Suggest ticket routing improvements to reduce backlog by 30% in two weeks.",
    },
  ],
  "outreach-message-generator": [
    {
      title: "Follow-Up (Friendly Tone)",
      note: "Re-engage a candidate who ghosted",
      prompt:
        "Generate a friendly follow-up LinkedIn message for Arjun Rao, Senior Backend Engineer at Infosys, 6 years Node.js. Role: Lead Engineer at a product startup. He did not reply to our first InMail 5 days ago. Generate 2 variants under 80 words each.",
    },
    {
      title: "Cold Email (Professional)",
      note: "First outreach to a passive candidate",
      prompt:
        "Write a professional cold email to Neha Singh, Data Science Manager at Amazon, 9 years ML experience. Role: Head of AI at a funded B2B SaaS. Include a subject line, body under 150 words, and 2 subject line options.",
    },
    {
      title: "LinkedIn InMail (Urgent)",
      note: "Role closing soon, create urgency",
      prompt:
        "Write an urgent LinkedIn InMail for Rahul Mehta, PM with 7 years fintech experience. Role: Senior PM at an NBFC, offer deadline this Friday. Under 100 words, urgent but not pushy.",
    },
  ],
  "recruiter-prompt-library": [
    {
      title: "Boolean Search String",
      note: "LinkedIn Recruiter boolean for tech role",
      prompt:
        "Generate a Boolean search string for LinkedIn Recruiter to find a Senior Full-Stack Developer with React and Node.js in Bangalore, 5-8 years experience. Exclude interns and recruiters.",
    },
    {
      title: "Phone Screening Script",
      note: "10 questions for a DevOps engineer screen",
      prompt:
        "Create a 10-question phone screening script for a Senior DevOps Engineer role. Include: CTC questions, notice period, technical depth on Kubernetes and CI/CD, and a culture fit question.",
    },
    {
      title: "AI Prompt Enhancer",
      note: "Upgrade a weak sourcing prompt",
      prompt:
        "Improve this weak recruiter prompt: Find me some Python developers in Hyderabad who are good at data stuff. Make it specific with Boolean logic, experience range, and target companies.",
    },
  ],
};