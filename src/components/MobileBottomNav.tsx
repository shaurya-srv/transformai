"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wand2, FolderOpen, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Home", icon: Home, exact: true },
  { href: "/app/transform", label: "Transform", icon: Wand2 },
  { href: "/app/projects", label: "Projects", icon: FolderOpen },
  { href: "/app/history", label: "History", icon: Clock },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/8 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && pathname !== "/app";
          const isTransform = item.href === "/app/transform";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all min-w-[56px]",
                isTransform
                  ? "text-violet-400"
                  : isActive
                  ? "text-white"
                  : "text-gray-500"
              )}
            >
              {isTransform ? (
                <div className="w-10 h-10 -mt-5 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-white" : "text-gray-500"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[9px] font-medium",
                  isTransform
                    ? "text-violet-400"
                    : isActive
                    ? "text-white"
                    : "text-gray-500"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
