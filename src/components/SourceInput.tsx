"use client";

import { useState } from "react";
import { sampleSource } from "@/lib/mockData";
import { crisisTemplates, type CrisisTemplate } from "@/lib/crisisTemplates";
import { FileText, Upload, Link2, Wand2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceInputProps {
  content: string;
  onChange: (content: string) => void;
  onNext: () => void;
  onTemplateSelect?: (template: CrisisTemplate) => void;
}

export default function SourceInput({
  content,
  onChange,
  onNext,
  onTemplateSelect,
}: SourceInputProps) {
  const [showTemplates, setShowTemplates] = useState(false);

  const loadSample = () => {
    onChange(sampleSource);
  };

  const handleTemplateSelect = (template: CrisisTemplate) => {
    onChange(template.sampleSource);
    onTemplateSelect?.(template);
    setShowTemplates(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Source Input</h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste your content below, load a sample, or start from a crisis response template.
        </p>
      </div>

      {/* Quick-start templates banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Crisis Response Templates
              </p>
              <p className="text-xs text-slate-500">
                Pre-configured for CVEs, data breaches, policy changes, incidents & more
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Browse Templates
          </button>
        </div>

        {/* Template quick picks */}
        {showTemplates && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {crisisTemplates.slice(0, 6).map((t) => (
              <button
                key={t.id}
                onClick={() => handleTemplateSelect(t)}
                className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
              >
                <span className="text-lg">{t.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.defaultOutputs.length} outputs</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input type tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { icon: FileText, label: "Text", active: true },
          { icon: Link2, label: "URL", active: false },
          { icon: Upload, label: "Document", active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              tab.active
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed"
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
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your source content here — articles, reports, advisories, research papers, announcements, or any organizational information..."
          className="w-full h-72 p-4 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 text-[10px] text-slate-400">
          {content.length > 0 && `${content.length.toLocaleString()} characters`}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={loadSample}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Load Sample Advisory
        </button>

        <button
          onClick={onNext}
          disabled={!content.trim()}
          className={cn(
            "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
            content.trim()
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          Next: Analyze →
        </button>
      </div>
    </div>
  );
}
