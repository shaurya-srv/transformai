"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  FolderOpen,
  Plus,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Copy,
  Wand2,
} from "lucide-react";

const mockProjects = [
  {
    id: "1",
    name: "Critical VPN Vulnerability Advisory",
    source: "incident.pdf",
    outputs: 4,
    formats: ["Video", "LinkedIn", "Advisory", "Exec Summary"],
    created: "Today, 2:30 PM",
    status: "completed" as const,
  },
  {
    id: "2",
    name: "Q3 Security Policy Update",
    source: "policy.docx",
    outputs: 3,
    formats: ["Executive Summary", "Advisory", "LinkedIn"],
    created: "Yesterday, 10:15 AM",
    status: "completed" as const,
  },
  {
    id: "3",
    name: "Global Incident Response Report",
    source: "text",
    outputs: 4,
    formats: ["LinkedIn", "Thread", "Summary", "Slides"],
    created: "Aug 20, 3:45 PM",
    status: "completed" as const,
  },
  {
    id: "4",
    name: "Cloud Migration Research Paper",
    source: "research.pdf",
    outputs: 3,
    formats: ["Executive Summary", "Presentation", "Infographic"],
    created: "Aug 18, 11:00 AM",
    status: "completed" as const,
  },
  {
    id: "5",
    name: "Workplace Safety Announcement",
    source: "text",
    outputs: 2,
    formats: ["Advisory", "LinkedIn"],
    created: "Aug 15, 9:30 AM",
    status: "completed" as const,
  },
];

const statusColors = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  processing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  draft: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = mockProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage all your transformation projects.
          </p>
        </div>
        <Link
          href="/app/transform"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-white/10 rounded-xl text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["all", "completed", "processing", "draft"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "bg-violet-500/15 text-violet-400 border border-violet-500/20"
                  : "bg-surface border border-white/5 text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="glass rounded-xl p-5 hover:bg-card-hover transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <FolderOpen className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] text-text-tertiary">
                      Source: {project.source}
                    </span>
                    <span className="text-text-tertiary">·</span>
                    <span className="text-[10px] text-text-tertiary">
                      {project.created}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {project.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] text-text-secondary"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    statusColors[project.status]
                  }`}
                >
                  {project.status}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg text-text-tertiary hover:text-white hover:bg-white/[0.06] transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FolderOpen className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No projects found</h3>
          <p className="text-sm text-text-secondary mb-4">
            {search ? "Try a different search term." : "Start your first transformation."}
          </p>
          <Link
            href="/app/transform"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all"
          >
            <Wand2 className="w-4 h-4" />
            New Transformation
          </Link>
        </div>
      )}
    </div>
  );
}
