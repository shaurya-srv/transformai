"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Copy,
  Download,
  Trash2,
  Video,
  Share2,
  FileText,
  Shield,
  Presentation,
  Image,
  Wand2,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SavedOutput {
  id: string;
  title: string;
  format: string;
  category: string;
  source: string;
  saved: string;
  preview: string;
}

const formatIcons: Record<string, typeof Star> = {
  linkedin: Share2,
  executive: FileText,
  video: Video,
  advisory: Shield,
  presentation: Presentation,
  infographic: Image,
  twitter: Share2,
};

const categoryMap: Record<string, string> = {
  linkedin: "social",
  twitter: "social",
  executive: "documents",
  advisory: "briefings",
  presentation: "presentations",
  infographic: "presentations",
  video: "presentations",
};

const categories = [
  { id: "all", label: "All" },
  { id: "social", label: "Social" },
  { id: "documents", label: "Documents" },
  { id: "presentations", label: "Presentations" },
  { id: "briefings", label: "Briefings" },
];

export default function SavedOutputsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedOutputs, setSavedOutputs] = useState<SavedOutput[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setIsLoading(false);
          return;
        }

        // Fetch outputs that are saved
        const res = await fetch("/api/projects");
        if (!res.ok) {
          setIsLoading(false);
          return;
        }

        const { projects } = await res.json();
        if (!projects) {
          setIsLoading(false);
          return;
        }

        const outputs: SavedOutput[] = [];

        for (const project of projects) {
          for (const transformation of project.transformations || []) {
            for (const output of transformation.outputs || []) {
              if (output.is_saved) {
                outputs.push({
                  id: output.id,
                  title: output.title || `${output.format} — ${project.name}`,
                  format: output.format,
                  category: categoryMap[output.format] || "documents",
                  source: project.name,
                  saved: new Date(
                    project.created_at
                  ).toLocaleDateString(),
                  preview: `Generated from: ${project.name}`,
                });
              }
            }
          }
        }

        setSavedOutputs(outputs);
      } catch {
        // Use empty state
      } finally {
        setIsLoading(false);
      }
    }

    fetchSaved();
  }, []);

  const filtered =
    activeCategory === "all"
      ? savedOutputs
      : savedOutputs.filter((o) => o.category === activeCategory);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Saved Outputs</h1>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saved Outputs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your library of saved transformation outputs.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-white border border-gray-200 text-gray-400 hover:text-gray-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((output) => {
          const Icon = formatIcons[output.format] || FileText;
          return (
            <div
              key={output.id}
              className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {output.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    From: {output.source}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {output.preview}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  {output.saved}
                </span>
                <div className="flex items-center gap-1">
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
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No saved outputs
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Save outputs from your transformations to see them here.
          </p>
          <Link
            href="/app/transform"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/25"
          >
            <Wand2 className="w-4 h-4" />
            Start Transformation
          </Link>
        </div>
      )}
    </div>
  );
}
