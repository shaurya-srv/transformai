"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  FolderOpen,
  Plus,
  Copy,
  Trash2,
  Wand2,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProjectData {
  id: string;
  name: string;
  status: string;
  created_at: string;
  sources: { topic?: string }[];
  transformations: {
    outputs: { format: string }[];
  }[];
}

const statusColors: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  processing: "bg-amber-50 text-amber-600 border-amber-200",
  draft: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/projects");
        if (!res.ok) {
          setIsLoading(false);
          return;
        }

        const { projects: fetchedProjects } = await res.json();
        if (fetchedProjects) {
          setProjects(fetchedProjects);
        }
      } catch {
        // Use empty state
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your transformation projects.
          </p>
        </div>
        <Link
          href="/app/transform"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["all", "completed", "processing", "draft"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-white border border-gray-200 text-gray-400 hover:text-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4">
        {filtered.map((project) => {
          const outputCount = project.transformations?.reduce(
            (acc: number, t) => acc + (t.outputs?.length || 0),
            0
          ) || 0;

          const formats = [
            ...new Set(
              project.transformations?.flatMap((t) =>
                t.outputs?.map((o) => o.format) || []
              ) || []
            ),
          ];

          return (
            <div
              key={project.id}
              className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] text-gray-400">
                        {outputCount} outputs
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {formats.slice(0, 5).map((fmt) => (
                        <span
                          key={fmt}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
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
                      statusColors[project.status] || statusColors.draft
                    }`}
                  >
                    {project.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {search
              ? "Try a different search term."
              : "Start your first transformation."}
          </p>
          <Link
            href="/app/transform"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/25"
          >
            <Wand2 className="w-4 h-4" />
            New Transformation
          </Link>
        </div>
      )}
    </div>
  );
}
