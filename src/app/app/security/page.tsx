"use client";

import { useState } from "react";
import { Shield, Link2, Scale, AlertTriangle, CheckCircle, Database, Lock, FileCheck, ShieldAlert, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import ThreatAnalysisPanel from "@/components/ThreatAnalysisPanel";
import BlockchainVerification from "@/components/BlockchainVerification";
import ComplianceBadge from "@/components/ComplianceBadge";
import MultiSigApproval from "@/components/MultiSigApproval";
import DLPScannerPanel from "@/components/DLPScanner";
import IncidentResponsePanel from "@/components/IncidentResponse";
import { getChainStats, getRecentBlocks } from "@/lib/blockchain";

const sampleContent = `SECURITY ADVISORY: CVE-2024-38816 - Critical VPN Vulnerability

Affected Systems: NovaTech SecureConnect VPN Gateway v4.2.0 through v4.5.3
CVSS Score: 9.8 (Critical)
Impact: Remote Code Execution

Indicators of Compromise:
- IP address 185.220.101.45 associated with C2 server
- Malware hash: a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4
- Backdoor variant detected in version 4.3.1

Attack Vector: Unauthenticated RCE via crafted HTTP request
Affected users: john.doe@company.com, admin@corp.net

Recommended Actions:
1. Patch to v4.5.4 immediately
2. Rotate all VPN credentials
3. Review firewall disabled rules
4. Check for privilege escalation attempts

Patient records at risk of exposure. Contact: security@company.com
Credit card processing: 4532-1234-5678-9012`;

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "threat" | "blockchain" | "compliance" | "multisig" | "dlp" | "incident">("overview");
  const [testContent, setTestContent] = useState(sampleContent);
  const chainStats = getChainStats();
  const recentBlocks = getRecentBlocks(5);

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Shield },
    { id: "threat" as const, label: "Threat Analysis", icon: AlertTriangle },
    { id: "blockchain" as const, label: "Blockchain", icon: Link2 },
    { id: "compliance" as const, label: "Compliance", icon: Scale },
    { id: "multisig" as const, label: "Multi-Sig", icon: FileCheck },
    { id: "dlp" as const, label: "DLP Scanner", icon: ShieldAlert },
    { id: "incident" as const, label: "Incidents", icon: AlertOctagon },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="w-6 h-6 text-orange-400" /> Security &amp; Verification
        </h1>
        <p className="text-sm text-gray-400 mt-1">Blockchain verification, threat analysis, and regulatory compliance.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
              activeTab === tab.id ? "bg-violet-500/15 text-violet-400 border border-violet-500/30" : "bg-white/[0.04] text-gray-400 border border-white/10 hover:bg-white/[0.06]")}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Content to Analyze</label>
        <textarea value={testContent} onChange={(e) => setTestContent(e.target.value)}
          className="w-full h-32 p-3 text-sm text-white bg-white/[0.06] border border-white/10 rounded-xl resize-none focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 font-mono"
          placeholder="Paste content to analyze..." />
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Blockchain Blocks", value: chainStats.totalBlocks, icon: Database, color: "text-cyan-400" },
              { label: "Chain Integrity", value: chainStats.chainIntegrity ? "Valid" : "Invalid", icon: Lock, color: chainStats.chainIntegrity ? "text-emerald-400" : "text-red-400" },
              { label: "Content Verified", value: chainStats.totalSources + chainStats.totalOutputs, icon: CheckCircle, color: "text-violet-400" },
              { label: "Security Status", value: "Active", icon: Shield, color: "text-orange-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#12121a] rounded-xl border border-white/10 p-4">
                <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
                <div className={cn("text-lg font-bold", stat.color)}>{stat.value}</div>
                <div className="text-[10px] text-gray-500 uppercase mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {recentBlocks.length > 0 && (
            <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> Recent Chain Activity
              </h3>
              <div className="space-y-2">
                {recentBlocks.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 text-xs bg-white/[0.03] rounded-xl px-4 py-3">
                    <span className="font-mono text-gray-500 w-12">#{b.blockNumber}</span>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold",
                      b.metadata.type === "source" && "bg-violet-500/15 text-violet-400",
                      b.metadata.type === "output" && "bg-cyan-500/15 text-cyan-400",
                      b.metadata.type === "transformation" && "bg-emerald-500/15 text-emerald-400")}>
                      {b.metadata.type}
                    </span>
                    <span className="text-gray-300 flex-1 truncate">{b.contentPreview.substring(0, 50)}...</span>
                    <span className="text-gray-500 text-[10px]">{new Date(b.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <ThreatAnalysisPanel content={testContent} />
            <BlockchainVerification content={testContent} metadata={{ type: "source" }} />
          </div>
          <ComplianceBadge content={testContent} />
        </div>
      )}

      {activeTab === "threat" && <div className="animate-fade-in-up"><ThreatAnalysisPanel content={testContent} /></div>}
      {activeTab === "blockchain" && <div className="animate-fade-in-up"><BlockchainVerification content={testContent} metadata={{ type: "source" }} /></div>}
      {activeTab === "compliance" && <div className="animate-fade-in-up"><ComplianceBadge content={testContent} /></div>}
      {activeTab === "multisig" && <div className="animate-fade-in-up"><MultiSigApproval content={testContent} contentTitle="Security Advisory" /></div>}
      {activeTab === "dlp" && <div className="animate-fade-in-up"><DLPScannerPanel content={testContent} /></div>}
      {activeTab === "incident" && <div className="animate-fade-in-up"><IncidentResponsePanel /></div>}
    </div>
  );
}
