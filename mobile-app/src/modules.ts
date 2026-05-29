export type MobileModule = {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  introLines: string[];
  capabilities: string[];
  sampleInput: string;
};

export const modules: MobileModule[] = [
  {
    id: "smart-daily-work-assistant",
    title: "Smart Daily Work Assistant",
    shortDescription:
      "Prioritize daily recruiter and HR tasks with timelines and follow-up drafts.",
    icon: "git-network-outline",
    introLines: [
      "This page plans your day from one raw task list.",
      "It can assign priority and propose realistic time estimates.",
      "It also drafts communication updates for teams and stakeholders.",
    ],
    capabilities: [
      "Task priority and sequencing",
      "Time estimate and ownership suggestion",
      "Follow-up communication drafts",
    ],
    sampleInput:
      "12 interview feedback pending, 5 offers to release, and 3 client updates due today.",
  },
  {
    id: "ai-report-generator",
    title: "AI Report Generator",
    shortDescription:
      "Turn staffing and operations numbers into concise business reports.",
    icon: "bar-chart-outline",
    introLines: [
      "This page converts raw metrics into report-ready insights.",
      "It highlights trends and risk areas clearly.",
      "It helps leadership review outcomes faster.",
    ],
    capabilities: [
      "Executive summary from KPI notes",
      "Risk and blocker extraction",
      "Recommended next actions",
    ],
    sampleInput:
      "Week data: 490 sourced, 180 shortlisted, 66 interviews, 24 offers, 14 joins.",
  },
  {
    id: "customer-reply-copilot",
    title: "Customer Reply Copilot",
    shortDescription:
      "Generate professional replies for client and candidate conversations.",
    icon: "chatbubble-ellipses-outline",
    introLines: [
      "This page drafts clear and polite responses quickly.",
      "It adapts tone for client, candidate, or internal communication.",
      "It can suggest escalation when the case is sensitive.",
    ],
    capabilities: [
      "Context-aware reply generation",
      "Tone customization",
      "Escalation recommendation",
    ],
    sampleInput:
      "Client complaint about delayed replacement against agreed timeline.",
  },
  {
    id: "marketing-content-factory",
    title: "Marketing Content Factory",
    shortDescription:
      "Create campaign copy variations from one recruitment brief.",
    icon: "megaphone-outline",
    introLines: [
      "This page expands one brief into multiple content assets.",
      "It can produce social copy, email drafts, and ad headlines.",
      "It keeps messaging consistent across channels.",
    ],
    capabilities: [
      "Multi-format content output",
      "Audience-specific copy variants",
      "Campaign CTA suggestions",
    ],
    sampleInput:
      "Hiring campaign for bilingual support associates in Dubai next month.",
  },
  {
    id: "code-debug-test-assistant",
    title: "Code Debug and Test Assistant",
    shortDescription:
      "Diagnose engineering issues and propose tests for safer fixes.",
    icon: "code-slash-outline",
    introLines: [
      "This page analyzes failures with root-cause style output.",
      "It can recommend fix direction and risk checks.",
      "It supports faster turnaround with quality coverage.",
    ],
    capabilities: [
      "Root-cause diagnosis",
      "Fix strategy suggestions",
      "Test case generation",
    ],
    sampleInput:
      "API timeout when syncing more than 200 candidate records in one request.",
  },
  {
    id: "sop-checklist-converter",
    title: "SOP to Checklist Converter",
    shortDescription:
      "Convert long SOP blocks into practical execution checklists.",
    icon: "checkmark-done-outline",
    introLines: [
      "This page converts dense SOP text into action steps.",
      "It marks key controls and compliance checks.",
      "It makes onboarding execution easier for teams.",
    ],
    capabilities: [
      "Step-by-step checklist creation",
      "Critical control extraction",
      "Common mistake prevention notes",
    ],
    sampleInput:
      "Onboarding SOP: KYC verification, background check, payroll setup within 48 hours.",
  },
  {
    id: "ticket-task-classifier",
    title: "Ticket and Task Classifier",
    shortDescription:
      "Categorize and prioritize incoming requests for faster routing.",
    icon: "pricetags-outline",
    introLines: [
      "This page classifies ticket text into clear buckets.",
      "It can estimate urgency and assign an owner recommendation.",
      "It reduces manual triage workload in busy queues.",
    ],
    capabilities: [
      "Category and intent tagging",
      "Priority scoring",
      "Owner and next-step recommendation",
    ],
    sampleInput:
      "Employee cannot access attendance portal before payroll lock window.",
  },
  {
    id: "outreach-message-generator",
    title: "Outreach Message Generator",
    shortDescription:
      "Pick message type and tone, describe the situation — AI writes a ready-to-send LinkedIn message, cold email, or follow-up.",
    icon: "flash-outline",
    introLines: [
      "Choose LinkedIn InMail, Cold Email, or Follow-up as your message type.",
      "Select Professional, Friendly, or Urgent tone.",
      "Paste candidate context — AI generates 2–3 send-ready variants.",
    ],
    capabilities: [
      "3 message types: LinkedIn, Cold Email, Follow-up",
      "3 tone modes: Professional, Friendly, Urgent",
      "2–3 variants per generation for A/B testing",
    ],
    sampleInput:
      "Candidate: Priya Mehra, Senior Data Scientist at Flipkart, 7 years ML. Role: Lead Data Scientist, healthtech startup Bangalore. She has not replied to first message.",
  },
  {
    id: "recruiter-prompt-library",
    title: "Recruiter Prompt Library",
    shortDescription:
      "30+ copy-paste prompts for sourcing, Boolean search, outreach, screening, and JD writing. Plus AI Prompt Enhancer.",
    icon: "library-outline",
    introLines: [
      "Browse 5 categories: Sourcing, Boolean Search, Outreach, Screening, JD Creation.",
      "Copy any prompt with one tap and paste into any AI tool or LinkedIn.",
      "Use the AI Prompt Enhancer to upgrade your vague prompts instantly.",
    ],
    capabilities: [
      "30+ ready-to-use prompts across 5 categories",
      "One-tap copy for instant use",
      "AI Prompt Enhancer for upgrading weak prompts",
    ],
    sampleInput:
      "Generate a Boolean search string for a Senior DevOps Engineer with Kubernetes and AWS experience in Hyderabad.",
  },
];