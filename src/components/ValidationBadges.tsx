"use client";

import { ShieldCheck, GitBranch, FileCheck } from "lucide-react";

export default function ValidationBadges() {
  const checks = [
    { icon: ShieldCheck, label: "Source Grounded" },
    { icon: GitBranch, label: "Consistency Checked" },
    { icon: FileCheck, label: "Format Validated" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {checks.map((check) => (
        <div
          key={check.label}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full"
        >
          <check.icon className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">
            {check.label}
          </span>
        </div>
      ))}
    </div>
  );
}
