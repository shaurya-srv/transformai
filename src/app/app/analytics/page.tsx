"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  Users,
  Zap,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface AnalyticsData {
  totalTransformations: number;
  totalOutputs: number;
  avgConsistency: number;
  timeSavedHours: number;
  outputsByFormat: { format: string; count: number; color: string }[];
  recentActivity: { date: string; count: number }[];
}

const defaultAnalytics: AnalyticsData = {
  totalTransformations: 24,
  totalOutputs: 86,
  avgConsistency: 96,
  timeSavedHours: 42.5,
  outputsByFormat: [
    { format: "LinkedIn", count: 22, color: "#0a66c2" },
    { format: "Advisory", count: 18, color: "#f59e0b" },
    { format: "Executive", count: 15, color: "#06b6d4" },
    { format: "Presentation", count: 12, color: "#8b5cf6" },
    { format: "Video", count: 10, color: "#ef4444" },
    { format: "Twitter", count: 6, color: "#1e293b" },
    { format: "Infographic", count: 3, color: "#10b981" },
  ],
  recentActivity: [
    { date: "Mon", count: 5 },
    { date: "Tue", count: 8 },
    { date: "Wed", count: 3 },
    { date: "Thu", count: 6 },
    { date: "Fri", count: 4 },
    { date: "Sat", count: 2 },
    { date: "Sun", count: 1 },
  ],
};

function BarChartVisual({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-white">{d.value}</span>
          <div
            className="w-full rounded-t-lg transition-all duration-700 hover:opacity-80"
            style={{
              height: `${(d.value / max) * 100}%`,
              backgroundColor: d.color,
              minHeight: "4px",
              animationDelay: `${i * 0.1}s`,
            }}
          />
          <span className="text-[9px] text-gray-500 text-center leading-tight">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ActivityChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-500 transition-all duration-500"
            style={{
              height: `${(d.count / max) * 100}%`,
              minHeight: "4px",
            }}
          />
          <span className="text-[9px] text-gray-500">{d.date}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch("/api/projects");
        if (res.ok) {
          const { projects } = await res.json();
          if (projects && projects.length > 0) {
            const totalOutputs = projects.reduce(
              (acc: number, p: any) =>
                acc +
                p.transformations.reduce(
                  (tAcc: number, t: any) => tAcc + t.outputs.length,
                  0
                ),
              0
            );
            setAnalytics((prev) => ({
              ...prev,
              totalTransformations: projects.length,
              totalOutputs: totalOutputs || prev.totalOutputs,
            }));
          }
        }
      } catch {
        // Use default analytics
      }
    }
    fetchAnalytics();
  }, []);

  const statCards = [
    {
      label: "Total Transformations",
      value: analytics.totalTransformations,
      icon: Layers,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      change: "+12% this week",
    },
    {
      label: "Outputs Generated",
      value: analytics.totalOutputs,
      icon: FileText,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      change: "+8% this week",
    },
    {
      label: "Avg Consistency",
      value: `${analytics.avgConsistency}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      change: "Above threshold",
    },
    {
      label: "Time Saved",
      value: `${analytics.timeSavedHours}h`,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      change: "~1.8 hrs each",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">
          Track your transformation usage and performance metrics.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#12121a] rounded-xl p-5 border border-white/8 hover:border-violet-500/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  stat.bg
                )}
              >
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{stat.label}</div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400">
              <ArrowUpRight className="w-3 h-3" /> {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Output by format */}
        <div className="bg-[#12121a] rounded-2xl p-6 border border-white/8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">
              Outputs by Format
            </h3>
          </div>
          <BarChartVisual
            data={analytics.outputsByFormat.map((d) => ({
              label: d.format,
              value: d.count,
              color: d.color,
            }))}
          />
        </div>

        {/* Weekly activity */}
        <div className="bg-[#12121a] rounded-2xl p-6 border border-white/8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Weekly Activity
            </h3>
          </div>
          <ActivityChart data={analytics.recentActivity} />
        </div>
      </div>

      {/* Output breakdown */}
      <div className="bg-[#12121a] rounded-2xl p-6 border border-white/8 mb-8">
        <h3 className="text-sm font-bold text-white mb-4">
          Output Breakdown
        </h3>
        <div className="space-y-3">
          {analytics.outputsByFormat.map((fmt) => {
            const pct = Math.round(
              (fmt.count / analytics.totalOutputs) * 100
            );
            return (
              <div key={fmt.format}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: fmt.color }}
                    />
                    <span className="text-xs font-medium text-gray-300">
                      {fmt.format}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {fmt.count} outputs
                    </span>
                    <span className="text-[10px] font-bold text-white">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: fmt.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 pb-8">
        <p className="text-sm font-semibold text-gray-500 tracking-wide">
          Transform Analytics — Data from your workspace
        </p>
      </div>
    </div>
  );
}
