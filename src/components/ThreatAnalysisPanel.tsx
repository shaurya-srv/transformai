"use client";

import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { analyzeThreats, type ThreatAnalysisResult, type ThreatFinding } from "@/lib/threatAnalysis";

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: "bg-red-500/15 text-red-400 border border-red-500/30",
    high: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    medium: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    low: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    info: "bg-white/[0.06] text-gray-400 border border-white/10",
  };
  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", colors[severity] || colors.info)}>
      {severity}
    </span>
  );
}

function FindingCard({ finding }: { finding: ThreatFinding }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={cn(
        "bg-white/[0.03] border rounded-xl p-4 cursor-pointer transition-all hover:bg-white/[0.05]",
        finding.severity === "critical" && "border-red-500/30",
        finding.severity === "high" && "border-orange-500/30",
        finding.severity === "medium" && "border-amber-500/20",
        finding.severity === "low" && "border-blue-500/20",
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-gray-500">{finding.id}</span>
            <SeverityBadge severity={finding.severity} />
          </div>
          <h4 className="text-sm font-semibold text-white">{finding.title}</h4>
          {finding.cveId && (
            <span className="text-[10px] font-mono text-violet-400 mt-1 inline-block">{finding.cveId}</span>
          )}
        </div>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Description</span>
            <p className="text-xs text-gray-300 mt-0.5">{finding.description}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Evidence</span>
            <p className="text-xs text-gray-300 mt-0.5 font-mono bg-white/[0.03] p-2 rounded-lg">{finding.evidence}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Recommendation</span>
            <p className="text-xs text-emerald-400 mt-0.5">{finding.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ThreatAnalysisPanel({ content }: { content: string }) {
  const [result, setResult] = useState<ThreatAnalysisResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const runScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const r = analyzeThreats(content);
      setResult(r);
      setIsScanning(false);
    }, 800);
  };

  const riskColors: Record<string, string> = {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-amber-400",
    low: "text-blue-400",
    clean: "text-emerald-400",
  };

  return (
    <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-orange-400" /> Threat Analysis
        </h3>
        <button onClick={runScan} disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-all disabled:opacity-50">
          {isScanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
          {isScanning ? "Scanning..." : "Scan Content"}
        </button>
      </div>

      {!result && !isScanning && (
        <p className="text-xs text-gray-500 text-center py-4">Click scan to analyze content for cybersecurity threats.</p>
      )}

      {isScanning && (
        <div className="text-center py-6">
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-400">Analyzing content for threats...</p>
        </div>
      )}

      {result && !isScanning && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={cn("text-2xl font-black", riskColors[result.overallRisk])}>{result.riskScore}</div>
            <div>
              <div className="text-xs font-bold text-white uppercase">Risk Score</div>
              <div className={cn("text-xs font-semibold uppercase", riskColors[result.overallRisk])}>{result.overallRisk}</div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              {result.overallRisk === "clean" ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-orange-400" />}
              <span className="text-[10px] text-gray-400">{result.findings.length} findings</span>
            </div>
          </div>
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-500",
              result.overallRisk === "clean" && "bg-emerald-500",
              result.overallRisk === "low" && "bg-blue-500",
              result.overallRisk === "medium" && "bg-amber-500",
              result.overallRisk === "high" && "bg-orange-500",
              result.overallRisk === "critical" && "bg-red-500",
            )} style={{ width: `${result.riskScore}%` }} />
          </div>
          {result.findings.length > 0 && (
            <div className="space-y-2">
              {result.findings.map((f) => <FindingCard key={f.id} finding={f} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
