"use client";

import { cn } from "@/lib/utils";
import {
  Share2,
  MessageSquare,
  FileText,
  Shield,
  Presentation,
  Video,
  Check,
} from "lucide-react";

interface OutputSelectorProps {
  selected: string[];
  onToggle: (output: string) => void;
  onTransform: () => void;
  onPrev: () => void;
  isTransforming: boolean;
}

const outputCategories = [
  {
    label: "Social",
    items: [
      {
        id: "linkedin",
        name: "LinkedIn Post",
        icon: Share2,
        desc: "Professional social post with insights",
      },
      {
        id: "twitter",
        name: "X/Twitter Post",
        icon: MessageSquare,
        desc: "Concise post under 280 characters",
      },
    ],
  },
  {
    label: "Documents",
    items: [
      {
        id: "executive",
        name: "Executive Summary",
        icon: FileText,
        desc: "Leadership-ready overview with action items",
      },
      {
        id: "advisory",
        name: "Advisory",
        icon: Shield,
        desc: "Formal advisory with structured sections",
      },
    ],
  },
  {
    label: "Visual",
    items: [
      {
        id: "presentation",
        name: "Presentation",
        icon: Presentation,
        desc: "6-slide deck with speaker notes",
      },
      {
        id: "infographic",
        name: "Infographic",
        icon: FileText,
        desc: "Visual data layout specification",
      },
    ],
  },
  {
    label: "Media",
    items: [
      {
        id: "video",
        name: "Video Package",
        icon: Video,
        desc: "Scene-by-scene storyboard & narration",
      },
    ],
  },
];

export default function OutputSelector({
  selected,
  onToggle,
  onTransform,
  onPrev,
  isTransforming,
}: OutputSelectorProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Select Outputs</h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose one or more output formats to generate.
        </p>
      </div>

      <div className="space-y-5">
        {outputCategories.map((cat) => (
          <div key={cat.label}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {cat.label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.items.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onToggle(item.id)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                      isSelected
                        ? "bg-indigo-50 border-indigo-300 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                        isSelected
                          ? "bg-indigo-600 border-indigo-600"
                          : "border-slate-300"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <item.icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isSelected ? "text-indigo-600" : "text-slate-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            isSelected ? "text-indigo-700" : "text-slate-800"
                          )}
                        >
                          {item.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selection count + actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
        <button
          onClick={onPrev}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">
            {selected.length > 0 ? (
              <>
                <span className="text-indigo-600 font-bold">
                  {selected.length}
                </span>{" "}
                {selected.length === 1 ? "deliverable" : "deliverables"}{" "}
                selected
              </>
            ) : (
              "Select at least one output"
            )}
          </span>

          <button
            onClick={onTransform}
            disabled={selected.length === 0 || isTransforming}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm",
              selected.length > 0 && !isTransforming
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {isTransforming ? "Transforming..." : `Transform →`}
          </button>
        </div>
      </div>
    </div>
  );
}
