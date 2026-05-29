"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OutputActions } from "./output-actions";

type Priority = "High" | "Medium" | "Low";
type Category = "Sourcing" | "Screening" | "Interview" | "Offer" | "Onboarding" | "Admin";

interface Task {
  id: string;
  text: string;
  category: Category;
  priority: Priority;
  completed: boolean;
}

const CATEGORIES: Category[] = ["Sourcing", "Screening", "Interview", "Offer", "Onboarding", "Admin"];
const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

const PRIORITY_STYLES: Record<Priority, string> = {
  High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const CATEGORY_STYLES: Record<Category, string> = {
  Sourcing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Screening: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Interview: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Offer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Onboarding: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Admin: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const SAMPLE_TASKS: Task[] = [
  { id: "1", text: "Post JD for Senior Engineer on LinkedIn and Naukri", category: "Sourcing", priority: "High", completed: false },
  { id: "2", text: "Screen resumes for Product Manager role (target: 20)", category: "Screening", priority: "High", completed: false },
  { id: "3", text: "Schedule interviews for UX Designer shortlist (5 candidates)", category: "Interview", priority: "Medium", completed: false },
  { id: "4", text: "Send offer letter to Rahul Verma — Engineering role", category: "Offer", priority: "High", completed: true },
  { id: "5", text: "Complete BGV initiation for 3 joiners", category: "Onboarding", priority: "Medium", completed: false },
];

export function TodoListWorkspace() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [newTaskText, setNewTaskText] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Sourcing");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [filterCat, setFilterCat] = useState<Category | "All">("All");
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addTask() {
    if (!newTaskText.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      category: newCategory,
      priority: newPriority,
      completed: false,
    };
    setTasks((prev) => [task, ...prev]);
    setNewTaskText("");
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function aiPrioritize() {
    if (tasks.length === 0) { setError("Add some tasks first."); return; }
    setError("");
    setLoading(true);
    setAiOutput("");
    try {
      const pending = tasks.filter((t) => !t.completed);
      const taskList = pending.map((t, i) => `${i + 1}. [${t.priority}] [${t.category}] ${t.text}`).join("\n");
      const prompt = `I'm a recruiter. Here are my pending tasks for today:
${taskList}

Please:
1. **Re-prioritize** them with a recommended order (most important first) with brief reasoning for each
2. **Group** them by urgency: Do Now / Schedule / Delegate or Defer
3. **Time estimate** for each task (rough: 15m / 30m / 1h / 2h+)
4. **Quick win**: Which 3 tasks give the most impact if done first and why
5. **End-of-day goal**: A realistic target for what to complete today

Keep it practical and recruiter-focused.`;

      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: "recruiter-todo", userInput: prompt }),
      });
      const data = await res.json() as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error ?? "Failed to prioritize.");
      setAiOutput(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = filterCat === "All" ? tasks : tasks.filter((t) => t.category === filterCat);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="mt-6 space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Tasks", value: total, color: "text-foreground" },
          { label: "Completed", value: completed, color: "text-emerald-600" },
          { label: "Pending", value: pending, color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-surface p-4 text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Add task */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-base font-semibold">Add New Task</h2>
        <div className="mt-3 flex gap-3 flex-wrap">
          <input value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            placeholder="e.g. Source 10 profiles for Data Scientist role..." />
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2">
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <button type="button" onClick={addTask} disabled={!newTaskText.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      {/* Task list + AI panel */}
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        {/* Task list */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-display text-base font-semibold">My Recruiter Tasks</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <button type="button" onClick={() => setFilterCat("All")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${filterCat === "All" ? "bg-amber-500 text-white" : "border border-border text-muted-foreground hover:bg-muted-surface"}`}>
                All
              </button>
              {CATEGORIES.map((c) => (
                <button key={c} type="button" onClick={() => setFilterCat(c)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${filterCat === c ? "bg-amber-500 text-white" : "border border-border text-muted-foreground hover:bg-muted-surface"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No tasks yet. Add one above!</div>
            ) : filtered.map((task) => (
              <div key={task.id}
                className={`flex items-start gap-3 rounded-xl border p-3.5 transition ${task.completed ? "border-border bg-muted-surface opacity-60" : "border-border bg-background hover:border-amber-300"}`}>
                <button type="button" onClick={() => toggleTask(task.id)} className="mt-0.5 flex-shrink-0">
                  {task.completed
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    : <Circle className="h-5 w-5 text-muted-foreground hover:text-amber-500" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.text}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_STYLES[task.category]}`}>{task.category}</span>
                  </div>
                </div>
                <button type="button" onClick={() => deleteTask(task.id)} className="flex-shrink-0 text-muted-foreground hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Prioritization panel */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-base font-semibold">AI Prioritization</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Let AI analyze and prioritize your pending tasks</p>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button type="button" onClick={aiPrioritize} disabled={loading || pending === 0}
            className="mt-3 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Prioritizing...</> : `Prioritize ${pending} Pending Tasks`}
          </button>

          <div className="mt-4 min-h-[300px] max-h-[500px] overflow-y-auto rounded-xl border border-border bg-muted-surface p-3">
            {loading ? (
              <div className="flex h-32 items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your workload...
              </div>
            ) : aiOutput ? (
              <article className="prose prose-xs max-w-none text-foreground dark:prose-invert text-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiOutput}</ReactMarkdown>
              </article>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center gap-1 text-center text-muted-foreground">
                <p className="text-xs">Click above to get AI-recommended task order</p>
              </div>
            )}
          </div>
          {aiOutput && <OutputActions output={aiOutput} subject="Recruiter Task Prioritization Plan" />}
        </div>
      </div>
    </div>
  );
}
