"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Copy,
  Trash2,
  ExternalLink,
  Download,
  Wand2,
  Layers,
  Shield,
  FileCheck,
  Newspaper,
} from "lucide-react";

const historyData = [
  {
    period: "Today",
    items: [
      {
        id: "1",
        title: "Critical VPN Vulnerability Advisory",
        outputs: 4,
        time: "2:41 PM",
        icon: Shield,
      },
    ],
  },
  {
    period: "Yesterday",
    items: [
      {
        id: "2",
        title: "Market Intelligence Brief",
        outputs: 3,
        time: "4:15 PM",
        icon: Layers,
      },
      {
        id: "3",
        title: "Policy Announcement — WFH Revision",
        outputs: 5,
        time: "10:30 AM",
        icon: FileCheck,
      },
    ],
  },
  {
    period: "August 20",
    items: [
      {
        id: "4",
        title: "Global Incident Response Report",
        outputs: 4,
        time: "3:45 PM",
        icon: Newspaper,
      },
      {
        id: "5",
        title: "Cloud Migration Research Paper",
        outputs: 3,
        time: "11:00 AM",
        icon: Layers,
      },
    ],
  },
  {
    period: "August 18",
    items: [
      {
        id: "6",
        title: "Workplace Safety Announcement",
        outputs: 2,
        time: "9:30 AM",
        icon: Shield,
      },
    ],
  },
];

export default function HistoryPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-sm text-text-secondary mt-1">
          Chronological record of all transformations.
        </p>
      </div>

      <div className="space-y-8">
        {historyData.map((group) => (
          <div key={group.period}>
            <h2 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">
              {group.period}
            </h2>
            <div className="space-y-2">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-card-hover transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-text-tertiary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-text-tertiary mt-0.5">
                      {item.outputs} outputs · {item.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button className="px-3 py-1.5 text-[11px] font-medium text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors">
                      Open
                    </button>
                    <button className="p-1.5 rounded-lg text-text-tertiary hover:text-white hover:bg-white/[0.06] transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-text-tertiary hover:text-white hover:bg-white/[0.06] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
