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
  Menu,
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

function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-200">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-sm font-bold text-gray-900">TransformAI</span>
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
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "w-4.5 h-4.5 shrink-0",
                  isActive ? "text-blue-600" : "text-gray-400"
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
          className="hidden lg:flex items-center justify-center w-full py-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors mb-2"
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed ? "-rotate-90" : "rotate-90"
            )}
          />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={onMobileClose} />
          <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-gray-200 z-50 lg:hidden shadow-xl">
            <div className="flex items-center justify-end px-3 pt-3">
              <button onClick={onMobileClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut: Cmd/Ctrl+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setShowHelp(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const notifications = [
    { id: 1, text: "Transformation completed: Cybersecurity Advisory", time: "2m ago", unread: true },
    { id: 2, text: "New template available: Incident Report", time: "1h ago", unread: true },
    { id: 3, text: "LinkedIn post export ready for download", time: "3h ago", unread: false },
    { id: 4, text: "System maintenance scheduled for Sunday", time: "1d ago", unread: false },
  ];

  const searchSuggestions = [
    { label: "New Transformation", action: () => { router.push("/app/transform"); setShowSearch(false); } },
    { label: "View Projects", action: () => { router.push("/app/projects"); setShowSearch(false); } },
    { label: "Browse Templates", action: () => { router.push("/app/templates"); setShowSearch(false); } },
    { label: "Transformation History", action: () => { router.push("/app/history"); setShowSearch(false); } },
    { label: "Saved Outputs", action: () => { router.push("/app/saved"); setShowSearch(false); } },
    { label: "Settings", action: () => { router.push("/app/settings"); setShowSearch(false); } },
  ];

  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchSuggestions;

  return (
    <>
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-14 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 z-30 flex items-center px-4 gap-3">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden text-gray-400 hover:text-gray-700 p-1"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all w-full max-w-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
          </button>
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-900">Notifications</span>
                  <span className="text-xs text-blue-600 cursor-pointer hover:text-blue-700">Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${n.unread ? "bg-blue-50/50" : ""}`}>
                      <p className="text-sm text-gray-900 leading-snug">{n.text}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help */}
        <div className="relative">
          <button
            onClick={() => { setShowHelp(!showHelp); setShowProfile(false); }}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            ?
          </button>
          {showHelp && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowHelp(false)} />
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5 animate-fade-in">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Help & Resources</h3>
                <div className="space-y-2">
                  <button onClick={() => { router.push("/app/transform"); setShowHelp(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    🚀 Quick Start Guide
                  </button>
                  <button onClick={() => setShowHelp(false)} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    📖 Documentation
                  </button>
                  <button onClick={() => setShowHelp(false)} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    💬 Contact Support
                  </button>
                  <button onClick={() => setShowHelp(false)} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    ⌨️ Keyboard Shortcuts
                  </button>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400">TransformAI v1.0 — Smart India Hackathon 2026</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowHelp(false); }}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                  {user?.organization && <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.organization}</p>}
                </div>
                <div className="py-1">
                  <Link
                    href="/app/settings"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/app/settings"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => { logout(); setShowProfile(false); }}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>

    {/* Search Modal */}
    {showSearch && (
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 z-10 animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, templates, pages..."
              className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
            />
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-mono">ESC</kbd>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={s.action}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2"
                >
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                  {s.label}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No results found</p>
            )}
          </div>
        </div>
      </div>
    )}
    </>
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-sm text-gray-500">Loading TransformAI...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 grid-bg">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <TopBar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
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
