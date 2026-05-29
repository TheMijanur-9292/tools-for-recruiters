"use client";

import { FormEvent, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DemoTemplate } from "@/lib/demo-templates";
import { OutputActions } from "@/components/workspaces/output-actions";

type Props = {
  moduleId: string;
  sampleInput: string;
  templates: DemoTemplate[];
};

export function AssistantPanel({ moduleId, sampleInput, templates }: Props) {
  const [input, setInput] = useState(sampleInput);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLElement>(null);

  function applyTemplate(promptText: string) {
    setInput(promptText);
  }

  async function copyOutput() {
    if (!output || !outputRef.current) return;
    const plainText = outputRef.current.innerText;
    const htmlContent = outputRef.current.innerHTML;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([htmlContent], { type: "text/html" }),
          "text/plain": new Blob([plainText], { type: "text/plain" }),
        }),
      ]);
    } catch {
      await navigator.clipboard.writeText(plainText);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, userInput: input }),
      });

      const data = (await response.json()) as { text?: string; error?: string };

      if (!response.ok || !data.text) {
        throw new Error(data.error || "Failed to generate output.");
      }

      setOutput(data.text);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-[0_10px_32px_rgba(10,20,40,0.1)]">
      <h2 className="font-display text-xl font-semibold">AI Workspace</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Paste your real scenario below and generate a draft response instantly.
      </p>

      <div className="mt-4 grid gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Demo Templates
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {templates.map((template) => (
            <button
              key={template.title}
              type="button"
              onClick={() => applyTemplate(template.prompt)}
              className="rounded-xl border border-border bg-muted-surface px-3 py-2 text-left transition hover:border-primary/40 hover:bg-background"
            >
              <p className="text-sm font-semibold text-foreground">{template.title}</p>
              <p className="text-xs text-muted-foreground">{template.note}</p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <label className="block text-sm font-medium">
          Scenario Input
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-2 h-36 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary transition focus:ring-2"
            placeholder="Describe your task, challenge, or request details"
            required
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Draft"}
        </button>
      </form>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-5 rounded-xl border border-border bg-muted-surface p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            AI Output
          </h3>
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-55"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy All"}
          </button>
        </div>
        {output ? (
          <article ref={outputRef} className="ai-output text-sm text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
          </article>
        ) : (
          <p className="text-sm text-muted-foreground">Generated output will appear here.</p>
        )}
      </div>
      {output && <OutputActions output={output} subject={`AI Output - ${moduleId}`} />}
    </section>
  );
}
