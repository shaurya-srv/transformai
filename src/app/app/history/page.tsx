"use client";

import Link from "next/link";
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
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Chronological record of all transformations.
        </p>
      </div>

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
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {item.outputs} outputs · {item.time}
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
    </div>
  );
}
