"use client";

import { useState } from "react";
import { ShieldAlert, Search, Loader2, AlertTriangle, CheckCircle, Ban, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { scanForDLP, type DLPScanResult, type DLPFinding } from "@/lib/dlpScanner";

const sevColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-400 border border-red-500/30",
  high: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  medium: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  low: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  info: "bg-white/[0.06] text-gray-400 border border-white/10",
};
const catIcons: Record<string, string> = { pii: "ID", credentials: "KEY", financial: "$", health: "+", internal: "NET", classification: "CLASS", network: "IP", source_code: "< />" };

function FindingRow({ f }: { f: DLPFinding }) {
  const [exp, setExp] = useState(false);
  return (
    <div className={cn("border rounded-xl p-3 cursor-pointer transition-all hover:bg-white/[0.03]", f.severity === "critical" && "border-red-500/30", f.severity === "high" && "border-orange-500/30", f.severity === "medium" && "border-amber-500/20", f.severity === "low" && "border-blue-500/20")} onClick={() => setExp(!exp)}>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-gray-500 w-20">{f.id}</span>
        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", sevColors[f.severity])}>{f.severity}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-400">{catIcons[f.category] || f.category}</span>
        <span className="text-xs font-medium text-white flex-1">{f.title}</span>
        {f.regulation && <span className="text-[9px] text-violet-400">{f.regulation}</span>}
      </div>
      {exp && <div className="mt-2 pt-2 border-t border-white/5 space-y-1.5">
        <p className="text-[11px] text-gray-400">{f.description}</p>
        <div className="text-[10px] text-gray-500">Evidence: <code className="text-gray-300 bg-white/[0.03] px-1.5 py-0.5 rounded">{f.evidence}</code></div>
        <p className="text-[11px] text-emerald-400">{f.recommendation}</p>
      </div>}
    </div>
  );
}

export default function DLPScannerPanel({ content }: { content: string }) {
  const [result, setResult] = useState<DLPScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const runScan = () => { setScanning(true); setTimeout(() => { setResult(scanForDLP(content)); setScanning(false); }, 700); };
  const rlColors: Record<string, string> = { blocked: "text-red-400", warning: "text-amber-400", clean: "text-emerald-400" };
  return (
    <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-400" /> DLP Scanner</h3>
        <button onClick={runScan} disabled={scanning} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 disabled:opacity-50">
          {scanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}{scanning ? "Scanning..." : "Run DLP Scan"}</button>
      </div>
      {!result && !scanning && <p className="text-xs text-gray-500 text-center py-4">Scan content for PII, credentials, financial data, and classified information.</p>}
      {scanning && <div className="text-center py-6"><Loader2 className="w-8 h-8 text-red-400 animate-spin mx-auto mb-2" /><p className="text-xs text-gray-400">Deep scanning content...</p></div>}
      {result && !scanning && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={cn("text-2xl font-black", rlColors[result.riskLevel])}>{result.score}</div>
            <div><div className="text-xs font-bold text-white uppercase">DLP Score</div>
              <div className={cn("text-xs font-bold uppercase", rlColors[result.riskLevel])}>{result.riskLevel}{result.blockedByPolicy && " — BLOCKED"}</div></div>
            <div className="ml-auto flex items-center gap-2">
              {result.blockedByPolicy ? <Ban className="w-5 h-5 text-red-400" /> : result.safe ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
              <span className="text-[10px] text-gray-400">{result.totalMatches} issues</span>
            </div>
          </div>
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden"><div className={cn("h-full rounded-full transition-all", result.riskLevel === "clean" && "bg-emerald-500", result.riskLevel === "warning" && "bg-amber-500", result.riskLevel === "blocked" && "bg-red-500")} style={{ width: `${result.score}%` }} /></div>
          {/* Category breakdown */}
          <div className="grid grid-cols-4 gap-2">{(["pii", "credentials", "financial", "internal"] as const).map((cat) => { const count = result.findings.filter((f) => f.category === cat).length; return <div key={cat} className="bg-white/[0.03] border border-white/5 rounded-lg p-2 text-center"><div className="text-[10px] text-gray-500 uppercase">{cat}</div><div className={cn("text-sm font-bold", count > 0 ? "text-red-400" : "text-emerald-400")}>{count}</div></div>; })}</div>
          {result.findings.length > 0 && <div className="space-y-2 max-h-60 overflow-y-auto">{result.findings.map((f) => <FindingRow key={f.id} f={f} />)}</div>}
        </div>
      )}
    </div>
  );
}
