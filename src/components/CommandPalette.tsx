"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Wand2,
  FolderOpen,
  Clock,
  Layers,
  Star,
  Settings,
  Home,
  FileText,
  ArrowRight,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  category: string;
  shortcut?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    { id: "home", label: "Go to Dashboard", icon: Home, category: "Navigation", shortcut: "G D", action: () => { router.push("/app"); onClose(); } },
    { id: "transform", label: "New Transformation", description: "Start a new content transformation", icon: Wand2, category: "Navigation", shortcut: "G T", action: () => { router.push("/app/transform"); onClose(); } },
    { id: "projects", label: "View Projects", icon: FolderOpen, category: "Navigation", shortcut: "G P", action: () => { router.push("/app/projects"); onClose(); } },
    { id: "history", label: "Transformation History", icon: Clock, category: "Navigation", shortcut: "G H", action: () => { router.push("/app/history"); onClose(); } },
    { id: "templates", label: "Browse Templates", icon: Layers, category: "Navigation", shortcut: "G L", action: () => { router.push("/app/templates"); onClose(); } },
    { id: "saved", label: "Saved Outputs", icon: Star, category: "Navigation", shortcut: "G S", action: () => { router.push("/app/saved"); onClose(); } },
    { id: "settings", label: "Settings", icon: Settings, category: "Navigation", shortcut: "G ,", action: () => { router.push("/app/settings"); onClose(); } },

    // Actions
    { id: "new-advisory", label: "Quick: Generate Advisory", description: "Start with advisory template", icon: FileText, category: "Actions", action: () => { router.push("/app/transform"); onClose(); } },
    { id: "new-social", label: "Quick: Generate Social Post", description: "Start with LinkedIn/Twitter template", icon: FileText, category: "Actions", action: () => { router.push("/app/transform"); onClose(); } },
  ];

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = filtered.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd);
      return acc;
    },
    {} as Record<string, CommandItem[]>
  );

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        flatFiltered[selectedIndex]?.action();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [flatFiltered, selectedIndex, onClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0e0e16]/98 rounded-2xl shadow-2xl border border-white/10 z-10 animate-fade-in-up backdrop-blur-xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
          <Search className="w-5 h-5 text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, pages, actions..."
            className="flex-1 text-sm text-white placeholder:text-gray-500 outline-none bg-transparent"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-gray-500 font-mono border border-white/8">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {flatFiltered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No commands found</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-2">
                <div className="px-3 py-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {category}
                  </span>
                </div>
                {items.map((cmd) => {
                  const globalIndex = flatFiltered.indexOf(cmd);
                  return (
                    <button
                      key={cmd.id}
                      data-index={globalIndex}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                        globalIndex === selectedIndex
                          ? "bg-violet-500/15 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <cmd.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          globalIndex === selectedIndex ? "text-violet-400" : "text-gray-500"
                        )}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{cmd.label}</div>
                        {cmd.description && (
                          <div className="text-[11px] text-gray-500">{cmd.description}</div>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <div className="flex items-center gap-1">
                          {cmd.shortcut.split(" ").map((key, i) => (
                            <kbd
                              key={i}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-white/8 text-gray-500 font-mono border border-white/8"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                      {globalIndex === selectedIndex && (
                        <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/8 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-gray-500">
              <Command className="w-3 h-3" /> <kbd className="font-mono">K</kbd>
            </span>
            <span className="text-[10px] text-gray-600">to toggle</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
