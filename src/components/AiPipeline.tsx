"use client";

import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SourceContext } from "@/lib/ai";

const pipelineSteps = [
  "Source received",
  "Extracting content",
  "Understanding context",
  "Identifying key facts",
  "Detecting entities",
  "Analyzing risks",
  "Extracting recommendations",
  "Building source context",
  "Ready for transformation",
];

interface AiPipelineProps {
  currentStep: number;
  isComplete: boolean;
  context: SourceContext | null;
}

export default function AiPipeline({
  currentStep,
  isComplete,
  context,
}: AiPipelineProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">AI Analysis</h2>
        <p className="text-sm text-slate-500 mt-1">
          {isComplete
            ? "Source context extracted successfully."
            : "Analyzing your source content..."}
        </p>
      </div>

      {/* Pipeline steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="space-y-3">
          {pipelineSteps.map((step, i) => {
            const stepNum = i + 1;
            const isDone = isComplete || currentStep > stepNum;
            const isCurrent = !isComplete && currentStep === stepNum;

            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 transition-all duration-300",
                  isDone || isCurrent ? "opacity-100" : "opacity-40"
                )}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 shrink-0 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    isDone && "text-emerald-700 font-medium",
                    isCurrent && "text-indigo-700 font-semibold",
                    !isDone && !isCurrent && "text-slate-400"
                  )}
                >
                  {step}
                  {isCurrent && (
                    <span className="animate-pulse-dot ml-1">...</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured context display */}
      {isComplete && context && (
        <div className="mt-6 animate-fade-in-up">
          <details className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <summary className="px-4 py-3 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
              📋 View Structured Context
            </summary>
            <div className="px-4 pb-4">
              <pre className="text-xs text-slate-600 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                {JSON.stringify(
                  {
                    topic: context.topic,
                    source_type: context.source_type,
                    summary: context.summary,
                    key_facts: context.key_facts,
                    entities: context.entities,
                    risks: context.risks,
                    recommendations: context.recommendations,
                    intent: context.intent,
                    confidence: context.confidence,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
