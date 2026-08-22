"use client";

import { cn } from "@/lib/utils";
import type { ConsistencyResult } from "@/lib/consistencyEngine";

interface ConsistencyScoreProps {
  result: ConsistencyResult;
  compact?: boolean;
}

export default function ConsistencyScore({ result, compact = false }: ConsistencyScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  if (compact) {
    return (
      <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-semibold", getScoreColor(result.overallScore))}>
        <span className="w-2 h-2 rounded-full bg-current opacity-60" />
        Consistency: {result.overallScore}%
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">Consistency Analysis</h3>
        <div className={cn("px-3 py-1 rounded-full border text-xs font-bold", getScoreColor(result.overallScore))}>
          {result.overallScore}% — {result.overallScore >= 90 ? "Excellent" : result.overallScore >= 70 ? "Good" : "Review"}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <ScoreBar label="Source Grounding" score={result.sourceGrounding} description="Facts matched from source" />
        <ScoreBar label="Cross-Output Consistency" score={result.crossOutputConsistency} description="Outputs agree with each other" />
        <ScoreBar label="Completeness" score={result.completeness} description="Key sections covered" />
      </div>

      {result.issues.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Issues ({result.issues.length})</p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {result.issues.slice(0, 5).map((issue, i) => (
              <div key={i} className={cn("text-[11px] px-2 py-1.5 rounded-md", issue.severity === "high" && "bg-red-50 text-red-700", issue.severity === "medium" && "bg-amber-50 text-amber-700", issue.severity === "low" && "bg-gray-50 text-gray-600")}>
                <span className="font-semibold uppercase">{issue.severity}</span> {issue.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, score, description }: { label: string; score: number; description: string }) {
  const getBarColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-900">{score}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", getBarColor(score))} style={{ width: `${score}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>
    </div>
  );
}
