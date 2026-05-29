"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Image as ImageIcon, X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OutputActions } from "./output-actions";

export function ResumeScreenerWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileType, setFileType] = useState<"pdf" | "image" | "doc" | "">("");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setFileUrl(url);
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (ext === "pdf") setFileType("pdf");
    else if (["jpg", "jpeg", "png", "webp"].includes(ext)) setFileType("image");
    else setFileType("doc");

    if (ext === "txt" || ext === "md") {
      const reader = new FileReader();
      reader.onload = (e) => setResumeText(e.target?.result as string ?? "");
      reader.readAsText(f);
    }
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function clearFile() {
    setFile(null);
    setFileUrl("");
    setFileType("");
  }

  async function handleAnalyze() {
    if (!jdText.trim()) { setError("Please paste the Job Description first."); return; }
    if (!resumeText.trim() && !file) { setError("Please upload a resume or paste the resume text."); return; }
    setError("");
    setLoading(true);
    setOutput("");
    try {
      const prompt = `TASK: Analyze candidate fit for a job role.
JOB DESCRIPTION:
${jdText}

CANDIDATE RESUME:
${resumeText || `[File uploaded: ${file?.name}. Analyze based on filename and JD context.]`}

Provide:
1. **Fit Score**: X/100 with a one-line verdict (Strong/Moderate/Weak match)
2. **Strengths**: 3-4 bullet points of what matches well
3. **Gaps**: 2-3 bullet points of what's missing or weak
4. **Recommendation**: Proceed to interview / Hold / Reject — with brief reasoning
5. **Interview Focus Questions**: 3 targeted questions based on the gaps identified
Write in clear, easy English. Keep it concise and actionable.`;
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: "resume-screener", userInput: prompt }),
      });
      const data = await res.json() as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error ?? "Failed to analyze.");
      setOutput(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      {/* LEFT: Upload + JD */}
      <div className="space-y-5">
        {/* Upload area */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Upload Resume</h2>
          <p className="mt-1 text-xs text-muted-foreground">Supports PDF, DOCX, PNG, JPG</p>

          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 transition ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted-surface"
              }`}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Drop file here or click to browse</p>
                <p className="text-xs text-muted-foreground">PDF · DOCX · PNG · JPG</p>
              </div>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-muted-surface">
              <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {fileType === "image" ? <ImageIcon className="h-4 w-4 text-sky-500" /> : <FileText className="h-4 w-4 text-red-500" />}
                  {file.name}
                </div>
                <button type="button" onClick={clearFile} className="rounded-lg p-1 text-muted-foreground hover:bg-border hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Preview */}
              <div className="max-h-72 overflow-auto">
                {fileType === "pdf" && (
                  <iframe src={fileUrl} className="h-72 w-full border-0" title="Resume Preview" />
                )}
                {fileType === "image" && (
                  <img src={fileUrl} alt="Resume" className="h-72 w-full object-contain p-2" />
                )}
                {fileType === "doc" && (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                    <FileText className="h-10 w-10 text-blue-400" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs">Paste the resume text below for AI analysis</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Optional paste area */}
          <div className="mt-4">
            <label className="text-xs font-semibold text-muted-foreground">
              Paste Resume Text (for accurate AI analysis)
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="mt-1.5 h-28 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none ring-primary focus:ring-2"
              placeholder="Paste extracted resume text here..."
            />
          </div>
        </div>

        {/* JD input */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Job Description</h2>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="mt-3 h-36 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            placeholder="Paste the job description here..."
          />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : "Analyze Candidate Fit"}
          </button>
        </div>
      </div>

      {/* RIGHT: AI Output */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">AI Fit Analysis</h2>
        <p className="mt-1 text-xs text-muted-foreground">Fit score, strengths, gaps, and interview questions</p>
        <div className="mt-4 min-h-[400px] rounded-xl border border-border bg-muted-surface p-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Analyzing candidate fit...
            </div>
          ) : output ? (
            <article className="prose prose-sm max-w-none text-foreground dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </article>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <FileText className="h-8 w-8 opacity-30" />
              <p className="text-sm">Upload resume + paste JD, then click Analyze</p>
            </div>
          )}
        </div>
        {output && <OutputActions output={output} subject="Resume Screening — Candidate Fit Analysis" />}
      </div>
    </div>
  );
}
