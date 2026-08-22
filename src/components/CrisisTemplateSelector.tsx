"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { crisisTemplates, getCategories, type CrisisTemplate } from "@/lib/crisisTemplates";

interface CrisisTemplateSelectorProps {
  onSelect: (template: CrisisTemplate) => void;
  onClose: () => void;
}

export default function CrisisTemplateSelector({ onSelect, onClose }: CrisisTemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = getCategories();

  const filteredTemplates = activeCategory
    ? crisisTemplates.filter((t) => t.category === activeCategory)
    : crisisTemplates;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Crisis Response Templates</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Pre-configured for common scenarios. Select a template to auto-fill source and settings.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="px-6 py-3 border-b border-slate-100 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              !activeCategory
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "text-slate-500 hover:bg-slate-50 border border-transparent"
            )}
          >
            All ({crisisTemplates.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                activeCategory === cat.id
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "text-slate-500 hover:bg-slate-50 border border-transparent"
              )}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className="text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.defaultOutputs.slice(0, 3).map((output) => (
                        <span
                          key={output}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                        >
                          {output}
                        </span>
                      ))}
                      {template.defaultOutputs.length > 3 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                          +{template.defaultOutputs.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-400 text-center">
            Templates auto-fill source content, audience settings, and output selection. You can customize everything after selection.
          </p>
        </div>
      </div>
    </div>
  );
}
