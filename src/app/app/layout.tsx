"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wand2,
  FolderOpen,
  Clock,
  Layers,
  Star,
  Settings,
  Zap,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Loader2,
  X,
} from "lucide-react";

const navItems = [
  { href: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/app/transform", label: "New Transformation", icon: Wand2 },
  { href: "/app/projects", label: "Projects", icon: FolderOpen },
  { href: "/app/history", label: "History", icon: Clock },
  { href: "/app/templates", label: "Templates", icon: Layers },
  { href: "/app/saved", label: "Saved Outputs", icon: Star },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-surface border-r border-white/5 z-40 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-sm font-bold text-white">TransformAI</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && pathname !== "/app";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-violet-500/15 text-violet-400 border border-violet-500/20"
                  : "text-text-secondary hover:text-white hover:bg-white/[0.04]"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "w-4.5 h-4.5 shrink-0",
                  isActive ? "text-violet-400" : "text-text-tertiary"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-text-tertiary hover:text-white hover:bg-white/[0.04] transition-colors mb-2"
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed ? "-rotate-90" : "rotate-90"
            )}
          />
        </button>
      </div>
    </aside>
  );
}

function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-14 bg-surface/80 backdrop-blur-xl border-b border-white/5 z-30 flex items-center px-4 gap-3">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden text-text-secondary hover:text-white p-1"
      >
        <LayoutDashboard className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-sm text-text-tertiary hover:text-text-secondary hover:border-white/10 transition-all w-full max-w-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-tertiary">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-text-tertiary hover:text-white hover:bg-white/[0.04] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </button>

        {/* Help */}
        <button className="p-2 rounded-lg text-text-tertiary hover:text-white hover:bg-white/[0.04] transition-colors text-sm font-medium">
          ?
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-text-tertiary" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl shadow-xl py-1 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-text-tertiary truncate">
                    {user?.email}
                  </p>
                </div>
                <Link
                  href="/app/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/[0.04] transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-3.5 h-3.5" />
                  Profile
                </Link>
                <Link
                  href="/app/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/[0.04] transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </Link>
                <div className="border-t border-white/5 mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface/90 backdrop-blur-xl border-t border-white/5 z-40 flex items-center justify-around px-2">
      {navItems.slice(0, 5).map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href) && pathname !== "/app";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors",
              isActive ? "text-violet-400" : "text-text-tertiary"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-medium">{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          <span className="text-sm text-text-secondary">Loading TransformAI...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <TopBar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
      <MobileNav />
      <main
        className={cn(
          "min-h-screen pt-14 pb-16 lg:pb-0 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
