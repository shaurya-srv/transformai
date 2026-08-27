"use client";

import { useState, useEffect } from "react";
import { FileCheck, Plus, CheckCircle, XCircle, Clock, Loader2, Link2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { createApprovalRequest, signRequest, getApprovalRequests, getPendingCount, APPROVAL_POLICIES, DEFAULT_APPROVERS, type ApprovalRequest, type Approver } from "@/lib/multisig";

const roleColors: Record<string, string> = {
  legal: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  pr: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
  security: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  executive: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  compliance: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  engineering: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
};
const sc: Record<string, string> = { pending: "text-amber-400", approved: "text-emerald-400", rejected: "text-red-400" };

function RequestCard({ req, onSign }: { req: ApprovalRequest; onSign: (id: string, a: Approver, d: "approved" | "rejected") => void }) {
  const [exp, setExp] = useState(false);
  const [sel, setSel] = useState<Approver>(DEFAULT_APPROVERS[0]);
  const pct = req.requiredSignatures > 0 ? (req.currentSignatures / req.requiredSignatures) * 100 : 0;
  return (
    <div className={cn("bg-white/[0.03] border rounded-xl p-4", req.status === "approved" && "border-emerald-500/30", req.status === "rejected" && "border-red-500/30", req.status === "pending" && "border-amber-500/20")}>
      <div className="flex items-start justify-between"><div className="flex-1">
        <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-mono text-gray-500">{req.id}</span><span className={cn("text-[10px] font-bold uppercase", sc[req.status])}>{req.status}</span>{req.blockchainAnchored && <span className="flex items-center gap-0.5 text-[10px] text-cyan-400"><Link2 className="w-2.5 h-2.5" /> chained</span>}</div>
        <h4 className="text-sm font-semibold text-white">{req.contentTitle}</h4>
        <p className="text-[11px] text-gray-400 mt-1">{req.policy.name}</p>
      </div><button onClick={() => setExp(!exp)} className="text-gray-500 hover:text-white">{exp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button></div>
      <div className="mt-3"><div className="flex items-center justify-between mb-1"><span className="text-[10px] text-gray-500">{req.currentSignatures}/{req.requiredSignatures} approvals</span></div>
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden"><div className={cn("h-full rounded-full transition-all duration-500", req.status === "approved" ? "bg-emerald-500" : req.status === "rejected" ? "bg-red-500" : "bg-amber-500")} style={{ width: `${pct}%` }} /></div></div>
      {exp && (<div className="mt-4 pt-3 border-t border-white/5 space-y-3">
        <div><span className="text-[10px] font-bold text-gray-500 uppercase">Required Roles</span><div className="flex flex-wrap gap-1.5 mt-1.5">{req.policy.requiredRoles.map((r) => { const s = req.signatures.find((x) => x.role === r && x.status !== "rejected"); return <div key={r} className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold", s ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : roleColors[r])}>{s ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{r}</div>; })}</div></div>
        {req.signatures.length > 0 && <div><span className="text-[10px] font-bold text-gray-500 uppercase">Signatures</span><div className="space-y-1.5 mt-1.5">{req.signatures.map((s) => <div key={s.timestamp} className="flex items-center gap-2 text-[11px] bg-white/[0.03] rounded-lg px-3 py-2">{s.status === "approved" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}<span className="text-white font-medium">{s.approverName}</span><span className={cn("text-[10px] px-1.5 py-0.5 rounded", roleColors[s.role])}>{s.role}</span><span className="text-[10px] text-gray-500 ml-auto">{new Date(s.timestamp).toLocaleTimeString()}</span></div>)}</div></div>}
        {req.status === "pending" && <div className="flex items-center gap-2"><select value={sel.id} onChange={(e) => setSel(DEFAULT_APPROVERS.find((a) => a.id === e.target.value) || DEFAULT_APPROVERS[0])} className="flex-1 px-3 py-2 text-xs text-white bg-white/[0.06] border border-white/10 rounded-lg">{DEFAULT_APPROVERS.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}</select>
          <button onClick={() => onSign(req.id, sel, "approved")} className="px-3 py-2 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg">Approve</button>
          <button onClick={() => onSign(req.id, sel, "rejected")} className="px-3 py-2 text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg">Reject</button></div>}
      </div>)}
    </div>);
}

export default function MultiSigApproval({ content, contentTitle }: { content: string; contentTitle?: string }) {
  const [reqs, setReqs] = useState<ApprovalRequest[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [pol, setPol] = useState(APPROVAL_POLICIES[0].id);
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(0);
  const refresh = () => { setReqs(getApprovalRequests()); setPending(getPendingCount()); };
  useEffect(refresh, []);
  const create = async () => { setCreating(true); try { await createApprovalRequest(contentTitle || "Untitled", content.substring(0, 150), content, "transformation", pol, "User"); refresh(); setShowNew(false); } finally { setCreating(false); } };
  const sign = async (id: string, a: Approver, d: "approved" | "rejected") => { await signRequest(id, a.id, a.name, a.role, d); refresh(); };
  return (
    <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><FileCheck className="w-4 h-4 text-amber-400" /> Multi-Sig Approval{pending > 0 && <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/15 text-amber-400 rounded-full">{pending}</span>}</h3>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-lg"><Plus className="w-3 h-3" /> New</button>
      </div>
      {showNew && <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase">Select Policy</span>
        <div className="space-y-2 mt-2">{APPROVAL_POLICIES.map((p) => <label key={p.id} className={cn("flex items-start gap-3 p-3 rounded-lg border cursor-pointer", pol === p.id ? "border-amber-500/30 bg-amber-500/5" : "border-white/5")}>
          <input type="radio" checked={pol === p.id} onChange={() => setPol(p.id)} className="mt-0.5" />
          <div><div className="text-xs font-semibold text-white">{p.name}</div><div className="text-[10px] text-gray-400">{p.description}</div><div className="flex gap-1 mt-1">{p.requiredRoles.map((r) => <span key={r} className={cn("text-[9px] px-1.5 py-0.5 rounded font-bold", roleColors[r])}>{r}</span>)}</div></div></label>)}</div>
        <button onClick={create} disabled={creating} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-xl disabled:opacity-50">{creating ? "Anchoring..." : "Submit for Approval"}</button>
      </div>}
      {reqs.length === 0 ? <p className="text-xs text-gray-500 text-center py-4">No requests yet.</p> : <div className="space-y-3">{reqs.map((r) => <RequestCard key={r.id} req={r} onSign={sign} />)}</div>}
    </div>);
}
