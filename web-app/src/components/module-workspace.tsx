"use client";

import { ResumeScreenerWorkspace } from "@/components/workspaces/resume-screener";
import { InterviewKitWorkspace } from "@/components/workspaces/interview-kit";
import { JDWriterWorkspace } from "@/components/workspaces/jd-writer";
import { EmailWriterWorkspace } from "@/components/workspaces/email-writer";
import { SalaryCalculatorWorkspace } from "@/components/workspaces/salary-calculator";
import { OutreachWorkspace } from "@/components/workspaces/outreach-composer";
import { TodoListWorkspace } from "@/components/workspaces/todo-list";
import { OutreachGeneratorWorkspace } from "@/components/workspaces/outreach-generator";
import { PromptLibraryWorkspace } from "@/components/workspaces/prompt-library";
import { BulkBannerGeneratorWorkspace } from "@/components/workspaces/bulk-banner-generator";

interface ModuleWorkspaceProps {
  moduleId: string;
}

export function ModuleWorkspace({ moduleId }: ModuleWorkspaceProps) {
  switch (moduleId) {
    case "resume-screener":
      return <ResumeScreenerWorkspace />;
    case "interview-kit-generator":
      return <InterviewKitWorkspace />;
    case "jd-writer":
      return <JDWriterWorkspace />;
    case "offer-rejection-email-writer":
      return <EmailWriterWorkspace />;
    case "salary-benchmarking":
      return <SalaryCalculatorWorkspace />;
    case "candidate-outreach-composer":
      return <OutreachWorkspace />;
    case "recruiter-todo":
      return <TodoListWorkspace />;
    case "outreach-message-generator":
      return <OutreachGeneratorWorkspace />;
    case "recruiter-prompt-library":
      return <PromptLibraryWorkspace />;
    case "bulk-banner-generator":
      return <BulkBannerGeneratorWorkspace />;
    default:
      return null;
  }
}
