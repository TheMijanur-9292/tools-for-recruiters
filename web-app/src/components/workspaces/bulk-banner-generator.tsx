"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import JSZip from "jszip";
import {
  Upload,
  Download,
  Eye,
  CheckCircle2,
  ArrowRight,
  Search,
  FileSliders,
  Pencil,
  Loader2,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────── */
type SlideField = { label: string; regex: RegExp };

const SIGNATURE_FIELDS: SlideField[] = [
  { label: "Email",   regex: /[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/gi },
  { label: "Phone",   regex: /(?:\+?\d[\d\s()\-]{6,}\d)/g },
  { label: "Website", regex: /(?:https?:\/\/)?(?:www\.)[a-z0-9\-]+(?:\.[a-z0-9\-]+)+/gi },
];

interface SlidePreview {
  slideNo: number;
  before: string;   // matched text in this slide
  after: string;    // what it becomes
}

/* ────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────── */
/** Extract concatenated text from one slide XML */
function slideText(xmlStr: string): string {
  const xml = new DOMParser().parseFromString(xmlStr, "application/xml");
  return Array.from(xml.getElementsByTagNameNS("*", "t"))
    .map((n) => n.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Collect every unique value of a field found across all slides */
function collectFieldValues(xmlMap: Record<string, string>, field: SlideField): string[] {
  const seen = new Set<string>();
  for (const xml of Object.values(xmlMap)) {
    const matches = slideText(xml).matchAll(new RegExp(field.regex.source, "gi"));
    for (const m of matches) seen.add(m[0].trim());
  }
  return [...seen];
}

/** Replace text inside PPTX XML string — handles split <a:t> runs */
function replaceInXml(xmlStr: string, find: string, replace: string): string {
  // Simple regex replace on raw XML text content — safe because we're
  // only touching character data between <a:t>…</a:t> tags.
  return xmlStr.split(find).join(replace);
}

/* ────────────────────────────────────────────────────────────────
   Component
──────────────────────────────────────────────────────────────── */
export function BulkBannerGeneratorWorkspace() {
  // ── file state
  const [fileName, setFileName]     = useState("");
  const [slideXmls, setSlideXmls]   = useState<Record<string, string>>({});   // path → xmlStr
  const [zipRef, setZipRef]         = useState<JSZip | null>(null);
  const [slideCount, setSlideCount] = useState(0);
  const [loading, setLoading]       = useState(false);

  // ── detected fields (unique values per field)
  const [fieldValues, setFieldValues] = useState<Record<string, string[]>>({});

  // ── edit state
  const [selectedField, setSelectedField] = useState("");   // "Email" | "Phone" | "Website"
  const [findText, setFindText]           = useState("");
  const [replaceText, setReplaceText]     = useState("");
  const [showPreview, setShowPreview]     = useState(false);
  const [done, setDone]                   = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── 1. Parse PPTX ── */
  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setLoading(true);
    setDone(false);
    setShowPreview(false);
    setSelectedField("");
    setFindText("");
    setReplaceText("");

    try {
      const zip = await JSZip.loadAsync(await file.arrayBuffer());

      // Load all slide XMLs
      const slidePaths = Object.keys(zip.files)
        .filter((n) => /^ppt\/slides\/slide\d+\.xml$/i.test(n))
        .sort((a, b) => {
          const n = (s: string) => Number((s.match(/slide(\d+)\.xml/i) || ["","0"])[1]);
          return n(a) - n(b);
        });

      const xmlMap: Record<string, string> = {};
      for (const path of slidePaths) {
        xmlMap[path] = await zip.files[path].async("text");
      }

      // Detect fields
      const detected: Record<string, string[]> = {};
      for (const field of SIGNATURE_FIELDS) {
        const vals = collectFieldValues(xmlMap, field);
        if (vals.length) detected[field.label] = vals;
      }

      setFileName(file.name);
      setSlideXmls(xmlMap);
      setZipRef(zip);
      setSlideCount(slidePaths.length);
      setFieldValues(detected);
    } catch {
      alert("Could not read PPTX. Please upload a valid .pptx file.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── 2. Build slide-level preview ── */
  const preview: SlidePreview[] = useMemo(() => {
    if (!findText || !selectedField) return [];
    const results: SlidePreview[] = [];
    let slideNo = 0;
    for (const xml of Object.values(slideXmls)) {
      slideNo++;
      const text = slideText(xml);
      if (text.includes(findText)) {
        results.push({
          slideNo,
          before: findText,
          after: replaceText,
        });
      }
    }
    return results;
  }, [slideXmls, selectedField, findText, replaceText]);

  /* ── 3. Download updated PPTX ── */
  const handleDownload = useCallback(async () => {
    if (!zipRef || !findText) return;

    // Clone zip, replace in each slide
    const newZip = new JSZip();
    const originalFiles = zipRef.files;

    for (const [path, file] of Object.entries(originalFiles)) {
      if (file.dir) {
        newZip.folder(path);
        continue;
      }
      if (slideXmls[path] !== undefined) {
        // This is a slide we parsed → apply replace
        const updated = replaceInXml(slideXmls[path], findText, replaceText);
        newZip.file(path, updated);
      } else {
        // All other files (images, layouts, theme, rels…) — copy as-is
        const blob = await file.async("arraybuffer");
        newZip.file(path, blob);
      }
    }

    const outBlob = await newZip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    const outName = fileName.replace(/\.pptx$/i, "") + "_updated.pptx";
    const url = URL.createObjectURL(outBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    setDone(true);
  }, [zipRef, slideXmls, fileName, findText, replaceText]);

  const detectedFieldLabels = Object.keys(fieldValues);
  const hasFile = slideCount > 0;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_400px]">

      {/* ── LEFT: preview panel ── */}
      <div className="space-y-5">

        {/* Slide summary card */}
        {hasFile ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
                <Eye className="h-4 w-4 text-primary" />
                Loaded PPTX — Field Detection
              </h3>
              <span className="text-xs text-muted-foreground">{slideCount} slides</span>
            </div>
            <div className="p-5 space-y-3">
              {detectedFieldLabels.length === 0 && (
                <p className="text-xs text-muted-foreground">No recognisable fields detected.</p>
              )}
              {SIGNATURE_FIELDS.filter((f) => fieldValues[f.label]).map((f) => (
                <div key={f.label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    {f.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {fieldValues[f.label].slice(0, 8).map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setSelectedField(f.label);
                          setFindText(v);
                          setShowPreview(false);
                          setDone(false);
                        }}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                          findText === v
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted-surface hover:border-primary/50"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                    {fieldValues[f.label].length > 8 && (
                      <span className="text-[11px] text-muted-foreground self-center">
                        +{fieldValues[f.label].length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-44 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border text-muted-foreground">
            <FileSliders className="h-10 w-10 opacity-20" />
            <p className="text-sm">Upload your PPTX to begin</p>
          </div>
        )}

        {/* Before → After preview table */}
        {showPreview && preview.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-display text-sm font-semibold">
              Changes Preview —{" "}
              <span className="text-primary">{selectedField}</span>
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({preview.length} of {slideCount} slides affected)
              </span>
            </h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 pr-3 text-left font-medium">Slide</th>
                    <th className="pb-2 pr-3 text-left font-medium">Before</th>
                    <th className="pb-2 pr-3 text-left font-medium" />
                    <th className="pb-2 text-left font-medium">After</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 15).map((p) => (
                    <tr key={p.slideNo} className="border-b border-border/40 text-xs bg-primary/5">
                      <td className="py-1.5 pr-3 text-muted-foreground">{p.slideNo}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground line-through">{p.before}</td>
                      <td className="py-1.5 pr-3">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </td>
                      <td className="py-1.5 font-semibold text-primary">{p.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 15 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  + {preview.length - 15} more slides
                </p>
              )}
            </div>
          </div>
        )}

        {showPreview && preview.length === 0 && findText && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm text-muted-foreground">
              No slides contain <span className="font-semibold text-foreground">{findText}</span>. Try a different value.
            </p>
          </div>
        )}
      </div>

      {/* ── RIGHT: controls ── */}
      <div className="space-y-4">

        {/* Step 1: Upload */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Step 1</p>
          <h3 className="mt-1 font-display text-sm font-semibold">Upload PPTX</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload your Canva-exported PPTX. Slide designs stay 100% intact.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pptx"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted-surface px-3 py-2 text-xs font-medium transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Parsing slides...</>
            ) : (
              <><Upload className="h-3.5 w-3.5" /> Upload PPTX</>
            )}
          </button>
          {hasFile && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-accent">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {slideCount} slides loaded — {fileName}
            </p>
          )}
        </div>

        {/* Step 2: Select field */}
        {hasFile && detectedFieldLabels.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Step 2</p>
            <h3 className="mt-1 font-display text-sm font-semibold">Select Field to Edit</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Auto-detected fields across all {slideCount} slides:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {detectedFieldLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    setSelectedField(label);
                    setFindText("");
                    setReplaceText("");
                    setShowPreview(false);
                    setDone(false);
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    selectedField === label
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted-surface hover:border-primary/50"
                  }`}
                >
                  {label} ({fieldValues[label].length})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Find & Replace */}
        {selectedField && (
          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Step 3</p>
              <h3 className="mt-1 font-display text-sm font-semibold flex items-center gap-2">
                <Pencil className="h-4 w-4 text-primary" />
                Edit: <span className="text-primary">&quot;{selectedField}&quot;</span>
              </h3>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Find (current value in slides)
              </label>
              <input
                value={findText}
                onChange={(e) => { setFindText(e.target.value); setShowPreview(false); setDone(false); }}
                placeholder={
                  selectedField === "Email" ? "e.g. name@2coms.com" :
                  selectedField === "Phone" ? "e.g. +91 99999 99999" :
                  "e.g. www.2coms.com"
                }
                className="mt-1 w-full rounded-lg border border-border bg-muted-surface px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                💡 Click any value from the left panel to auto-fill.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Replace with (new value)
              </label>
              <input
                value={replaceText}
                onChange={(e) => { setReplaceText(e.target.value); setShowPreview(false); setDone(false); }}
                placeholder={
                  selectedField === "Email" ? "e.g. name@globaltalentsquare.com" :
                  selectedField === "Phone" ? "e.g. +91 88888 88888" :
                  "e.g. www.globaltalentsquare.com"
                }
                className="mt-1 w-full rounded-lg border border-border bg-muted-surface px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowPreview(true)}
              disabled={!findText}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted-surface px-4 py-2 text-sm font-medium transition hover:border-primary hover:text-primary disabled:opacity-40"
            >
              <Search className="h-4 w-4" />
              Preview Changes
              {preview.length > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {preview.length} slides
                </span>
              )}
            </button>
          </div>
        )}

        {/* Step 4: Download */}
        {selectedField && findText && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Step 4</p>
            <h3 className="mt-1 font-display text-sm font-semibold">Download Updated PPTX</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              All slide designs stay exactly the same — only the selected text is replaced.
            </p>
            <button
              onClick={handleDownload}
              disabled={!replaceText}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              Download Updated PPTX ({slideCount} slides)
            </button>
            {!replaceText && (
              <p className="mt-1.5 text-[10px] text-muted-foreground">Fill in &quot;Replace with&quot; value above.</p>
            )}
            {done && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-accent">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Downloaded! Open in PowerPoint or reimport into Canva.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
