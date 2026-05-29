import {
  Activity,
  FileSearch,
  FileText,
  MessageSquarePlus,
  Mail,
  Send,
  IndianRupee,
  ListTodo,
  Zap,
  BookOpen,
  LayoutTemplate,
} from "lucide-react";
import { ModuleIconName } from "@/lib/modules";

type Props = {
  icon: ModuleIconName;
  className?: string;
};

export function FeatureIcon({ icon, className }: Props) {
  switch (icon) {
    case "resume":
      return <FileSearch className={className} />;
    case "jd":
      return <FileText className={className} />;
    case "interview":
      return <MessageSquarePlus className={className} />;
    case "outreach":
      return <Send className={className} />;
    case "email":
      return <Mail className={className} />;
    case "salary":
      return <IndianRupee className={className} />;
    case "todo":
      return <ListTodo className={className} />;
    case "outreach-gen":
      return <Zap className={className} />;
    case "prompt-lib":
      return <BookOpen className={className} />;
    case "banner":
      return <LayoutTemplate className={className} />;
    default:
      return <Activity className={className} />;
  }
}
