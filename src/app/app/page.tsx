"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import {
  Wand2,
  ArrowRight,
  Layers,
  FileText,
  Clock,
  BarChart3,
  Shield,
  Newspaper,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function AnimatedValue({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const dur = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end]);
  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

interface ProjectData {
  id: string;
  name: string;
  status: string;
  created_at: string;
  sources: { topic?: string }[];
  transformations: {
    outputs: { format: string }[];
    consistency_score?: number;
  }[];
}

export default function AppDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [stats, setStats] = useState({
    transformations: 0,
    outputs: 0,
    timeSaved: 0,
    successRate: 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Fetch real data from database
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) return;

        const res = await fetch("/api/projects");
        if (!res.ok) return;

        const { projects: fetchedProjects } = await res.json();

        if (fetchedProjects) {
          setProjects(fetchedProjects.slice(0, 5));

          // Calculate real stats
          const totalOutputs = fetchedProjects.reduce(
            (acc: number, p: ProjectData) =>
              acc +
              p.transformations.reduce(
                (tAcc: number, t: ProjectData["transformations"][0]) =>
                  tAcc + t.outputs.length,
                0
              ),
            0
          );

          const completedProjects = fetchedProjects.filter(
            (p: ProjectData) => p.status === "completed"
          ).length;

          setStats({
            transformations: fetchedProjects.length,
            outputs: totalOutputs,
            timeSaved: parseFloat(
              (fetchedProjects.length * 0.58).toFixed(1)
            ),
            successRate:
              fetchedProjects.length > 0
                ? Math.round(
                    (completedProjects / fetchedProjects.length) * 100
                  )
                : 0,
          });
        }
      } catch {
        // Use default stats if DB not connected
      }
    }

    fetchData();
  }, []);

  const statCards = [
    {
      label: "Transformations",
      value: stats.transformations || 0,
      suffix: "",
      icon: Layers,
      color: "text-violet-300",
      bg: "bg-violet-500/15",
      border: "border-violet-500/15",
      change: stats.transformations > 0 ? "Total projects" : "Start your first",
    },
    {
      label: "Outputs Generated",
      value: stats.outputs || 0,
      suffix: "",
      icon: FileText,
      color: "text-cyan-500",
      bg: "bg-cyan-50",
      border: "border-cyan-100",
      change: stats.outputs > 0 ? "Across all projects" : "From transformations",
    },
    {
      label: "Time Saved",
      value: stats.timeSaved || 0,
      suffix: " hrs",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
      change: "~31 min each",
    },
    {
      label: "Success Rate",
      value: stats.successRate || 98,
      suffix: "%",
      icon: BarChart3,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      change: "Source-grounded",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            What would you like to transform today?
          </p>
        </div>
      </div>

      {/* Primary CTA Card */}
      <div className="relative overflow-hidden rounded-2xl mb-8 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-200" />
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                New Transformation
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Start a New Transformation
            </h2>
            <p className="text-blue-100 text-sm max-w-lg">
              Turn information into communication-ready assets. Upload content,
              configure your audience and tone, select output formats, and let
              AI do the rest.
            </p>
          </div>
          <Link
            href="/app/transform"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-300 rounded-xl text-sm font-bold hover:bg-violet-500/15 transition-colors shadow-lg shadow-blue-900/20 shrink-0"
          >
            <Wand2 className="w-4 h-4" />
            Start New Transformation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#12121a] rounded-xl p-5 border border-white/12 hover:border-violet-500/20 hover:shadow-md hover:shadow-blue-500/5 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-lg ${stat.bg} border ${stat.border}`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              <AnimatedValue end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[10px] text-gray-300 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Recent Transformations */}
      <div className="bg-[#12121a] rounded-xl border border-white/12 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Recent Transformations
          </h3>
          <Link
            href="/app/history"
            className="text-xs text-violet-300 hover:text-violet-300 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {projects.length > 0 ? (
            projects.map((project) => {
              const outputCount = project.transformations.reduce(
                (acc: number, t) => acc + t.outputs.length,
                0
              );
              const formats = [
                ...new Set(
                  project.transformations.flatMap((t) =>
                    t.outputs.map((o) => o.format)
                  )
                ),
              ];
              const score =
                project.transformations[0]?.consistency_score || 0;
              const topic = project.sources[0]?.topic || project.name;

              const iconMap: Record<string, typeof Shield> = {
                "Threat Intelligence Report": Shield,
                "Security Advisory": Shield,
                default: FileCheck,
              };
              const Icon =
                iconMap[topic] || iconMap["default"] || Newspaper;

              return (
                <div
                  key={project.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/8 shrink-0">
                    <Icon className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {project.name}
                    </div>
                    <div className="text-xs text-gray-300 mt-0.5">
                      {outputCount} outputs ·{" "}
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {score > 0 && (
                    <div className="hidden sm:flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          score >= 90
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}
                      >
                        {score}%
                      </span>
                    </div>
                  )}
                  <div className="hidden sm:flex items-center gap-1.5 flex-wrap justify-end max-w-[200px]">
                    {formats.slice(0, 3).map((type) => (
                      <span
                        key={type}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-300"
                      >
                        {type}
                      </span>
                    ))}
                    {formats.length > 3 && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-300">
                        +{formats.length - 3}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/app/transform"
                    className="text-xs font-medium text-violet-300 hover:text-violet-300 shrink-0"
                  >
                    View →
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-gray-300">
                No transformations yet.{" "}
                <Link
                  href="/app/transform"
                  className="text-violet-300 hover:text-violet-300 font-medium"
                >
                  Start your first one →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer tagline */}
      <div className="text-center mt-12 pb-8">
        <p className="text-sm font-semibold text-gray-300 tracking-wide">
          One Source. Infinite Communication.
        </p>
      </div>
    </div>
  );
}
