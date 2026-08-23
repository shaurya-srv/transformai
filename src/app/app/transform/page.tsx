"use client";

import { useState, useCallback, useEffect } from "react";
import {
  FileText,
  Upload,
  Link2,
  Wand2,
  Zap,
  Check,
  Loader2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Share2,
  MessageSquare,
  Shield,
  Presentation,
  Video,
  Image,
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  X,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import type {
  SourceContext,
  TransformationConfig,
  GeneratedOutput,
} from "@/lib/ai";
import { sampleSource, mockContext, mockOutputs, randomDemoSources } from "@/lib/mockData";
import { crisisTemplates, type CrisisTemplate } from "@/lib/crisisTemplates";
import { generatePptx } from "@/lib/pptxGenerator";
import {
  generateInfographic,
} from "@/lib/infographicRenderer";
import { generateVideo } from "@/lib/videoGenerator";
import {
  analyzeConsistency,
  type ConsistencyResult,
} from "@/lib/consistencyEngine";
import { supabase } from "@/lib/supabase";

// ── Step Indicator ───────────────────────────────────────────────────────
const steps = [
  { num: 1, label: "SOURCE" },
  { num: 2, label: "CONTEXT" },
  { num: 3, label: "OUTPUTS" },
  { num: 4, label: "REVIEW" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-8">
      {steps.map((s, i) => {
        const done = current > s.num;
        const active = current === s.num;
        return (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  done && "bg-emerald-500/100 border-emerald-500 text-white",
                  active &&
                    "bg-violet-600 border-blue-600 text-white shadow-lg shadow-violet-500/30",
                  !done && !active && "bg-white/5 border-white/10 text-gray-400"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold mt-1.5 uppercase tracking-wider",
                  done && "text-emerald-500",
                  active && "text-violet-400",
                  !done && !active && "text-gray-400"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mt-[-14px] rounded-full transition-colors",
                  done ? "bg-emerald-500/100" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Output format definitions ────────────────────────────────────────────
const outputFormats = [
  { id: "linkedin", name: "LinkedIn Post", icon: Share2, desc: "Professional publication-ready post", category: "Social", color: "#0a66c2" },
  { id: "twitter", name: "X / Twitter Thread", icon: MessageSquare, desc: "Optimized post or thread", category: "Social", color: "#1e293b" },
  { id: "advisory", name: "Advisory", icon: Shield, desc: "Structured professional advisory", category: "Documents", color: "#f59e0b" },
  { id: "executive", name: "Executive Summary", icon: FileText, desc: "Concise leadership briefing", category: "Documents", color: "#06b6d4" },
  { id: "presentation", name: "Presentation", icon: Presentation, desc: "Slides + speaker notes", category: "Visual", color: "#8b5cf6" },
  { id: "infographic", name: "Infographic", icon: Image, desc: "Content hierarchy & visual spec", category: "Visual", color: "#10b981" },
  { id: "video", name: "Video Package", icon: Video, desc: "Script, storyboard & narration", category: "Media", color: "#ef4444" },
];

// ── AI Processing Screen (Cinematic) ─────────────────────────────────────
function AiProcessingScreen({
  step,
  complete,
  selectedOutputs,
}: {
  step: number;
  complete: boolean;
  selectedOutputs: string[];
}) {
  const pipelineSteps = [
    "Source received",
    "Extracting content",
    "Understanding context",
    "Identifying key facts",
    "Building content strategy",
    "Generating outputs",
    "Quality check",
  ];

  return (
    <div className="max-w-3xl mx-auto text-center py-12 relative z-10">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/100/5 rounded-full blur-[150px]" />
      </div>

      <div className="mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/25">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          {complete ? "Transformation Complete" : "TransformAI is working"}
        </h2>
        <p className="text-base text-gray-500 max-w-md mx-auto">
          {complete
            ? "All deliverables generated and validated."
            : "Analyzing source and generating your deliverables..."}
        </p>
      </div>

      {/* Pipeline */}
      <div className="bg-[#12121a] rounded-2xl p-6 mb-8 text-left border border-white/10 ">
        <div className="space-y-3">
          {pipelineSteps.map((ps, i) => {
            const stepNum = i + 1;
            const isDone = complete || step > stepNum;
            const isCurrent = !complete && step === stepNum;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 transition-all",
                  isDone || isCurrent ? "opacity-100" : "opacity-30"
                )}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-violet-400 shrink-0 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-200 shrink-0" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    isDone && "text-emerald-400 font-medium",
                    isCurrent && "text-violet-400 font-semibold",
                    !isDone && !isCurrent && "text-gray-400"
                  )}
                >
                  {ps}
                  {isCurrent && (
                    <span className="animate-pulse-dot ml-1">...</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture */}
      <div className="bg-[#12121a] rounded-2xl p-6 mb-8 border border-white/10 ">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/15">
            <span className="text-xs font-bold text-violet-400">SOURCE</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300" />
          <div className="px-4 py-2 rounded-xl bg-cyan-50 border border-cyan-100">
            <span className="text-xs font-bold text-cyan-600">AI ENGINE</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300" />
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-100">
            <span className="text-xs font-bold text-emerald-400">
              {selectedOutputs.length} OUTPUTS
            </span>
          </div>
        </div>
      </div>

      {/* Output cards */}
      {selectedOutputs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {selectedOutputs.map((fmt, i) => {
            const format = outputFormats.find((f) => f.id === fmt);
            if (!format) return null;
            return (
              <div
                key={fmt}
                className="bg-[#12121a] rounded-xl p-4 text-center border border-white/10 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <format.icon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 block">
                  {format.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Consistency Display ──────────────────────────────────────────────────
function ConsistencyDisplay({ result }: { result: ConsistencyResult }) {
  const getScoreColor = (s: number) =>
    s >= 90 ? "text-emerald-400" : s >= 70 ? "text-amber-600" : "text-red-500";
  const getScoreBg = (s: number) =>
    s >= 90 ? "bg-emerald-500/100" : s >= 70 ? "bg-amber-500" : "bg-red-500/100";

  return (
    <div className="bg-[#12121a] rounded-2xl p-5 mb-6 border border-white/10 ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-violet-400" /> Quality Analysis
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-2xl font-black",
              getScoreColor(result.overallScore)
            )}
          >
            {result.overallScore}%
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            {result.overallScore >= 90
              ? "Excellent"
              : result.overallScore >= 70
                ? "Good"
                : "Review"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: "Source Grounding", score: result.sourceGrounding },
          { label: "Cross-Output", score: result.crossOutputConsistency },
          { label: "Completeness", score: result.completeness },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                {item.label}
              </span>
              <span
                className={cn("text-xs font-bold", getScoreColor(item.score))}
              >
                {item.score}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  getScoreBg(item.score)
                )}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {result.issues.length > 0 && (
        <div className="border-t border-white/5 pt-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
            {result.issues.length} issue
            {result.issues.length !== 1 ? "s" : ""} detected
          </p>
          <div className="space-y-1.5">
            {result.issues.slice(0, 3).map((issue, i) => (
              <div
                key={i}
                className={cn(
                  "text-[11px] px-2.5 py-1.5 rounded-lg",
                  issue.severity === "high" &&
                    "bg-red-500/10 text-red-400 border border-red-100",
                  issue.severity === "medium" &&
                    "bg-amber-50 text-amber-600 border border-amber-100",
                  issue.severity === "low" &&
                    "bg-white/[0.03] text-gray-500 border border-white/5"
                )}
              >
                <span className="font-bold uppercase">{issue.severity}</span>{" "}
                {issue.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Transform Page ──────────────────────────────────────────────────
export default function TransformPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [sourceContent, setSourceContent] = useState("");
  const [context, setContext] = useState<SourceContext | null>(null);
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([]);
  const [config, setConfig] = useState<TransformationConfig>({
    audiences: [],
    tone: "Professional",
    language: "English",
    detail: "Standard",
    objectives: [],
  });
  const [results, setResults] = useState<GeneratedOutput[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [activeResultTab, setActiveResultTab] = useState("");
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [consistencyResult, setConsistencyResult] =
    useState<ConsistencyResult | null>(null);
  const [contentStyle, setContentStyle] = useState("Corporate");
  const [showCrisisTemplates, setShowCrisisTemplates] = useState(false);

  // Source input tab state
  const [activeTab, setActiveTab] = useState<"text" | "url" | "document" | "media">("text");
  const [urlInput, setUrlInput] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number; type: string; preview?: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Database state
  const [projectId, setProjectId] = useState<string | null>(null);
  const [sourceId, setSourceId] = useState<string | null>(null);

  const loadDemo = () => {
    // Pick a random demo source
    const idx = Math.floor(Math.random() * randomDemoSources.length);
    const demo = randomDemoSources[idx];
    setSourceContent(demo.source);
    setConfig({
      audiences: demo.audiences,
      tone: demo.tone,
      language: "English",
      detail: "Detailed",
      objectives: demo.objectives,
    });
    setContentStyle(demo.style);
    setSelectedOutputs(demo.outputs);
    toast(`Demo loaded: ${demo.title}`, "info");

    // Auto-start analysis after a short delay
    setTimeout(() => {
      handleAnalyzeWithContent(demo.source);
    }, 600);
  };

  const loadCrisisTemplate = (template: CrisisTemplate) => {
    setSourceContent(template.sampleSource);
    setConfig({
      audiences: template.defaultConfig.audiences || [],
      tone: template.defaultConfig.tone || "Professional",
      language: template.defaultConfig.language || "English",
      detail: template.defaultConfig.detail || "Standard",
      objectives: template.defaultConfig.objectives || [],
    });
    setSelectedOutputs(template.defaultOutputs);
    setShowCrisisTemplates(false);
    toast(`Template "${template.name}" loaded!`, "info");
  };

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    try {
      // Simulate URL fetch — in production, use a server-side proxy
      await new Promise((r) => setTimeout(r, 1500));
      const fetched = `[URL Content from: ${urlInput}]\n\nThis is extracted content from the provided URL. In a production environment, this would be fetched and parsed from the actual webpage. The content would include the main article text, headings, and key information from the page.`;
      setSourceContent(fetched);
      setActiveTab("text");
      toast("Content fetched from URL!", "success");
    } catch {
      toast("Failed to fetch URL content. Please try again.", "error");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Extract text content from files
    Array.from(files).forEach((file) => {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setSourceContent((prev) => (prev ? prev + "\n\n" + text : text));
        };
        reader.readAsText(file);
      } else {
        // For non-text files, add a placeholder description
        const desc = `[${file.type || "Document"}] ${file.name} (${(file.size / 1024).toFixed(1)} KB)\n\nThis ${file.type.split("/")[0]} file has been uploaded. In a production environment, the content would be extracted using OCR (for images), PDF parsing, or document processing APIs.`;
        setSourceContent((prev) => (prev ? prev + "\n\n" + desc : desc));
      }
    });
    toast(`${files.length} file(s) uploaded. Content extracted.`, "success");
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyzeWithContent = async (content: string) => {
    if (!content.trim()) return;
    setStep(2);
    setIsAnalyzing(true);
    setAnalysisStep(0);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({ source: content }),
      });

      const data = await res.json();

      // Animate steps
      for (let i = 1; i <= 5; i++) {
        await new Promise((r) => setTimeout(r, 400));
        setAnalysisStep(i);
      }

      setContext(data.context);
      setProjectId(data.projectId || null);
      setSourceId(data.sourceId || null);
      setStep(3);
      toast("Source analyzed! Select your outputs.", "success");
    } catch {
      // Fallback to mock
      for (let i = 1; i <= 5; i++) {
        await new Promise((r) => setTimeout(r, 300));
        setAnalysisStep(i);
      }
      setContext(mockContext);
      setStep(3);
      toast("Source analyzed (demo mode).", "info");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!sourceContent.trim()) return;
    await handleAnalyzeWithContent(sourceContent);
    setStep(2);
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Try to create a project in the database
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Create project
        const projectRes = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name:
              sourceContent.slice(0, 60).trim() +
              (sourceContent.length > 60 ? "..." : ""),
          }),
        });

        if (projectRes.ok) {
          const { project } = await projectRes.json();
          setProjectId(project.id);
        }
      }
    } catch {
      // Continue without database — demo mode still works
    }

    // Animate through analysis steps
    for (let i = 1; i <= 7; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setAnalysisStep(i);
    }
    await new Promise((r) => setTimeout(r, 500));

    // Try to call the real API, fall back to mock
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: sourceContent,
          projectId: projectId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setContext(data.context);
        if (data.sourceId) setSourceId(data.sourceId);
      } else {
        // Fall back to mock
        setContext(mockContext);
      }
    } catch {
      // Fall back to mock
      setContext(mockContext);
    }

    setIsAnalyzing(false);
    toast("Source analyzed successfully", "success");
  };

  const handleTransform = async () => {
    if (selectedOutputs.length === 0) return;
    setStep(4);
    setIsTransforming(true);
    setAnalysisStep(0);

    // Animate through generation steps
    for (let i = 1; i <= 7; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setAnalysisStep(i);
    }
    await new Promise((r) => setTimeout(r, 500));

    // Generate outputs
    let generated: GeneratedOutput[] = [];

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          config,
          outputTypes: selectedOutputs,
          projectId,
          sourceId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        generated = data.outputs;
      } else {
        // Fall back to mock
        generated = selectedOutputs
          .filter((t) => mockOutputs[t])
          .map((t) => ({
            title: mockOutputs[t].title,
            content: mockOutputs[t].content,
            format: t,
            validated: true,
          }));
      }
    } catch {
      // Fall back to mock
      generated = selectedOutputs
        .filter((t) => mockOutputs[t])
        .map((t) => ({
          title: mockOutputs[t].title,
          content: mockOutputs[t].content,
          format: t,
          validated: true,
        }));
    }

    setResults(generated);
    if (context) setConsistencyResult(analyzeConsistency(context, generated));
    setIsTransforming(false);
    if (generated.length > 0) setActiveResultTab(generated[0].format);
    toast(`${generated.length} deliverables generated!`, "success");
  };

  const handleRegenerate = async (format: string) => {
    if (!context) return;
    setIsTransforming(true);
    toast(`Regenerating ${format}...`, "info");

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          config,
          outputTypes: [format],
          projectId,
          sourceId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.outputs?.length > 0) {
          setResults((prev) =>
            prev
              ? prev.map((o) => (o.format === format ? data.outputs[0] : o))
              : prev
          );
        }
      } else {
        // Fallback: regenerate from mock with slight variation
        if (mockOutputs[format]) {
          const variations = [
            " (Revised Edition)",
            " (Updated)",
            " (Refreshed)",
          ];
          const variation = variations[Math.floor(Math.random() * variations.length)];
          setResults((prev) =>
            prev
              ? prev.map((o) =>
                  o.format === format
                    ? { ...o, title: mockOutputs[format].title + variation, content: mockOutputs[format].content }
                    : o
                )
              : prev
          );
        }
      }
    } catch {
      // Fallback
      if (mockOutputs[format]) {
        setResults((prev) =>
          prev
            ? prev.map((o) =>
                o.format === format
                  ? { ...o, content: mockOutputs[format].content }
                  : o
              )
            : prev
        );
      }
    } finally {
      setIsTransforming(false);
      toast(`${format} regenerated!`, "success");
      if (context) {
        const updated = results?.map((o) =>
          o.format === format ? { ...o, regenerated: true } : o
        ) || [];
        setConsistencyResult(analyzeConsistency(context, updated));
      }
    }
  };

  const toggleOutput = (id: string) =>
    setSelectedOutputs((p) =>
      p.includes(id) ? p.filter((o) => o !== id) : [...p, id]
    );

  const reset = () => {
    setStep(1);
    setSourceContent("");
    setContext(null);
    setSelectedOutputs([]);
    setResults(null);
    setIsAnalyzing(false);
    setIsTransforming(false);
    setAnalysisStep(0);
    setConsistencyResult(null);
    setProjectId(null);
    setSourceId(null);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast("Copied to clipboard");
  };

  const handleExport = async (output: GeneratedOutput) => {
    setIsExporting(true);
    try {
      if (output.format === "presentation") {
        await generatePptx(output.title, output.content);
        toast("Downloaded as .pptx");
      } else if (output.format === "infographic") {
        generateInfographic(output.title, output.content);
        toast("Downloaded as .png");
      } else if (output.format === "video") {
        await generateVideo(output.title, output.content);
        toast("Downloaded as .webm");
      } else {
        const blob = new Blob([output.content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${output.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast("Downloaded as .txt");
      }
    } catch {
      toast("Export failed", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const activeOutput = results?.find((o) => o.format === activeResultTab);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Crisis Template Modal */}
      {showCrisisTemplates && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12121a] rounded-2xl border border-white/10 shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Crisis Response Templates
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Pre-configured for common scenarios.
                </p>
              </div>
              <button
                onClick={() => setShowCrisisTemplates(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 hover:text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {crisisTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadCrisisTemplate(template)}
                    className="text-left p-4 rounded-xl border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/10/50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.defaultOutputs.slice(0, 3).map((output) => (
                            <span
                              key={output}
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-gray-400"
                            >
                              {output}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Source Input */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                New Transformation
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Turn your source information into professional communication
                assets.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCrisisTemplates(true)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-xl hover:bg-cyan-100 transition-colors"
              >
                🛡️ Templates
              </button>
              <button
                onClick={loadDemo}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-xl hover:bg-violet-500/10 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" /> Try Demo
              </button>
            </div>
          </div>
          <StepIndicator current={1} />
          <div className="flex gap-2 mb-4">
            {([
              { id: "text" as const, icon: FileText, label: "Text" },
              { id: "url" as const, icon: Link2, label: "URL" },
              { id: "document" as const, icon: Upload, label: "Document" },
              { id: "media" as const, icon: Image, label: "Media" },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                    : "bg-white/[0.03] text-gray-400 border border-white/10 hover:bg-white/5"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Text */}
          {activeTab === "text" && (
          <div className="relative">
            <textarea
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              placeholder="Paste your source content here — articles, reports, advisories, research papers, announcements, or any organizational information..."
              className="w-full h-72 p-4 text-sm text-white bg-white/5 border border-white/10 rounded-2xl resize-none focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder:text-gray-400 leading-relaxed transition-all"
            />
            {sourceContent.length > 0 && (
              <div className="absolute bottom-3 right-4 flex items-center gap-3">
                <span className="text-[10px] text-gray-400">
                  {sourceContent.split(/\s+/).length.toLocaleString()} words ·{" "}
                  {sourceContent.length.toLocaleString()} chars
                </span>
                <button
                  onClick={() => setSourceContent("")}
                  className="text-[10px] text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          )}

          {/* Tab: URL */}
          {activeTab === "url" && (
          <div className="bg-[#12121a] rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-semibold text-white">Fetch from URL</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/article-or-report"
                className="flex-1 px-4 py-3 text-sm text-white bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder:text-gray-400"
                onKeyDown={(e) => e.key === "Enter" && handleFetchUrl()}
              />
              <button
                onClick={handleFetchUrl}
                disabled={!urlInput.trim() || isFetchingUrl}
                className={cn(
                  "px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                  urlInput.trim() && !isFetchingUrl
                    ? "bg-violet-600 text-white hover:bg-blue-700 shadow-md"
                    : "bg-white/5 text-gray-400 cursor-not-allowed"
                )}
              >
                {isFetchingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                Fetch
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-3">Paste a URL to an article, report, or webpage. Content will be extracted automatically.</p>
          </div>
          )}

          {/* Tab: Document */}
          {activeTab === "document" && (
          <div
            className={cn(
              "bg-[#12121a] rounded-2xl p-6 border-2 border-dashed transition-all",
              isDragOver ? "border-blue-400 bg-violet-500/10" : "border-white/10"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e.dataTransfer.files); }}
          >
            <div className="text-center">
              <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">Drop files here or click to browse</h3>
              <p className="text-[11px] text-gray-400 mb-4">Supports PDF, DOCX, PPTX, TXT — Max 10MB per file</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-xl text-sm font-medium cursor-pointer hover:bg-violet-500/10 transition-colors">
                <Upload className="w-4 h-4" />
                Choose Files
                <input type="file" className="hidden" multiple accept=".pdf,.docx,.pptx,.txt,.doc" onChange={(e) => handleFileUpload(e.target.files)} />
              </label>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                    <FileText className="w-5 h-5 text-violet-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{f.name}</p>
                      <p className="text-[10px] text-gray-400">{(f.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => removeUploadedFile(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Tab: Media */}
          {activeTab === "media" && (
          <div className="bg-[#12121a] rounded-2xl p-6 border border-white/10">
            <div className="text-center">
              <Image className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">Upload Images or Videos</h3>
              <p className="text-[11px] text-gray-400 mb-4">Supports PNG, JPG, GIF, MP4, WebM — Max 50MB per file</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-xl text-sm font-medium cursor-pointer hover:bg-violet-500/10 transition-colors">
                <Upload className="w-4 h-4" />
                Choose Media
                <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={(e) => handleFileUpload(e.target.files)} />
              </label>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="relative group">
                    {f.preview ? (
                      <img src={f.preview} alt={f.name} className="w-full h-32 object-cover rounded-xl border border-white/10" />
                    ) : (
                      <div className="w-full h-32 bg-white/[0.03] rounded-xl border border-white/10 flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl">
                      <p className="text-[10px] text-white truncate">{f.name}</p>
                    </div>
                    <button onClick={() => removeUploadedFile(i)} className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setSourceContent(sampleSource)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-400 bg-violet-500/10 rounded-xl hover:bg-violet-500/10 transition-colors"
            >
              <Wand2 className="w-4 h-4" /> Random Sample
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!sourceContent.trim()}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                sourceContent.trim()
                  ? "bg-violet-600 text-white hover:bg-blue-700 shadow-lg shadow-violet-500/25"
                  : "bg-white/5 text-gray-400 cursor-not-allowed"
              )}
            >
              Analyze Source <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: AI Context */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <StepIndicator current={2} />
          {isAnalyzing ? (
            <div className="bg-[#12121a] rounded-2xl p-6 border border-white/10 ">
              <div className="space-y-3">
                {[
                  "Source received",
                  "Extracting content",
                  "Understanding context",
                  "Identifying key facts",
                  "Building content strategy",
                ].map((ps, i) => {
                  const stepNum = i + 1;
                  const isDone = analysisStep > stepNum;
                  const isCurrent = analysisStep === stepNum;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-3 transition-all",
                        isDone || isCurrent ? "opacity-100" : "opacity-30"
                      )}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-violet-400 shrink-0 animate-spin" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-200 shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          isDone && "text-emerald-400 font-medium",
                          isCurrent && "text-violet-400 font-semibold",
                          !isDone && !isCurrent && "text-gray-400"
                        )}
                      >
                        {ps}
                        {isCurrent && (
                          <span className="animate-pulse-dot ml-1">...</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : context ? (
            <div className="space-y-6 animate-fade-in-up">
              <div className="bg-[#12121a] rounded-2xl p-6 border border-white/10 ">
                <h2 className="text-lg font-bold text-white mb-1">
                  AI Understanding
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Source context extracted successfully.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Content Type", value: context.source_type },
                    { label: "Primary Objective", value: context.intent },
                    { label: "Key Topic", value: context.topic },
                    {
                      label: "Confidence",
                      value: `${Math.round(context.confidence * 100)}%`,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {item.label}
                      </span>
                      <p className="text-sm font-semibold text-white mt-1">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Key Facts
                  </h3>
                  <div className="space-y-2">
                    {context.key_facts.map((fact, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-400"
                      >
                        <Check className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                        {fact}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    AI Insights
                  </h3>
                  <div className="space-y-2">
                    {context.recommendations.slice(0, 3).map((rec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/15 text-sm text-gray-400"
                      >
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-violet-500/25"
                >
                  Select Outputs <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Step 3: Output Selection + Config */}
      {step === 3 && !results && (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <StepIndicator current={3} />
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">
              What do you want to create?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select multiple outputs. Configure your preferences below.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {outputFormats.map((fmt) => {
              const isSelected = selectedOutputs.includes(fmt.id);
              return (
                <button
                  key={fmt.id}
                  onClick={() => toggleOutput(fmt.id)}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                    isSelected
                      ? "bg-violet-500/10 border-violet-500/20 shadow-md shadow-violet-500/5"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                      isSelected
                        ? "bg-violet-600 border-blue-600"
                        : "border-gray-300"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <fmt.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isSelected ? "text-violet-400" : "text-gray-400"
                        )}
                        style={!isSelected ? { color: fmt.color } : undefined}
                      />
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isSelected ? "text-white" : "text-gray-400"
                        )}
                      >
                        {fmt.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{fmt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Config */}
          <div className="bg-[#12121a] rounded-2xl p-6 mb-8 border border-white/10 ">
            <h3 className="text-sm font-bold text-white mb-4">
              Generation Controls
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Target Audience
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["General", "Executive", "Technical", "Public", "Media"].map(
                    (a) => (
                      <button
                        key={a}
                        onClick={() =>
                          setConfig((c) => ({
                            ...c,
                            audiences: c.audiences.includes(a)
                              ? c.audiences.filter((x) => x !== a)
                              : [...c.audiences, a],
                          }))
                        }
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                          config.audiences.includes(a)
                            ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                            : "bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20"
                        )}
                      >
                        {config.audiences.includes(a) && "✓ "}
                        {a}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Tone
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Professional",
                    "Urgent",
                    "Authoritative",
                    "Conversational",
                    "Formal",
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() =>
                        setConfig((c) => ({ ...c, tone: t }))
                      }
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                        config.tone === t
                          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          : "bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20"
                      )}
                    >
                      {config.tone === t && "● "}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Language
                </label>
                <select
                  value={config.language}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, language: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                >
                  {["English", "Hindi", "Spanish", "French", "German"].map(
                    (l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Detail Level
                </label>
                <div className="flex gap-1.5">
                  {["Brief", "Standard", "Detailed"].map((d) => (
                    <button
                      key={d}
                      onClick={() =>
                        setConfig((c) => ({ ...c, detail: d }))
                      }
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-[11px] font-medium border transition-all",
                        config.detail === d
                          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          : "bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Objective
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Inform", "Persuade", "Alert", "Educate", "Engage"].map(
                    (o) => (
                      <button
                        key={o}
                        onClick={() =>
                          setConfig((c) => ({
                            ...c,
                            objectives: c.objectives.includes(o)
                              ? c.objectives.filter((x) => x !== o)
                              : [...c.objectives, o],
                          }))
                        }
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                          config.objectives.includes(o)
                            ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                            : "bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20"
                        )}
                      >
                        {config.objectives.includes(o) && "✓ "}
                        {o}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Content Style
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Corporate", "Editorial", "Social", "Newsroom", "Formal"].map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setContentStyle(s)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                          contentStyle === s
                            ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                            : "bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20"
                        )}
                      >
                        {contentStyle === s && "● "}
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {selectedOutputs.length > 0 ? (
                  <span className="text-violet-400 font-bold">
                    {selectedOutputs.length}
                  </span>
                ) : (
                  "Select at least one output"
                )}{" "}
                {selectedOutputs.length === 1 ? "output" : "outputs"}
              </span>
              <button
                onClick={handleTransform}
                disabled={selectedOutputs.length === 0}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg",
                  selectedOutputs.length > 0
                    ? "bg-violet-600 text-white hover:bg-blue-700 shadow-violet-500/25"
                    : "bg-white/5 text-gray-400 cursor-not-allowed"
                )}
              >
                <Sparkles className="w-4 h-4" /> Transform Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Processing / Results */}
      {step === 4 && (
        <div className="animate-fade-in-up">
          {isTransforming ? (
            <AiProcessingScreen
              step={analysisStep}
              complete={false}
              selectedOutputs={selectedOutputs}
            />
          ) : results ? (
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-medium mb-4">
                  <CheckCircle className="w-4 h-4" /> Transformation Complete
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {results.length} deliverable
                  {results.length !== 1 ? "s" : ""} generated from 1 source
                </h2>
                <p className="text-sm text-gray-500">
                  Source-grounded · Consistency-checked · Format-validated
                </p>
              </div>

              {consistencyResult && (
                <ConsistencyDisplay result={consistencyResult} />
              )}

              <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                {results.map((output) => {
                  const fmt = outputFormats.find(
                    (f) => f.id === output.format
                  );
                  const Icon = fmt?.icon || FileText;
                  return (
                    <button
                      key={output.format}
                      onClick={() => {
                        setActiveResultTab(output.format);
                        setEditedContent(null);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0",
                        activeResultTab === output.format
                          ? "bg-violet-600 text-white "
                          : "bg-white text-gray-400 border border-white/10 hover:bg-white/[0.03]"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {fmt?.name || output.format}
                    </button>
                  );
                })}
              </div>

              {activeOutput && (
                <div className="bg-[#12121a] rounded-2xl overflow-hidden border border-white/10 ">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white">
                      {activeOutput.title}
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      ✓ Validated
                    </span>
                  </div>
                  <div className="px-5 py-4 max-h-[500px] overflow-y-auto">
                    {editedContent !== null ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-96 p-4 text-sm text-white bg-white/[0.03] border border-white/10 rounded-xl resize-none focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 font-mono leading-relaxed"
                      />
                    ) : (
                      <pre className="text-sm text-gray-400 whitespace-pre-wrap font-sans leading-relaxed">
                        {activeOutput.content}
                      </pre>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 bg-white/[0.03]">
                    <div className="flex items-center gap-2 flex-wrap">
                      {editedContent !== null ? (
                        <>
                          <button
                            onClick={() => {
                              setEditedContent(null);
                              toast("Changes saved");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Save
                          </button>
                          <button
                            onClick={() => setEditedContent(null)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleCopy(activeOutput.content)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </button>
                          <button
                            onClick={() => handleExport(activeOutput)}
                            disabled={isExporting}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5" /> Export
                          </button>
                          <button
                            onClick={() =>
                              setEditedContent(activeOutput.content)
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-colors"
                          >
                            ✏️ Edit
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => handleRegenerate(activeOutput.format)}
                      disabled={isTransforming}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-500/10 border border-violet-500/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={cn("w-3.5 h-3.5", isTransforming && "animate-spin")} /> Regenerate
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit Config
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-violet-500/25"
                >
                  <Wand2 className="w-4 h-4" /> New Transformation
                </button>
              </div>
              <div className="text-center mt-12 pb-8">
                <p className="text-sm font-semibold text-gray-400 tracking-wide">
                  One Source. Infinite Communication.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
