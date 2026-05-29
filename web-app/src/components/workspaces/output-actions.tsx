"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

// Strip markdown syntax to plain readable text
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, "").trim())
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/___(.+?)___/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[.*?\]\(.+?\)/g, "")
    .replace(/^[-*+]\s+/gm, "• ")
    .replace(/^>\s*/gm, "")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .trim();
}

// Convert inline markdown to HTML tags (applied to already-HTML-escaped text)
function inlineFormat(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/___(.+?)___/g, "<strong><em>$1</em></strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

// Convert full markdown string to HTML for PDF and rich-text copy
function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let inUl = false;
  let inOl = false;
  let inCodeBlock = false;
  const codeLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLines.length = 0;
      } else {
        inCodeBlock = false;
        if (inUl) { result.push("</ul>"); inUl = false; }
        if (inOl) { result.push("</ol>"); inOl = false; }
        const escaped = codeLines.join("\n")
          .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        result.push(`<pre style="background:#f5f5f5;padding:10px;border-radius:4px;font-family:monospace;white-space:pre-wrap;"><code>${escaped}</code></pre>`);
        codeLines.length = 0;
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }

    const e = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (/^### /.test(line)) {
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (inOl) { result.push("</ol>"); inOl = false; }
      result.push(`<h3 style="font-size:15px;font-weight:bold;margin:12px 0 4px;color:#1a365d;">${inlineFormat(e.slice(4))}</h3>`);
      continue;
    }
    if (/^## /.test(line)) {
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (inOl) { result.push("</ol>"); inOl = false; }
      result.push(`<h2 style="font-size:17px;font-weight:bold;margin:14px 0 6px;color:#1a365d;">${inlineFormat(e.slice(3))}</h2>`);
      continue;
    }
    if (/^# /.test(line)) {
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (inOl) { result.push("</ol>"); inOl = false; }
      result.push(`<h1 style="font-size:20px;font-weight:bold;margin:16px 0 8px;color:#1a365d;">${inlineFormat(e.slice(2))}</h1>`);
      continue;
    }
    if (/^[-*_]{3,}\s*$/.test(line)) {
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (inOl) { result.push("</ol>"); inOl = false; }
      result.push('<hr style="border:none;border-top:1px solid #ddd;margin:12px 0;">');
      continue;
    }
    if (/^[-*+]\s+/.test(line)) {
      if (inOl) { result.push("</ol>"); inOl = false; }
      if (!inUl) { result.push('<ul style="margin:8px 0;padding-left:20px;">'); inUl = true; }
      result.push(`<li style="margin:4px 0;">${inlineFormat(e.replace(/^[-*+]\s+/, ""))}</li>`);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (!inOl) { result.push('<ol style="margin:8px 0;padding-left:20px;">'); inOl = true; }
      result.push(`<li style="margin:4px 0;">${inlineFormat(e.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }
    if (inUl) { result.push("</ul>"); inUl = false; }
    if (inOl) { result.push("</ol>"); inOl = false; }
    if (/^>\s+/.test(line)) {
      result.push(`<blockquote style="border-left:3px solid #ddd;padding:4px 12px;margin:8px 0;color:#555;">${inlineFormat(e.replace(/^>\s+/, ""))}</blockquote>`);
      continue;
    }
    if (line.trim() === "") { result.push("<br>"); continue; }
    result.push(`<p style="margin:6px 0;line-height:1.6;">${inlineFormat(e)}</p>`);
  }
  if (inUl) result.push("</ul>");
  if (inOl) result.push("</ol>");
  return result.join("\n");
}

type Props = {
  output: string;
  subject?: string;
};

function GmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#EA4335"/>
    </svg>
  );
}

function ZohoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#E05A00"/>
      <text x="4" y="17" fontSize="13" fontWeight="bold" fill="white" fontFamily="Arial">Z</text>
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#E53E3E"/>
      <path d="M14 2V8H20" stroke="white" strokeWidth="1.5"/>
      <text x="6" y="17" fontSize="6" fontWeight="bold" fill="white" fontFamily="Arial">PDF</text>
    </svg>
  );
}

export function OutputActions({ output, subject = "AI Generated HR Content" }: Props) {
  const [copied, setCopied] = useState(false);

  if (!output) return null;

  const plainText = stripMarkdown(output);
  const encoded = encodeURIComponent(plainText.slice(0, 1800));
  const encodedSubject = encodeURIComponent(subject);

  async function handleCopy() {
    try {
      const htmlContent = markdownToHtml(output);
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
    setTimeout(() => setCopied(false), 1400);
  }

  function handlePdf() {
    const win = window.open("", "_blank");
    if (!win) return;
    const htmlBody = markdownToHtml(output);
    const safeSubject = subject.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    win.document.write(`<!DOCTYPE html><html><head><title>${safeSubject}</title>
      <style>body{font-family:Arial,sans-serif;padding:32px;max-width:800px;margin:0 auto;color:#111;}
      h1,h2,h3{color:#1a365d;} ul,ol{padding-left:20px;}
      code{background:#f5f5f5;padding:2px 4px;border-radius:2px;font-size:13px;}
      </style></head><body><h1 style="font-size:20px;margin-bottom:20px;">${safeSubject}</h1>${htmlBody}
      <script>window.onload=function(){window.print();}<\/script></body></html>`);
    win.document.close();
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
      <span className="text-xs font-semibold text-muted-foreground">Send or Export:</span>

      {/* Copy */}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted-surface"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* Gmail */}
      <a
        href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-300 dark:hover:bg-red-900/30"
      >
        <GmailIcon />
        Gmail
      </a>

      {/* Zoho Mail */}
      <a
        href={`https://mail.zoho.com/zm/#compose?body=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 dark:border-orange-800/40 dark:bg-orange-950/20 dark:text-orange-300 dark:hover:bg-orange-900/30"
      >
        <ZohoIcon />
        Zoho Mail
      </a>

      {/* PDF */}
      <button
        type="button"
        onClick={handlePdf}
        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-800/40 dark:bg-rose-950/20 dark:text-rose-300 dark:hover:bg-rose-900/30"
      >
        <PdfIcon />
        PDF
      </button>
    </div>
  );
}
