"use client";

import { useState, useEffect } from "react";
import { AlertOctagon, Plus, Loader2, Link2, Clock, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createIncident, updateIncidentStatus, getIncidentsList, getIncidentStats, type Incident, type IncidentSeverity, type IncidentStatus } from "@/lib/incidentResponse";

const sevColors: Record<string, string> = { "P1-critical": "bg-red-500/15 text-red-400 border border-red-500/30", "P2-high": "bg-orange-500/15 text-orange-400 border border-orange-500/30", "P3-medium": "bg-amber-500/15 text-amber-400 border border-amber-500/30", "P4-low": "bg-blue-500/15 text-blue-400 border border-blue-500/30" };
const statusColors: Record<string, string> = { detected: "text-red-400", triaging: "text-orange-400", contained: "text-amber-400", eradicating: "text-violet-400", recovering: "text-cyan-400", resolved: "text-emerald-400", "post-mortem": "text-gray-400" };
const allStatuses: IncidentStatus[] = ["detected", "triaging", "contained", "eradicating", "recovering", "resolved", "post-mortem"];

function IncidentCard({ inc, onUpdate }: { inc: Incident; onUpdate: (id: string, status: IncidentStatus) => void }) {
  const [exp, setExp] = useState(false);
  return (
    <div className={cn("bg-white/[0.03] border rounded-xl p-4", inc.severity === "P1-critical" && inc.status !== "resolved" && "border-red-500/30", inc.status === "resolved" && "border-emerald-500/30")}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-mono text-gray-500">{inc.id}</span><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", sevColors[inc.severity])}>{inc.severity}</span><span className={cn("text-[10px] font-bold uppercase", statusColors[inc.status])}>{inc.status}</span>{inc.blockchainAnchored && <span className="flex items-center gap-0.5 text-[10px] text-cyan-400"><Link2 className="w-2.5 h-2.5" /> chained</span>}</div>
          <h4 className="text-sm font-semibold text-white">{inc.title}</h4>
          <p className="text-[11px] text-gray-400 mt-1">{inc.description}</p>
        </div>
        <button onClick={() => setExp(!exp)} className="text-gray-500 hover:text-white">{exp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
      </div>
      {exp && (<div className="mt-4 pt-3 border-t border-white/5 space-y-3">
        <div><span className="text-[10px] font-bold text-gray-500 uppercase">Affected Systems</span><div className="flex flex-wrap gap-1 mt-1">{inc.affectedSystems.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{s}</span>)}</div></div>
        {inc.events.length > 0 && <div><span className="text-[10px] font-bold text-gray-500 uppercase">Blockchain Audit Trail ({inc.events.length} events)</span><div className="space-y-1.5 mt-1.5 max-h-40 overflow-y-auto">{inc.events.map((ev) => <div key={ev.id} className="flex items-center gap-2 text-[11px] bg-white/[0.03] rounded-lg px-3 py-2"><Clock className="w-3 h-3 text-gray-500 shrink-0" /><span className="text-white font-medium">{ev.actor}</span><span className="text-gray-400">{ev.description}</span><span className="text-[10px] text-gray-500 ml-auto">{new Date(ev.timestamp).toLocaleTimeString()}</span>{ev.blockchainTxId && <Link2 className="w-3 h-3 text-cyan-400 shrink-0" />}</div>)}</div></div>}
        {inc.status !== "resolved" && inc.status !== "post-mortem" && <div><span className="text-[10px] font-bold text-gray-500 uppercase">Update Status</span><div className="flex flex-wrap gap-1.5 mt-1.5">{allStatuses.filter((s) => s !== inc.status).map((s) => <button key={s} onClick={() => onUpdate(inc.id, s)} className={cn("text-[10px] px-2 py-1 rounded-lg font-bold border transition-all hover:opacity-80", sevColors["P3-medium"], "border-white/10 bg-white/[0.03]")}>{s}</button>)}</div></div>}
      </div>)}
    </div>
  );
}

export default function IncidentResponsePanel() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0, critical: 0, avgResolutionTime: "N/A" });
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [sev, setSev] = useState<IncidentSeverity>("P1-critical");
  const [desc, setDesc] = useState("");
  const [systems, setSystems] = useState("");
  const [creating, setCreating] = useState(false);
  const refresh = () => { setIncidents(getIncidentsList()); setStats(getIncidentStats()); };
  useEffect(refresh, []);
  const create = async () => { setCreating(true); try { await createIncident(title, sev, desc, systems.split(",").map((s) => s.trim()).filter(Boolean), "SOC Team", "security"); refresh(); setShowNew(false); setTitle(""); setDesc(""); setSystems(""); } finally { setCreating(false); } };
  const updateStatus = async (id: string, status: IncidentStatus) => { await updateIncidentStatus(id, status, "SOC Team", "security"); refresh(); };
  return (
    <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><AlertOctagon className="w-4 h-4 text-red-400" /> Incident Response Chain</h3>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20"><Plus className="w-3 h-3" /> New Incident</button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">{[ { l: "Total", v: stats.total, c: "text-white" }, { l: "Active", v: stats.active, c: "text-amber-400" }, { l: "Critical", v: stats.critical, c: "text-red-400" }, { l: "Resolved", v: stats.resolved, c: "text-emerald-400" } ].map((s) => <div key={s.l} className="bg-white/[0.03] border border-white/5 rounded-lg p-2 text-center"><div className="text-[10px] text-gray-500 uppercase">{s.l}</div><div className={cn("text-sm font-bold", s.c)}>{s.v}</div></div>)}</div>
      {showNew && <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-4 space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Incident title" className="w-full px-3 py-2 text-xs text-white bg-white/[0.06] border border-white/10 rounded-lg focus:outline-none focus:border-red-500" />
        <div className="flex gap-2">{(["P1-critical", "P2-high", "P3-medium", "P4-low"] as const).map((s) => <button key={s} onClick={() => setSev(s)} className={cn("flex-1 text-[10px] font-bold py-2 rounded-lg border transition-all", sev === s ? sevColors[s] : "border-white/5 bg-white/[0.03] text-gray-400")}>{s}</button>)}</div>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="w-full h-20 px-3 py-2 text-xs text-white bg-white/[0.06] border border-white/10 rounded-lg resize-none focus:outline-none focus:border-red-500" />
        <input value={systems} onChange={(e) => setSystems(e.target.value)} placeholder="Affected systems (comma separated)" className="w-full px-3 py-2 text-xs text-white bg-white/[0.06] border border-white/10 rounded-lg focus:outline-none focus:border-red-500" />
        <button onClick={create} disabled={creating || !title} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30 rounded-xl disabled:opacity-50">{creating ? "Creating & Anchoring..." : "Create Incident"}</button>
      </div>}
      {incidents.length === 0 ? <p className="text-xs text-gray-500 text-center py-4">No incidents yet.</p> : <div className="space-y-3">{incidents.map((inc) => <IncidentCard key={inc.id} inc={inc} onUpdate={updateStatus} />)}</div>}
    </div>
  );
}
