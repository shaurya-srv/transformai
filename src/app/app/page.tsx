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

const stats = [
  {
    label: "Transformations",
    value: 24,
    suffix: "",
    icon: Layers,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    change: "+8 this week",
  },
  {
    label: "Outputs Generated",
    value: 86,
    suffix: "",
    icon: FileText,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    change: "+23 this week",
  },
  {
    label: "Time Saved",
    value: 14,
    suffix: ".2 hrs",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    change: "~31 min each",
  },
  {
    label: "Success Rate",
    value: 98,
    suffix: "%",
    icon: BarChart3,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    change: "Source-grounded",
  },
];

const recentTransformations = [
  {
    title: "Critical VPN Vulnerability Advisory",
    outputs: ["Video", "LinkedIn", "Advisory", "Exec Summary"],
    date: "2 minutes ago",
    icon: Shield,
    consistency: 96,
  },
  {
    title: "Q3 Security Policy Update",
    outputs: ["Executive Summary", "Advisory", "LinkedIn"],
    date: "Yesterday",
    icon: FileCheck,
    consistency: 91,
  },
  {
    title: "Global Incident Response Report",
    outputs: ["LinkedIn", "Thread", "Summary", "Slides"],
    date: "Aug 20",
    icon: Newspaper,
    consistency: 88,
  },
];

export default function AppDashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
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
              Turn information into communication-ready assets. Upload content, configure your
              audience and tone, select output formats, and let AI do the rest.
            </p>
          </div>
          <Link
            href="/app/transform"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20 shrink-0"
          >
            <Wand2 className="w-4 h-4" />
            Start New Transformation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-lg ${stat.bg} border ${stat.border}`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              <AnimatedValue end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[10px] text-gray-400 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Recent Transformations */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Recent Transformations</h3>
          <Link
            href="/app/history"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentTransformations.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 shrink-0">
                <item.icon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {item.outputs.length} outputs · {item.date}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.consistency >= 90
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  {item.consistency}%
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap justify-end max-w-[200px]">
                {item.outputs.slice(0, 3).map((type) => (
                  <span
                    key={type}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                  >
                    {type}
                  </span>
                ))}
                {item.outputs.length > 3 && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                    +{item.outputs.length - 3}
                  </span>
                )}
              </div>
              <Link
                href="/app/transform"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer tagline */}
      <div className="text-center mt-12 pb-8">
        <p className="text-sm font-semibold text-gray-400 tracking-wide">
          One Source. Infinite Communication.
        </p>
      </div>
    </div>
  );
}
