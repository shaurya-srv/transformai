"use client";

import Link from "next/link";
import {
  Layers,
  Newspaper,
  Shield,
  FileText,
  Presentation,
  BarChart3,
  Zap,
  ArrowRight,
} from "lucide-react";

const templates = [
  {
    id: "breaking-news",
    name: "Breaking News",
    description: "Rapidly communicate breaking developments across multiple channels.",
    icon: Newspaper,
    outputs: ["LinkedIn", "X Thread", "Video"],
    color: "#ef4444",
    category: "Communication",
  },
  {
    id: "threat-intel",
    name: "Threat Intelligence",
    description: "Transform threat intelligence into advisories and executive briefings.",
    icon: Shield,
    outputs: ["Advisory", "Executive Summary", "Presentation"],
    color: "#f59e0b",
    category: "Security",
  },
  {
    id: "research-paper",
    name: "Research Paper",
    description: "Convert research findings into presentations and visual infographics.",
    icon: BarChart3,
    outputs: ["Presentation", "Infographic", "Executive Summary"],
    color: "#06b6d4",
    category: "Research",
  },
  {
    id: "incident-report",
    name: "Incident Report",
    description: "Transform incident reports into coordinated response communications.",
    icon: Shield,
    outputs: ["Advisory", "Social Posts", "Executive Summary"],
    color: "#ef4444",
    category: "Incident",
  },
  {
    id: "policy-document",
    name: "Policy Document",
    description: "Turn policy documents into clear briefings and presentations.",
    icon: FileText,
    outputs: ["Executive Brief", "Presentation", "LinkedIn"],
    color: "#8b5cf6",
    category: "Policy",
  },
  {
    id: "market-report",
    name: "Market Report",
    description: "Transform market analysis into executive summaries and social content.",
    icon: BarChart3,
    outputs: ["Executive Summary", "LinkedIn", "Infographic"],
    color: "#10b981",
    category: "Business",
  },
];

export default function TemplatesPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Templates</h1>
        <p className="text-sm text-text-secondary mt-1">
          Start faster with pre-configured transformation templates.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="glass rounded-2xl p-6 hover:bg-card-hover transition-all group cursor-pointer"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{
                  background: `${template.color}15`,
                  border: `1px solid ${template.color}25`,
                }}
              >
                <template.icon
                  className="w-6 h-6"
                  style={{ color: template.color }}
                />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                  {template.category}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {template.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              {template.description}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              {template.outputs.map((fmt) => (
                <span
                  key={fmt}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] text-text-secondary"
                >
                  {fmt}
                </span>
              ))}
            </div>

            <Link
              href="/app/transform"
              className="inline-flex items-center gap-2 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Use Template
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
