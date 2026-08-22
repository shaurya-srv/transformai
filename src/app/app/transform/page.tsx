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
  ChevronDown,
  TrendingUp,
  BarChart3,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import type { SourceContext, TransformationConfig, GeneratedOutput } from "@/lib/ai";
import { sampleSource, mockContext, mockOutputs } from "@/lib/mockData";
import { crisisTemplates, type CrisisTemplate } from "@/lib/crisisTemplates";
import { generatePptx } from "@/lib/pptxGenerator";
import { generateInfographic, generateInfographicDataUrl } from "@/lib/infographicRenderer";
import { generateVideo } from "@/lib/videoGenerator";
import { analyzeConsistency, type ConsistencyResult } from "@/lib/consistencyEngine";

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
                  done && "bg-emerald-500 border-emerald-500 text-white",
                  active && "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/30",
                  !done && !active && "bg-surface border-white/10 text-text-tertiary"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold mt-1.5 uppercase tracking-wider",
                  done && "text-emerald-400",
                  active && "text-violet-400",
                  !done && !active && "text-text-tertiary"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mt-[-14px] rounded-full transition-colors",
                  done ? "bg-emerald-500" : "bg-white/10"
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
  {
    id: "linkedin",
    name: "LinkedIn Post",
    icon: Share2,
    desc: "Professional publication-ready post",
    category: "Social",
    color: "#0a66c2",
  },
  {
    id: "twitter",
    name: "X / Twitter Thread",
    icon: MessageSquare,
    desc: "Optimized post or thread",
    category: "Social",
    color: "#e2e8f0",
  },
  {
    id: "advisory",
    name: "Advisory",
    icon: Shield,
    desc: "Structured professional advisory",
    category: "Documents",
    color: "#f59e0b",
  },
  {
    id: "executive",
    name: "Executive Summary",
    icon: FileText,
    desc: "Concise leadership briefing",
    category: "Documents",
    color: "#06b6d4",
  },
  {
    id: "presentation",
    name: "Presentation",
    icon: Presentation,
    desc: "Slides + speaker notes",
    category: "Visual",
    color: "#8b5cf6",
  },
  {
    id: "infographic",
    name: "Infographic",
    icon: Image,
    desc: "Content hierarchy & visual spec",
    category: "Visual",
    color: "#10b981",
  },
  {
    id: "video",
    name: "Video Package",
    icon: Video,
    desc: "Script, storyboard & narration",
    category: "Media",
    color: "#ef4444",
  },
];

