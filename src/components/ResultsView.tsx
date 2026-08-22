"use client";

import { useState, useRef } from "react";
import {
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  ArrowLeft,
  Share2,
  MessageSquare,
  FileText,
  Shield,
  Presentation,
  Video,
  Image,
  FileDown,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import ValidationBadges from "./ValidationBadges";
import type { GeneratedOutput } from "@/lib/ai";
import { generatePptx } from "@/lib/pptxGenerator";
import { generateInfographic, generateInfographicDataUrl } from "@/lib/infographicRenderer";
import { generateVideo } from "@/lib/videoGenerator";

const formatIcons: Record<string, React.ElementType> = {
  linkedin: Share2,
  twitter: MessageSquare,
  executive: FileText,
  advisory: Shield,
  presentation: Presentation,
  video: Video,
  infographic: Image,
};

const formatLabels: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "X/Twitter",
  executive: "Exec. Summary",
  advisory: "Advisory",
  presentation: "Presentation",
  video: "Video",
  infographic: "Infographic",
};

interface ResultsViewProps {
  outputs: GeneratedOutput[];
  validation: {
    sourceGrounded: boolean;
    consistencyChecked: boolean;
    formatValidated: boolean;
  };
  onBack: () => void;
  onReset: () => void;
}

const regenerateOptions = [
  "Make it more concise",
  "Make it more formal",
  "Simpler language",
  "More technical",
  "For executives",
];

