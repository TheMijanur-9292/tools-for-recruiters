export type DemoTemplate = {
  title: string;
  note: string;
  prompt: string;
};

export const DEMO_TEMPLATES: Record<string, DemoTemplate[]> = {
  "resume-screener": [
    {
      title: "Tech Role Fit Check",
      note: "Score a developer CV against a JD",
      prompt:
        "Job Description: Senior React Developer, 5+ years experience, fintech background preferred, must know TypeScript and REST APIs. Candidate Resume: 4 years React experience, worked at HDFC Bank tech team, TypeScript proficient, led a team of 3 developers. Score this candidate out of 100, explain strengths, identify gaps, and suggest 3 interview questions to probe the gaps.",
    },
    {
      title: "Sales Role Screening",
      note: "Evaluate a sales candidate against targets",
      prompt:
        "Job: B2B SaaS Sales Manager, 3+ years enterprise sales, Hindi + English required, must have achieved ₹2Cr+ annual quota. Candidate: 5 years sales experience, 2 years in SaaS, consistent quota achiever, managed 20+ enterprise accounts. Provide fit score, strengths, gaps, and a shortlist recommendation.",
    },
    {
      title: "Bulk Screening Summary",
      note: "Rank 3 candidates for the same role",
      prompt:
        "Role: HR Business Partner. Candidate A: 6 years HRBP, FMCG sector, led 500-person org. Candidate B: 4 years HR generalist, tech startup, no HRBP title. Candidate C: 7 years HR, manufacturing, HRBP for 2 years. Rank all three, give individual scores, and recommend interview order.",
    },
  ],
  "jd-writer": [
    {
      title: "Tech Role JD",
      note: "Full JD for a developer role",
      prompt:
        "Write a complete job description for a Senior Backend Engineer role. Team: Platform Engineering, 12 people. Must have: Node.js, 5+ years, system design experience. Good to have: Kafka, AWS. Location: Hyderabad hybrid. Tone: professional but modern startup feel. Include About Us placeholder, role summary, responsibilities (8 points), requirements (must-have vs nice-to-have), and what we offer.",
    },
    {
      title: "Non-Tech HR Role JD",
      note: "JD for a Talent Acquisition role",
      prompt:
        "Create a job description for a Talent Acquisition Specialist. Company: mid-size fintech, 300 employees. Role: full-cycle recruiting for tech and business roles, 3+ years experience required. Location: Mumbai, 3 days in office. Must use inclusive, bias-free language. Include diversity statement at the end.",
    },
    {
      title: "Leadership Role JD",
      note: "VP-level executive role posting",
      prompt:
        "Write a compelling JD for VP of People Operations. Reporting to CHRO. Responsibilities: OD, L&D, HR Tech, Comp & Ben, 15+ years experience required. Company is a listed company, 2000+ employees, pan-India. Tone: authoritative and strategic. Include leadership expectations section.",
    },
  ],
  "interview-kit-generator": [
    {
      title: "Product Manager Interview Kit",
      note: "Full kit for mid-senior PM role",
      prompt:
        "Create a complete interview kit for a Senior Product Manager role, 5-8 years experience, B2C product focus. Include: 12 structured questions covering product thinking, leadership, data-driven decisions, and stakeholder management. Add STAR-format behavioral questions with scoring rubric 1-5, and a red flags section for each competency.",
    },
    {
      title: "Sales Leader Assessment",
      note: "Interview guide for regional sales head",
      prompt:
        "Generate a structured interview kit for Regional Sales Head position. Key competencies to assess: strategic thinking, team leadership, P&L ownership, client relationships, and resilience. Include 10 questions with evaluation criteria, a scoring rubric, and 3 case-study-style situational questions.",
    },
    {
      title: "Graduate Hire Panel Guide",
      note: "Structured campus hire interview",
      prompt:
        "Build an interview guide for campus recruits applying for a Management Trainee program. Focus competencies: learning agility, communication, problem solving, and cultural fit. Include 8 questions, scoring rubric, and a recommended panel structure with time allocation per section.",
    },
  ],
  "candidate-outreach-composer": [
    {
      title: "Passive Candidate LinkedIn InMail",
      note: "Reach a senior professional not actively looking",
      prompt:
        "Write a personalized LinkedIn InMail to reach out to a passive candidate. Candidate profile: 8 years in product management, currently at Swiggy as Senior PM, recently posted about scaling food tech challenges. Role: Head of Product at an early-stage healthtech startup, Series A, remote-first. Make the message concise, personal, and compelling. Include 3 variants.",
    },
    {
      title: "Tech Talent Cold Email",
      note: "Email outreach to a developer",
      prompt:
        "Draft a cold outreach email to a software engineer. Candidate: 5 years full-stack, contributed to open-source React libraries, works at a mid-size IT services company. Role: Senior Engineer at a product company with strong engineering culture and 30% higher comp. Write a subject line and email body under 150 words. Include A/B subject line options.",
    },
    {
      title: "Diversity Hiring Outreach",
      note: "Inclusive outreach for underrepresented talent",
      prompt:
        "Create an outreach message for a diversity hiring initiative targeting women returning to work after a career break. Role: Data Analyst at a BFSI company. The message should be welcoming, highlight returnship support, flexible work policy, and mentoring programs. Write for LinkedIn and email formats.",
    },
  ],
  "offer-rejection-email-writer": [
    {
      title: "Offer Letter Email",
      note: "Warm offer email with all key details",
      prompt:
        "Draft a professional offer letter email for: Candidate: Priya Sharma. Role: UX Designer, full-time. CTC: ₹18 LPA. Joining date: 15 June 2026. Location: Pune, hybrid 3 days. Reporting to: Design Director. Include next steps, document list required, and a warm closing that builds excitement.",
    },
    {
      title: "Post-Final-Round Rejection",
      note: "Empathetic rejection after final interview",
      prompt:
        "Write a respectful rejection email for a candidate who reached the final round but was not selected. Candidate name: Rahul Verma. Role: Product Manager. Reason: another candidate had stronger domain experience. The email must: acknowledge his effort, be specific about next steps, leave door open for future roles, and avoid generic corporate language.",
    },
    {
      title: "Offer Negotiation Counter",
      note: "Response to a candidate negotiating the offer",
      prompt:
        "Candidate Anjali Nair has countered our offer of ₹22 LPA with a request for ₹26 LPA. We can go up to ₹24 LPA with an additional joining bonus of ₹1L. Write a professional email that presents the revised offer positively, highlights total comp value (including ESOPs, benefits), and maintains a warm relationship tone.",
    },
  ],
  "salary-benchmarking": [
    {
      title: "Tech Role Salary Range",
      note: "Market band for a developer role in metro city",
      prompt:
        "Provide a salary benchmarking report for Senior React Developer role. Experience: 5–7 years. Location: Bangalore. Industry: Product-based fintech company, Series B. Include: salary band (min/mid/max), P25/P50/P75 percentiles, total compensation breakdown (base + variable + benefits + ESOPs), and 3 negotiation talking points for the recruiter.",
    },
    {
      title: "Leadership Role Benchmarking",
      note: "VP-level compensation package analysis",
      prompt:
        "Benchmark compensation for VP of Engineering. Experience: 15+ years. Location: Mumbai. Industry: Listed IT services company, 5000+ employees. Provide: CTC band, long-term incentive structure, peer company comparison (TCS, Infosys, Wipro level), and recommended offer framing to attract from competition.",
    },
    {
      title: "Salary Counter-Offer Response",
      note: "Guidance when candidate negotiates",
      prompt:
        "Candidate: Senior HR Business Partner, 8 years experience, Hyderabad. Our offer: ₹22 LPA. Candidate counter: ₹27 LPA. Market data needed: Is ₹27 LPA above, at, or below market? What is the justification for our offer range? Provide a negotiation script and a structured counter-offer response.",
    },
  ],
  "outreach-message-generator": [
    {
      title: "Follow-Up After No Reply (Friendly)",
      note: "Re-engage a candidate who ghosted",
      prompt:
        "Generate a follow-up message for: Candidate: Arjun Rao, Senior Backend Engineer at Infosys, 6 years Node.js + AWS. Role: Lead Engineer at a product startup. He didn't reply to our first LinkedIn InMail sent 5 days ago. Tone: Friendly. Message type: LinkedIn Follow-up. Generate 2 variants under 80 words each.",
    },
    {
      title: "Cold Email — Passive Senior Candidate",
      note: "First outreach to someone not looking",
      prompt:
        "Write a cold email outreach for: Candidate: Neha Singh, Data Science Manager at Amazon, 9 years experience, Python + ML. Not actively job hunting. Role: Head of AI at a funded B2B SaaS company. Tone: Professional. Message type: Cold Email. Include a subject line and keep body under 150 words. Provide 2 subject line options.",
    },
    {
      title: "Urgent LinkedIn InMail — Closing Deadline",
      note: "Role closing soon, create urgency",
      prompt:
        "Write a LinkedIn InMail for: Candidate: Rahul Mehta, Product Manager with 7 years fintech experience. Role: Senior PM at a top-tier NBFC, urgent backfill, offer deadline is this Friday. Tone: Urgent. Message type: LinkedIn InMail. Create a sense of genuine urgency without being pushy. Under 100 words.",
    },
  ],
  "recruiter-prompt-library": [
    {
      title: "Boolean Search — Senior Developer",
      note: "LinkedIn Recruiter boolean string",
      prompt:
        "Generate a Boolean search string for LinkedIn Recruiter to find a Senior Full-Stack Developer with React, Node.js, and PostgreSQL experience in Bangalore with 5-8 years experience. Exclude freshers and recruiters from results.",
    },
    {
      title: "Candidate Screening Script",
      note: "Phone screen questions for a tech role",
      prompt:
        "Create a 10-question phone screening script for a Senior DevOps Engineer role. Include: current CTC and expected CTC questions, notice period, reason for change, technical depth questions on Kubernetes and CI/CD, and a culture fit question. Keep each question concise.",
    },
    {
      title: "AI Prompt Enhancer Demo",
      note: "Upgrade a vague prompt into a precise one",
      prompt:
        "Improve this weak recruiter prompt into a precise, structured one: 'Find me some Python developers in Hyderabad who are good at data stuff and have worked at a good company for a few years.' Make it specific, include Boolean logic, define experience range, and list target companies.",
    },
  ],
  "recruiter-todo": [
    {
      title: "Daily Task Prioritizer",
      note: "AI sorts and prioritizes your day",
      prompt:
        "I have these tasks today: 12 candidate follow-ups pending, 3 offer letters to draft, 2 panel interviews to schedule, weekly report due by 5 PM, ATS data update for 8 rejections, client call at 3 PM. Prioritize my day with time blocks, urgency rationale, and what I should delegate or defer.",
    },
    {
      title: "High-Volume Recruiting Sprint",
      note: "Plan a week of bulk hiring activity",
      prompt:
        "We need to hire 40 people in 3 weeks for a BPO project. Tasks include sourcing 200 profiles, screening 80, scheduling 40 interviews, processing 40 offers, and onboarding documentation. Create a day-by-day plan with task owners, milestones, and risk checkpoints.",
    },
    {
      title: "End-of-Day Status Summary",
      note: "Generate a status update for your manager",
      prompt:
        "Today completed: screened 18 candidates, sent 5 offer letters, scheduled 8 interviews for tomorrow, updated ATS for 25 profiles. Pending: 3 client approvals for shortlists, 2 candidates awaiting document submission. Generate a concise end-of-day status update email for my manager.",
    },
  ],
  "bulk-banner-generator": [
    {
      title: "Team Onboarding Banners",
      note: "Generate banners for a new batch of joiners",
      prompt:
        "I need to create onboarding banners for 25 new joiners this month. Each banner should include their name, direct phone, work email, and company website. How do I prepare my XLSX file and use this tool to generate all banners at once?",
    },
    {
      title: "Sales Team Directory Banners",
      note: "Personalised banners for the sales floor",
      prompt:
        "Our sales team of 40 people needs LinkedIn-ready profile banners with name, mobile, email, and website. Walk me through preparing the data file and batch-generating all 40 banners in one go.",
    },
    {
      title: "Event Speaker Banners",
      note: "Speaker profile banners for a hiring event",
      prompt:
        "We have 12 speakers at our recruitment summit. I need personalised banners for each with name, phone, email, and event website. How do I set up the XLSX and generate all speaker banners quickly?",
    },
  ],
};
