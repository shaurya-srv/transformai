"use client";

import { useState } from "react";
import { Scale, CheckCircle, AlertTriangle, Loader2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkCompliance, type ComplianceResult, type ComplianceIssue } from "@/lib/complianceChecker";

function IssueRow({ issue }: { issue: ComplianceIssue }) {
  const colors: Record<string, string> = {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-amber-400",
    low: "text-blue-400",
  };
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] font-bold uppercase", colors[issue.severity])}>{issue.severity}</span>
          <span className="text-[10px] font-mono text-gray-500">{issue.id}</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400 border border-white/10">{issue.regulation}</span>
      </div>
      <h4 className="text-xs font-semibold text-white mt-1">{issue.title}</h4>
      <p className="text-[11px] text-gray-400 mt-1">{issue.description}</p>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[10px] font-bold text-gray-500">Evidence:</span>
        <code className="text-[10px] text-gray-300 font-mono bg-white/[0.03] px-1.5 py-0.5 rounded">{issue.evidence}</code>
      </div>
      <p className="text-[11px] text-emerald-400 mt-1.5">{issue.recommendation}</p>
    </div>
  );
}

export default function ComplianceBadge({ content }: { content: string }) {
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const runCheck = () => {
    setIsScanning(true);
    setTimeout(() => {
      const r = checkCompliance(content);
      setResult(r);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-violet-400" /> Compliance Check
        </h3>
        <button onClick={runCheck} disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-lg hover:bg-violet-500/20 transition-all disabled:opacity-50">
          {isScanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
          {isScanning ? "Checking..." : "Run Compliance Check"}
        </button>
      </div>

      {!result && !isScanning && (
        <p className="text-xs text-gray-500 text-center py-4">Scan content for GDPR, HIPAA, and PCI-DSS compliance issues.</p>
      )}

      {isScanning && (
        <div className="text-center py-6">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-400">Checking compliance regulations...</p>
        </div>
      )}

      {result && !isScanning && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={cn("text-2xl font-black", result.compliant ? "text-emerald-400" : "text-red-400")}>{result.score}</div>
            <div>
              <div className="text-xs font-bold text-white uppercase">Compliance Score</div>
              <div className={cn("text-xs font-semibold", result.compliant ? "text-emerald-400" : "text-red-400")}>
                {result.compliant ? "COMPLIANT" : "NON-COMPLIANT"}
              </div>
            </div>
            <div className="ml-auto">
              {result.compliant ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />}
            </div>
          </div>

          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-500", result.compliant ? "bg-emerald-500" : "bg-red-500")}
              style={{ width: `${result.score}%` }} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {["GDPR", "HIPAA", "PCI-DSS"].map((reg) => {
              const regIssues = result.issues.filter((i) => i.regulation === reg);
              return (
                <div key={reg} className="bg-white/[0.03] border border-white/5 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 uppercase">{reg}</div>
                  <div className={cn("text-sm font-bold", regIssues.length === 0 ? "text-emerald-400" : "text-red-400")}>
                    {regIssues.length === 0 ? "OK" : regIssues.length}
                  </div>
                </div>
              );
            })}
          </div>

          {result.issues.length > 0 && (
            <div className="space-y-2">
              {result.issues.map((issue) => <IssueRow key={issue.id} issue={issue} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
