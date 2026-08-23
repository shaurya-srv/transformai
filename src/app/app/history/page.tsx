"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Clock,
  Copy,
  Trash2,
  Download,
  Wand2,
  Layers,
  Shield,
  FileCheck,
  Newspaper,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HistoryItem {
  id: string;
  name: string;
  outputs: number;
  date: string;
  icon: typeof Shield;
  period: string;
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<
    { period: string; items: HistoryItem[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
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

        const { projects } = await res.json();

        if (!projects || projects.length === 0) {
          setHistoryData([]);
          setIsLoading(false);
          return;
        }

        // Group by date period
        const now = new Date();
        const today = now.toDateString();
        const yesterday = new Date(now.getTime() - 86400000).toDateString();

        const iconMap: Record<string, typeof Shield> = {
          Shield,
          FileCheck,
          Newspaper,
          default: Layers,
        };

        const grouped: Record<string, HistoryItem[]> = {};

        for (const project of projects) {
          const projectDate = new Date(project.created_at);
          const dateStr = projectDate.toDateString();

          let period: string;
          if (dateStr === today) period = "Today";
          else if (dateStr === yesterday) period = "Yesterday";
          else
            period = projectDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            });

          if (!grouped[period]) grouped[period] = [];

          const outputCount = project.transformations?.reduce(
            (acc: number, t: { outputs: unknown[] }) =>
              acc + (t.outputs?.length || 0),
            0
          ) || 0;

          grouped[period].push({
            id: project.id,
            name: project.name,
            outputs: outputCount,
            date: projectDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
            icon: iconMap[project.name] || iconMap["default"],
            period,
          });
        }

        const result = Object.entries(grouped).map(([period, items]) => ({
          period,
          items,
        }));

        setHistoryData(result);
      } catch {
        // Use empty state
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-sm text-gray-500 mt-1">
            Chronological record of all transformations.
          </p>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Chronological record of all transformations.
        </p>
      </div>

      {historyData.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No history yet
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Your transformation history will appear here.
          </p>
          <Link
            href="/app/transform"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/25"
          >
            <Wand2 className="w-4 h-4" /> Start Transformation
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {historyData.map((group) => (
            <div key={group.period}>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {group.period}
              </h2>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {item.outputs} outputs · {item.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button className="px-3 py-1.5 text-[11px] font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        Open
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
