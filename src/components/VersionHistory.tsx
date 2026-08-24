"use client";

import { useState } from "react";
import { History, ChevronDown, ChevronUp, RotateCw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OutputVersion {
  version: number;
  content: string;
  title: string;
  timestamp: string;
}

interface VersionHistoryProps {
  versions: OutputVersion[];
  currentVersion: number;
  onSelect: (version: number) => void;
}

export default function VersionHistory({
  versions,
  currentVersion,
  onSelect,
}: VersionHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  if (versions.length <= 1) return null;

  const sortedVersions = [...versions].sort(
    (a, b) => b.version - a.version
  );

  return (
    <div className="bg-[#12121a] rounded-xl border border-white/8 overflow-hidden mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold text-white">
            Version History
          </span>
          <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded-full bg-white/[0.06]">
            {versions.length} versions
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-white/5 p-3 space-y-1.5">
          {sortedVersions.map((v) => (
            <button
              key={v.version}
              onClick={() => onSelect(v.version)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                v.version === currentVersion
                  ? "bg-violet-500/10 border border-violet-500/20"
                  : "hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  v.version === currentVersion
                    ? "bg-violet-600 text-white"
                    : "bg-white/[0.06] text-gray-400 border border-white/10"
                )}
              >
                v{v.version}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      v.version === currentVersion
                        ? "text-white"
                        : "text-gray-300"
                    )}
                  >
                    Version {v.version}
                  </span>
                  {v.version === currentVersion && (
                    <span className="text-[9px] text-violet-300 px-1.5 py-0.5 rounded-full bg-violet-500/15">
                      Current
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500">
                  {v.timestamp}
                </span>
              </div>
              {v.version !== currentVersion && (
                <div className="flex items-center gap-1 text-[10px] text-violet-400">
                  <RotateCw className="w-3 h-3" />
                  Restore
                </div>
              )}
              {v.version === currentVersion && (
                <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Hook to manage version history for outputs
 */
export function useVersionHistory(initialContent: string, title: string) {
  const [versions, setVersions] = useState<OutputVersion[]>([
    {
      version: 1,
      content: initialContent,
      title,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [currentVersion, setCurrentVersion] = useState(1);

  const addVersion = (content: string, newTitle?: string) => {
    const newVer = versions.length + 1;
    const version: OutputVersion = {
      version: newVer,
      content,
      title: newTitle || title,
      timestamp: new Date().toLocaleTimeString(),
    };
    setVersions((prev) => [...prev, version]);
    setCurrentVersion(newVer);
    return newVer;
  };

  const restoreVersion = (versionNum: number) => {
    setCurrentVersion(versionNum);
    return versions.find((v) => v.version === versionNum);
  };

  const currentContent =
    versions.find((v) => v.version === currentVersion)?.content ||
    initialContent;

  return {
    versions,
    currentVersion,
    currentContent,
    addVersion,
    restoreVersion,
  };
}
