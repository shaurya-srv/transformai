"use client";

import { cn } from "@/lib/utils";
import type { TransformationConfig } from "@/lib/ai";

interface ConfigPanelProps {
  config: TransformationConfig;
  onUpdate: (updates: Partial<TransformationConfig>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const audienceOptions = [
  "General Public",
  "Employees",
  "Executives",
  "Government Officials",
  "Technical Team",
  "Customers",
  "Media",
];

const toneOptions = [
  "Professional",
  "Formal",
  "Conversational",
  "Persuasive",
  "Urgent",
  "Simple",
];

const languageOptions = ["English", "Hindi"];

const detailOptions = ["Brief", "Standard", "Detailed"];

const objectiveOptions = ["Inform", "Educate", "Alert", "Persuade", "Summarize"];

export default function ConfigPanel({
  config,
  onUpdate,
  onNext,
  onPrev,
}: ConfigPanelProps) {
  const toggleArrayItem = (
    field: "audiences" | "objectives",
    item: string
  ) => {
    const current = config[field];
    const exists = current.includes(item);
    onUpdate({
      [field]: exists ? current.filter((i) => i !== item) : [...current, item],
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Configuration</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure how your content should be transformed.
        </p>
      </div>

      <div className="space-y-6">
        {/* Target Audience */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="text-sm font-semibold text-slate-800 mb-3 block">
            Target Audience
          </label>
          <div className="flex flex-wrap gap-2">
            {audienceOptions.map((a) => (
              <button
                key={a}
                onClick={() => toggleArrayItem("audiences", a)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  config.audiences.includes(a)
                    ? "bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                )}
              >
                {config.audiences.includes(a) && "✓ "}
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="text-sm font-semibold text-slate-800 mb-3 block">
            Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {toneOptions.map((t) => (
              <button
                key={t}
                onClick={() => onUpdate({ tone: t })}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  config.tone === t
                    ? "bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                )}
              >
                {config.tone === t && "● "}
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Language + Detail row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Language */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <label className="text-sm font-semibold text-slate-800 mb-3 block">
              Language
            </label>
            <div className="flex gap-2">
              {languageOptions.map((l) => (
                <button
                  key={l}
                  onClick={() => onUpdate({ language: l })}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-medium border transition-all flex-1",
                    config.language === l
                      ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Detail Level */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <label className="text-sm font-semibold text-slate-800 mb-3 block">
              Detail Level
            </label>
            <div className="flex gap-2">
              {detailOptions.map((d) => (
                <button
                  key={d}
                  onClick={() => onUpdate({ detail: d })}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-medium border transition-all flex-1",
                    config.detail === d
                      ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Communication Objective */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <label className="text-sm font-semibold text-slate-800 mb-3 block">
            Communication Objective
          </label>
          <div className="flex flex-wrap gap-2">
            {objectiveOptions.map((o) => (
              <button
                key={o}
                onClick={() => toggleArrayItem("objectives", o)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  config.objectives.includes(o)
                    ? "bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                )}
              >
                {config.objectives.includes(o) && "✓ "}
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onPrev}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Next: Select Outputs →
        </button>
      </div>
    </div>
  );
}