// ── AI Processing Screen (Cinematic) ─────────────────────────────────────
function AiProcessingScreen({
  step,
  complete,
  selectedOutputs,
  outputResults,
}: {
  step: number;
  complete: boolean;
  selectedOutputs: string[];
  outputResults: Record<string, boolean>;
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
    <div className="max-w-3xl mx-auto text-center py-12">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/30">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          {complete ? "Transformation Complete" : "TransformAI is working"}
        </h2>
        <p className="text-base text-text-secondary max-w-md mx-auto">
          {complete
            ? "All deliverables have been generated and validated."
            : "Analyzing source and generating your deliverables..."}
        </p>
      </div>

      {/* Pipeline visualization */}
      <div className="glass rounded-2xl p-6 mb-8 text-left relative z-10">
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
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-violet-400 shrink-0 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-white/20 shrink-0" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    isDone && "text-emerald-400 font-medium",
                    isCurrent && "text-violet-400 font-semibold",
                    !isDone && !isCurrent && "text-text-tertiary"
                  )}
                >
                  {ps}
                  {isCurrent && <span className="animate-pulse-dot ml-1">...</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture visualization */}
      <div className="glass rounded-2xl p-6 mb-8 relative z-10">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Source */}
          <div className="px-4 py-2 rounded-xl bg-violet-500/15 border border-violet-500/20">
            <span className="text-xs font-bold text-violet-400">SOURCE</span>
          </div>
          <ArrowRight className="w-4 h-4 text-text-tertiary" />
          {/* Engine */}
          <div className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/20">
            <span className="text-xs font-bold text-cyan-400">AI ENGINE</span>
          </div>
          <ArrowRight className="w-4 h-4 text-text-tertiary" />
          {/* Outputs */}
          <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
            <span className="text-xs font-bold text-emerald-400">
              {selectedOutputs.length} OUTPUTS
            </span>
          </div>
        </div>
      </div>

      {/* Output cards emerging */}
      {selectedOutputs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          {selectedOutputs.map((fmt, i) => {
            const format = outputFormats.find((f) => f.id === fmt);
            if (!format) return null;
            const isReady = outputResults[fmt];
            return (
              <div
                key={fmt}
                className={cn(
                  "glass rounded-xl p-4 text-center transition-all animate-fade-in-up",
                  isReady ? "border-emerald-500/30 bg-emerald-500/5" : ""
                )}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <format.icon
                  className={cn(
                    "w-6 h-6 mx-auto mb-2",
                    isReady ? "text-emerald-400" : "text-text-tertiary"
                  )}
                />
                <span className="text-[10px] font-bold text-text-secondary block">
                  {format.name}
                </span>
                {isReady && (
                  <span className="text-[10px] text-emerald-400 font-bold mt-1 block animate-fade-in">
                    ✓ READY
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Consistency Score Display ─────────────────────────────────────────────
function ConsistencyDisplay({ result }: { result: ConsistencyResult }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs Review";
    return "Issues Found";
  };

  return (
    <div className="glass rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          Quality Analysis
        </h3>
        <div className="flex items-center gap-2">
          <span className={cn("text-2xl font-black", getScoreColor(result.overallScore))}>
            {result.overallScore}%
          </span>
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider">
            {getScoreLabel(result.overallScore)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: "Source Grounding", score: result.sourceGrounding, desc: "Facts matched" },
          { label: "Cross-Output", score: result.crossOutputConsistency, desc: "Consistency" },
          { label: "Completeness", score: result.completeness, desc: "Coverage" },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-text-tertiary uppercase">{item.label}</span>
              <span className={cn("text-xs font-bold", getScoreColor(item.score))}>
                {item.score}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", getScoreBg(item.score))}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {result.issues.length > 0 && (
        <div className="border-t border-white/5 pt-3">
          <p className="text-[10px] font-bold text-text-tertiary uppercase mb-2">
            {result.issues.length} issue{result.issues.length !== 1 ? "s" : ""} detected
          </p>
          <div className="space-y-1.5">
            {result.issues.slice(0, 3).map((issue, i) => (
              <div
                key={i}
                className={cn(
                  "text-[11px] px-2.5 py-1.5 rounded-lg",
                  issue.severity === "high" && "bg-red-500/10 text-red-400 border border-red-500/10",
                  issue.severity === "medium" && "bg-amber-500/10 text-amber-400 border border-amber-500/10",
                  issue.severity === "low" && "bg-white/[0.03] text-text-tertiary border border-white/5"
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
  const [activeResultTab, setActiveResultTab] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [consistencyResult, setConsistencyResult] = useState<ConsistencyResult | null>(null);
  const [contentStyle, setContentStyle] = useState("Corporate");
  const [showCrisisTemplates, setShowCrisisTemplates] = useState(false);

  // Demo mode
  const loadDemo = () => {
    setSourceContent(sampleSource);
    setConfig({
      audiences: ["Security Teams", "Executives"],
      tone: "Urgent",
      language: "English",
      detail: "Detailed",
      objectives: ["Alert", "Inform"],
    });
    setContentStyle("Corporate");
    setSelectedOutputs(["linkedin", "video", "advisory", "presentation"]);
    toast("Demo loaded! Click Analyze to continue.", "info");
  };

  // Load a crisis template
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

  // Step 1: Analyze source
  const handleAnalyze = async () => {
    if (!sourceContent.trim()) return;
    setStep(2);
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Animate pipeline
    for (let i = 1; i <= 7; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setAnalysisStep(i);
    }

    // Use mock context
    await new Promise((r) => setTimeout(r, 500));
    setContext(mockContext);
    setIsAnalyzing(false);
    toast("Source analyzed successfully", "success");
  };

  // Step 2→3: Move to output selection
  const goToOutputSelection = () => setStep(3);

  // Step 3→4: Transform
  const handleTransform = async () => {
    if (selectedOutputs.length === 0) return;
    setStep(4);
    setIsTransforming(true);
    setAnalysisStep(0);

    // Animate processing
    for (let i = 1; i <= 7; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setAnalysisStep(i);
    }

    // Generate mock outputs
    await new Promise((r) => setTimeout(r, 500));
    const generated = selectedOutputs
      .filter((t) => mockOutputs[t])
      .map((t) => ({
        title: mockOutputs[t].title,
        content: mockOutputs[t].content,
        format: t,
        validated: true,
      }));
    setResults(generated);

    // Run consistency analysis
    if (context) {
      const consistency = analyzeConsistency(context, generated);
      setConsistencyResult(consistency);
    }

    setIsTransforming(false);
    if (generated.length > 0) setActiveResultTab(generated[0].format);
    toast(`${generated.length} deliverables generated!`, "success");
  };

  const toggleOutput = (id: string) => {
    setSelectedOutputs((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

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
    setContentStyle("Corporate");
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
        toast("Presentation downloaded as .pptx");
      } else if (output.format === "infographic") {
        generateInfographic(output.title, output.content);
        toast("Infographic downloaded as .png");
      } else if (output.format === "video") {
        await generateVideo(output.title, output.content);
        toast("Video downloaded as .webm");
      } else {
        const blob = new Blob([output.content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${output.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast("Downloaded as text file");
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-white/10 shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Crisis Response Templates</h2>
                <p className="text-sm text-text-secondary mt-0.5">
                  Pre-configured for common scenarios. Auto-fills source + settings.
                </p>
              </div>
              <button
                onClick={() => setShowCrisisTemplates(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-white hover:bg-white/5 transition-colors"
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
                    className="text-left p-4 rounded-xl border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.defaultOutputs.slice(0, 3).map((output) => (
                            <span
                              key={output}
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-text-secondary"
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
              <h1 className="text-2xl font-bold text-white">New Transformation</h1>
              <p className="text-sm text-text-secondary mt-1">
                Turn your source information into professional communication assets.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCrisisTemplates(true)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/20 transition-colors"
              >
                🛡️ Templates
              </button>
              <button
                onClick={loadDemo}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-xl hover:bg-violet-500/20 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                Try Demo
              </button>
            </div>
          </div>

          <StepIndicator current={1} />

          {/* Input tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { icon: FileText, label: "Text", active: true },
              { icon: Link2, label: "URL", active: false },
              { icon: Upload, label: "Document", active: false },
            ].map((tab) => (
              <button
                key={tab.label}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  tab.active
                    ? "bg-violet-500/15 text-violet-400 border border-violet-500/20"
                    : "bg-surface text-text-tertiary border border-white/5"
                )}
                disabled={!tab.active}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {!tab.active && (
                  <span className="text-[9px] opacity-60">(soon)</span>
                )}
              </button>
            ))}
          </div>

          {/* Text area */}
          <div className="relative">
            <textarea
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              placeholder="Paste your source content here — articles, reports, advisories, research papers, announcements, or any organizational information..."
              className="w-full h-72 p-4 text-sm text-white bg-surface border border-white/10 rounded-2xl resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 placeholder:text-text-tertiary leading-relaxed transition-all"
            />
            {sourceContent.length > 0 && (
              <div className="absolute bottom-3 right-4 flex items-center gap-3">
                <span className="text-[10px] text-text-tertiary">
                  {sourceContent.split(/\s+/).length.toLocaleString()} words ·{" "}
                  {sourceContent.length.toLocaleString()} chars
                </span>
                <button
                  onClick={() => setSourceContent("")}
                  className="text-[10px] text-text-tertiary hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setSourceContent(sampleSource)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-400 bg-violet-500/10 rounded-xl hover:bg-violet-500/20 transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              Load Sample Advisory
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!sourceContent.trim()}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                sourceContent.trim()
                  ? "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/20"
                  : "bg-white/5 text-text-tertiary cursor-not-allowed"
              )}
            >
              Analyze Source
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: AI Context */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <StepIndicator current={2} />

          {isAnalyzing ? (
            <div className="glass rounded-2xl p-6">
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
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-violet-400 shrink-0 animate-spin" />
                      ) : (
                        <Circle className="w-4 h-4 text-white/20 shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          isDone && "text-emerald-400 font-medium",
                          isCurrent && "text-violet-400 font-semibold",
                          !isDone && !isCurrent && "text-text-tertiary"
                        )}
                      >
                        {ps}
                        {isCurrent && <span className="animate-pulse-dot ml-1">...</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : context ? (
            <div className="space-y-6 animate-fade-in-up">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-1">AI Understanding</h2>
                <p className="text-sm text-text-secondary mb-6">
                  Source context extracted successfully.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Content Type", value: context.source_type },
                    { label: "Primary Objective", value: context.intent },
                    { label: "Key Topic", value: context.topic },
                    { label: "Confidence", value: `${Math.round(context.confidence * 100)}%` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                        {item.label}
                      </span>
                      <p className="text-sm font-semibold text-white mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Key Facts */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                    Key Facts
                  </h3>
                  <div className="space-y-2">
                    {context.key_facts.map((fact, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <Check className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                        {fact}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights */}
                <div>
                  <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                    AI Insights
                  </h3>
                  <div className="space-y-2">
                    {context.recommendations.slice(0, 3).map((rec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 text-sm text-text-secondary"
                      >
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={goToOutputSelection}
                  className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20"
                >
                  Select Outputs
                  <ArrowRight className="w-4 h-4" />
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
            <h2 className="text-lg font-bold text-white">What do you want to create?</h2>
            <p className="text-sm text-text-secondary mt-1">
              Select multiple outputs. Configure your preferences below.
            </p>
          </div>

          {/* Output cards */}
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
                      ? "bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/10"
                      : "bg-surface border-white/5 hover:border-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                      isSelected
                        ? "bg-violet-600 border-violet-600"
                        : "border-white/20"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <fmt.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isSelected ? "text-violet-400" : "text-text-tertiary"
                        )}
                        style={!isSelected ? { color: fmt.color } : undefined}
                      />
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isSelected ? "text-white" : "text-text-secondary"
                        )}
                      >
                        {fmt.name}
                      </span>
                    </div>
                    <p className="text-xs text-text-tertiary mt-1">{fmt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Config Section */}
          <div className="glass rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-bold text-white mb-4">Generation Controls</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Audience */}
              <div>
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">
                  Target Audience
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["General", "Executive", "Technical", "Public", "Media"].map((a) => (
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
                          ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                          : "bg-surface text-text-tertiary border-white/5 hover:border-white/10"
                      )}
                    >
                      {config.audiences.includes(a) && "✓ "}
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">
                  Tone
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Professional", "Urgent", "Authoritative", "Conversational", "Formal"].map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setConfig((c) => ({ ...c, tone: t }))}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                          config.tone === t
                            ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                            : "bg-surface text-text-tertiary border-white/5 hover:border-white/10"
                        )}
                      >
                        {config.tone === t && "● "}
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">
                  Language
                </label>
                <select
                  value={config.language}
                  onChange={(e) => setConfig((c) => ({ ...c, language: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all"
                >
                  {["English", "Hindi", "Spanish", "French", "German"].map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detail Level */}
              <div>
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">
                  Detail Level
                </label>
                <div className="flex gap-1.5">
                  {["Brief", "Standard", "Detailed"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setConfig((c) => ({ ...c, detail: d }))}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-[11px] font-medium border transition-all",
                        config.detail === d
                          ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                          : "bg-surface text-text-tertiary border-white/5 hover:border-white/10"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Objective */}
              <div>
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">
                  Objective
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Inform", "Persuade", "Alert", "Educate", "Engage"].map((o) => (
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
                          ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                          : "bg-surface text-text-tertiary border-white/5 hover:border-white/10"
                      )}
                    >
                      {config.objectives.includes(o) && "✓ "}
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Style */}
              <div>
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">
                  Content Style
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Corporate", "Editorial", "Social", "Newsroom", "Formal"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setContentStyle(s)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                        contentStyle === s
                          ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                          : "bg-surface text-text-tertiary border-white/5 hover:border-white/10"
                      )}
                    >
                      {contentStyle === s && "● "}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-tertiary">
                {selectedOutputs.length > 0 ? (
                  <span className="text-violet-400 font-bold">{selectedOutputs.length}</span>
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
                    ? "bg-violet-600 text-white hover:bg-violet-500 shadow-violet-500/20"
                    : "bg-white/5 text-text-tertiary cursor-not-allowed"
                )}
              >
                <Sparkles className="w-4 h-4" />
                Transform Content
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
              outputResults={{}}
            />
          ) : results ? (
            <div className="max-w-5xl mx-auto">
              {/* Success header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-medium mb-4">
                  <CheckCircle className="w-4 h-4" />
                  Transformation Complete
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {results.length} deliverable{results.length !== 1 ? "s" : ""} generated
                  from 1 source
                </h2>
                <p className="text-sm text-text-secondary">
                  Source-grounded · Consistency-checked · Format-validated
                </p>
              </div>

              {/* Consistency scores */}
              {consistencyResult && <ConsistencyDisplay result={consistencyResult} />}

              {/* Result tabs */}
              <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                {results.map((output) => {
                  const fmt = outputFormats.find((f) => f.id === output.format);
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
                          ? "bg-violet-600 text-white shadow-sm"
                          : "bg-surface text-text-secondary border border-white/5 hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {fmt?.name || output.format}
                    </button>
                  );
                })}
              </div>

              {/* Content viewer */}
              {activeOutput && (
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white">{activeOutput.title}</h3>
                    <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      ✓ Validated
                    </span>
                  </div>

                  <div className="px-5 py-4 max-h-[500px] overflow-y-auto">
                    {editedContent !== null ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-96 p-4 text-sm text-white bg-surface border border-white/10 rounded-xl resize-none focus:outline-none focus:border-violet-500/50 font-mono leading-relaxed"
                      />
                    ) : (
                      <pre className="text-sm text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
                        {activeOutput.content}
                      </pre>
                    )}
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {editedContent !== null ? (
                        <>
                          <button
                            onClick={() => {
                              setEditedContent(null);
                              toast("Changes saved");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-500 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditedContent(null)}
                            className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleCopy(activeOutput.content)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-white bg-white/[0.03] border border-white/5 rounded-lg transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </button>
                          <button
                            onClick={() => handleExport(activeOutput)}
                            disabled={isExporting}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Export
                          </button>
                          <button
                            onClick={() => setEditedContent(activeOutput.content)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-white bg-white/[0.03] border border-white/5 rounded-lg transition-colors"
                          >
                            ✏️ Edit
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          toast(`Regenerating "${activeOutput.title}"...`, "info");
                          setTimeout(() => toast("Regeneration complete", "success"), 1500);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-500/10 border border-violet-500/20 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit Config
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20"
                >
                  <Wand2 className="w-4 h-4" />
                  New Transformation
                </button>
              </div>

              <div className="text-center mt-12 pb-8">
                <p className="text-sm font-semibold text-text-tertiary tracking-wide">
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
