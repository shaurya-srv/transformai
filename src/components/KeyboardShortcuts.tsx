"use client";

import { useEffect } from "react";
import { X, Keyboard } from "lucide-react";

const shortcuts = [
  {
    category: "Navigation",
    items: [
      { keys: ["⌘", "K"], desc: "Open command palette" },
      { keys: ["G", "→", "D"], desc: "Go to Dashboard" },
      { keys: ["G", "→", "T"], desc: "Go to Transform" },
      { keys: ["G", "→", "P"], desc: "Go to Projects" },
      { keys: ["G", "→", "H"], desc: "Go to History" },
      { keys: ["G", "→", "S"], desc: "Go to Settings" },
    ],
  },
  {
    category: "Transform",
    items: [
      { keys: ["Enter"], desc: "Analyze source / Transform" },
      { keys: ["Esc"], desc: "Go back one step" },
      { keys: ["⌘", "D"], desc: "Load demo" },
      { keys: ["⌘", "E"], desc: "Export current output" },
      { keys: ["⌘", "C"], desc: "Copy current output" },
    ],
  },
  {
    category: "Results",
    items: [
      { keys: ["←", "→"], desc: "Switch between outputs" },
      { keys: ["⌘", "S"], desc: "Save output" },
      { keys: ["⌘", "R"], desc: "Regenerate output" },
      { keys: ["⌘", "E"], desc: "Export output" },
    ],
  },
  {
    category: "General",
    items: [
      { keys: ["?"], desc: "Show keyboard shortcuts" },
      { keys: ["Esc"], desc: "Close modal / panel" },
      { keys: ["⌘", "/"], desc: "Toggle help" },
    ],
  },
];

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcuts({
  open,
  onClose,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-[#0e0e16] rounded-2xl shadow-2xl border border-white/10 z-10 animate-fade-in-up backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-[11px] text-gray-500">
                Navigate faster with shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {shortcuts.map((group) => (
              <div key={group.category}>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                  {group.category}
                </h3>
                <div className="space-y-2">
                  {group.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-sm text-gray-300">
                        {item.desc}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.keys.map((key, ki) => (
                          <span key={ki} className="flex items-center gap-1">
                            <kbd className="text-[11px] px-2 py-1 rounded-md bg-white/[0.06] border border-white/10 text-gray-400 font-mono min-w-[24px] text-center">
                              {key}
                            </kbd>
                            {ki < item.keys.length - 1 && (
                              <span className="text-gray-600 text-xs">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/8 bg-white/[0.02] text-center">
          <p className="text-[11px] text-gray-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-gray-400 font-mono">?</kbd> anywhere to show this panel
          </p>
        </div>
      </div>
    </div>
  );
}