export default function ResultsView({
  outputs,
  validation,
  onBack,
  onReset,
}: ResultsViewProps) {
  const [activeTab, setActiveTab] = useState(outputs[0]?.format || "");
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [regenerateInstruction, setRegenerateInstruction] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGeneratingArtifact, setIsGeneratingArtifact] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [infographicPreview, setInfographicPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  const activeOutput = outputs.find((o) => o.format === activeTab);
  const displayContent = editedContent ?? activeOutput?.content ?? "";

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent);
    toast("Copied to clipboard");
  };

  const handleDownloadText = () => {
    const blob = new Blob([displayContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeOutput?.title || "output"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Downloaded as text file");
  };

  // ── PPTX Generation ───────────────────────────────────────────
  const handleDownloadPptx = async () => {
    if (!activeOutput) return;
    setIsGeneratingArtifact(true);
    try {
      await generatePptx(activeOutput.title, displayContent);
      toast("Presentation downloaded as .pptx");
    } catch (err) {
      console.error(err);
      toast("Failed to generate PPTX", "error");
    } finally {
      setIsGeneratingArtifact(false);
    }
  };

  // ── Infographic PNG Generation ────────────────────────────────
  const handleDownloadInfographic = () => {
    if (!activeOutput) return;
    setIsGeneratingArtifact(true);
    try {
      generateInfographic(activeOutput.title, displayContent);
      toast("Infographic downloaded as .png");
    } catch (err) {
      console.error(err);
      toast("Failed to generate infographic", "error");
    } finally {
      setIsGeneratingArtifact(false);
    }
  };

  const handlePreviewInfographic = () => {
    if (!activeOutput) return;
    const dataUrl = generateInfographicDataUrl(displayContent);
    setInfographicPreview(dataUrl);
  };

  // ── Video Generation ──────────────────────────────────────────
  const handleGenerateVideo = async () => {
    if (!activeOutput) return;
    setIsGeneratingArtifact(true);
    setVideoProgress(0);
    toast("Recording video... this may take a moment", "info");
    try {
      await generateVideo(activeOutput.title, displayContent, (p) => {
        setVideoProgress(p);
      });
      toast("Video downloaded as .webm");
    } catch (err) {
      console.error(err);
      toast("Failed to generate video", "error");
    } finally {
      setIsGeneratingArtifact(false);
      setVideoProgress(0);
    }
  };

  const handleRegenerate = async () => {
    if (!regenerateInstruction.trim()) return;
    setIsRegenerating(true);
    setShowRegenerate(false);
    await new Promise((r) => setTimeout(r, 1500));
    toast(`Regenerated with: "${regenerateInstruction}"`, "info");
    setRegenerateInstruction("");
    setIsRegenerating(false);
  };

  const handleSaveEdit = () => {
    setEditedContent(null);
    toast("Changes saved");
  };

  // Determine which specialized download buttons to show
  const isPresentation = activeTab === "presentation";
  const isInfographic = activeTab === "infographic";
  const isVideo = activeTab === "video";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900">
              {outputs.length} Deliverable{outputs.length !== 1 ? "s" : ""}{" "}
              Generated
            </h2>
          </div>
          <ValidationBadges />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Edit Config
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            New Transformation
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
        {outputs.map((output) => {
          const Icon = formatIcons[output.format] || FileText;
          const isActive = activeTab === output.format;
          return (
            <button
              key={output.format}
              onClick={() => {
                setActiveTab(output.format);
                setEditedContent(null);
                setShowRegenerate(false);
                setInfographicPreview(null);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0",
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {formatLabels[output.format] || output.format}
            </button>
          );
        })}
      </div>

      {/* Infographic preview */}
      {isInfographic && infographicPreview && (
        <div className="mb-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">
            Infographic Preview
          </p>
          <img
            src={infographicPreview}
            alt="Infographic preview"
            className="w-full max-w-md mx-auto rounded-lg border border-slate-200"
          />
        </div>
      )}

      {/* Content card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            {activeOutput?.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-600 font-medium px-2 py-0.5 bg-emerald-50 rounded-full">
              ✓ Validated
            </span>
            {(isPresentation || isInfographic || isVideo) && (
              <span className="text-[10px] text-indigo-600 font-medium px-2 py-0.5 bg-indigo-50 rounded-full">
                {isPresentation && "📁 Downloadable PPTX"}
                {isInfographic && "🖼️ Downloadable PNG"}
                {isVideo && "🎬 Recordable Video"}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="px-5 py-4 max-h-[500px] overflow-y-auto"
        >
          {editedContent !== null ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-96 p-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
            />
          ) : (
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
              {displayContent}
            </pre>
          )}
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 flex-wrap">
            {editedContent !== null ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={() => setEditedContent(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* Copy always available */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>

                {/* Text download for non-artifact formats */}
                {!isPresentation && !isInfographic && !isVideo && (
                  <button
                    onClick={handleDownloadText}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .txt
                  </button>
                )}

                {/* PPTX download */}
                {isPresentation && (
                  <button
                    onClick={handleDownloadPptx}
                    disabled={isGeneratingArtifact}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    {isGeneratingArtifact ? "Generating..." : "Download .pptx"}
                  </button>
                )}

                {/* Infographic download + preview */}
                {isInfographic && (
                  <>
                    <button
                      onClick={handlePreviewInfographic}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors"
                    >
                      <Image className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      onClick={handleDownloadInfographic}
                      disabled={isGeneratingArtifact}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      {isGeneratingArtifact ? "Generating..." : "Download .png"}
                    </button>
                  </>
                )}

                {/* Video recording */}
                {isVideo && (
                  <button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingArtifact}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Film className="w-3.5 h-3.5" />
                    {isGeneratingArtifact
                      ? `Recording... ${Math.round(videoProgress * 100)}%`
                      : "Record & Download .webm"}
                  </button>
                )}

                {/* Edit always available */}
                <button
                  onClick={() => setEditedContent(displayContent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors"
                >
                  ✏️ Edit
                </button>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowRegenerate(!showRegenerate)}
              disabled={isRegenerating}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                isRegenerating
                  ? "text-slate-400 bg-slate-100"
                  : "text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
              )}
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5", isRegenerating && "animate-spin")}
              />
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </button>

            {showRegenerate && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-10">
                <p className="text-xs font-semibold text-slate-800 mb-2">
                  Regenerate with instructions:
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {regenerateOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setRegenerateInstruction(opt)}
                      className="px-2 py-1 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <textarea
                  value={regenerateInstruction}
                  onChange={(e) => setRegenerateInstruction(e.target.value)}
                  placeholder="Custom instruction..."
                  className="w-full h-16 p-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2"
                />
                <button
                  onClick={handleRegenerate}
                  disabled={!regenerateInstruction.trim()}
                  className={cn(
                    "w-full py-1.5 rounded-lg text-xs font-semibold transition-colors",
                    regenerateInstruction.trim()
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-10 pb-8">
        <p className="text-sm font-semibold text-slate-400 tracking-wide">
          One Source. Every Communication.
        </p>
      </div>
    </div>
  );
}
