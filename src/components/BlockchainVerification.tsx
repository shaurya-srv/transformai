"use client";

import { useState } from "react";
import { Link2, CheckCircle, XCircle, Loader2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { anchorContent, verifyContent, getRecentBlocks, getChainStats, type BlockchainRecord, type VerificationResult } from "@/lib/blockchain";

export default function BlockchainVerification({ content, metadata }: { content: string; metadata?: { type: "source" | "output" | "transformation"; format?: string; projectId?: string } }) {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [anchorRecord, setAnchorRecord] = useState<BlockchainRecord | null>(null);
  const [showChain, setShowChain] = useState(false);
  const [chainStats, setChainStats] = useState(getChainStats());
  const [recentBlocks, setRecentBlocks] = useState<BlockchainRecord[]>([]);

  const handleAnchor = async () => {
    setIsAnchoring(true);
    try {
      const record = await anchorContent(content, metadata || { type: "output" });
      setAnchorRecord(record);
      setChainStats(getChainStats());
      setRecentBlocks(getRecentBlocks(10));
    } finally {
      setIsAnchoring(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const v = await verifyContent(content);
      setResult(v);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Link2 className="w-4 h-4 text-cyan-400" /> Blockchain Verification
        </h3>
        <div className="flex gap-2">
          <button onClick={handleAnchor} disabled={isAnchoring}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all disabled:opacity-50">
            {isAnchoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2 className="w-3 h-3" />}
            {isAnchoring ? "Anchoring..." : "Anchor to Chain"}
          </button>
          <button onClick={handleVerify} disabled={isVerifying}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all disabled:opacity-50">
            {isVerifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "Blocks", value: chainStats.totalBlocks },
          { label: "Sources", value: chainStats.totalSources },
          { label: "Outputs", value: chainStats.totalOutputs },
          { label: "Integrity", value: chainStats.chainIntegrity ? "OK" : "FAIL" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-lg p-2 text-center">
            <div className="text-[10px] text-gray-500 uppercase">{s.label}</div>
            <div className={cn("text-sm font-bold", s.label === "Integrity" ? (chainStats.chainIntegrity ? "text-emerald-400" : "text-red-400") : "text-white")}>{s.value}</div>
          </div>
        ))}
      </div>

      {anchorRecord && (
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400">Anchored to Block #{anchorRecord.blockNumber}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 w-16">Hash:</span>
              <code className="text-[10px] text-gray-300 font-mono truncate flex-1">{anchorRecord.contentHash.substring(0, 32)}...</code>
              <button onClick={() => copyHash(anchorRecord.contentHash)} className="text-gray-500 hover:text-white"><Copy className="w-3 h-3" /></button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 w-16">Block:</span>
              <code className="text-[10px] text-gray-300 font-mono truncate flex-1">{anchorRecord.blockHash.substring(0, 32)}...</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 w-16">Time:</span>
              <span className="text-[10px] text-gray-300">{new Date(anchorRecord.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className={cn("border rounded-xl p-3 mb-3", result.valid ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20")}>
          <div className="flex items-center gap-2">
            {result.valid ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            <span className={cn("text-xs font-semibold", result.valid ? "text-emerald-400" : "text-red-400")}>{result.message}</span>
          </div>
        </div>
      )}

      {recentBlocks.length > 0 && (
        <div>
          <button onClick={() => setShowChain(!showChain)} className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors">
            {showChain ? "Hide" : "Show"} chain ({recentBlocks.length} recent blocks)
          </button>
          {showChain && (
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {recentBlocks.map((b) => (
                <div key={b.id} className="flex items-center gap-2 text-[10px] bg-white/[0.03] rounded-lg px-3 py-2">
                  <span className="text-gray-500 font-mono">#{b.blockNumber}</span>
                  <span className="text-gray-400 truncate flex-1">{b.contentPreview.substring(0, 40)}...</span>
                  <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold",
                    b.metadata.type === "source" && "bg-violet-500/15 text-violet-400",
                    b.metadata.type === "output" && "bg-cyan-500/15 text-cyan-400",
                    b.metadata.type === "transformation" && "bg-emerald-500/15 text-emerald-400",
                  )}>{b.metadata.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
