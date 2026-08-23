"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Zap,
  ArrowRight,
  FileText,
  Video,
  Share2,
  Shield,
  Presentation,
  Image,
  MessageSquare,
  ChevronRight,
  Check,
  Upload,
  Brain,
  Layers,
  Sparkles,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

// ── Floating Nav ─────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            TransformAI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Platform", id: "platform" },
            { label: "Workflow", id: "how-it-works" },
            { label: "Capabilities", id: "platform" },
            { label: "Templates", id: null, href: "/app/templates" },
          ].map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => item.id && scrollTo(item.id)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 px-4 py-2 rounded-lg transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center gap-2"
          >
            Launch Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Laptop Mockup ─────────────────────────────────────────────────────
function LaptopMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const rect = el.getBoundingClientRect();
          const viewportH = window.innerHeight;
          const progress = Math.max(0, Math.min(1, 1 - rect.top / viewportH));
          setScrollProgress(progress);
        }
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );
    observer.observe(el);

    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, 1 - (rect.top - viewportH * 0.3) / (viewportH * 0.5)));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", handleScroll); };
  }, []);

  const translateY = 80 - scrollProgress * 80;
  const scale = 0.85 + scrollProgress * 0.15;
  const opacity = 0.3 + scrollProgress * 0.7;
  const glowIntensity = scrollProgress;

  return (
    <div ref={ref} className="relative w-full flex items-center justify-center py-12">
      {/* Aurora glow behind device */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse, rgba(139,92,246,${0.2 * glowIntensity}) 0%, rgba(6,182,212,${0.15 * glowIntensity}) 40%, transparent 70%)`,
          filter: `blur(${60 + glowIntensity * 40}px)`,
          opacity: glowIntensity,
        }}
      />

      {/* Secondary glow pulse */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full animate-glow-pulse"
        style={{
          background: `radial-gradient(circle, rgba(139,92,246,${0.15 * glowIntensity}) 0%, transparent 70%)`,
          filter: "blur(40px)",
          opacity: glowIntensity * 0.6,
        }}
      />

      {/* Laptop frame */}
      <div
        className="relative z-10 transition-all duration-700 ease-out"
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
        }}
      >
        {/* Screen bezel */}
        <div className="relative bg-[#1a1a2e] rounded-t-2xl border border-white/10 border-b-0 overflow-hidden shadow-2xl shadow-black/50" style={{ width: "min(820px, 90vw)", height: "min(500px, 55vw)" }}>
          {/* Top bar (notch area) */}
          <div className="flex items-center justify-center h-7 bg-[#12121a] border-b border-white/5">
            <div className="w-20 h-1.5 rounded-full bg-white/10" />
          </div>

          {/* Screen content — TransformAI app UI */}
          <div className="w-full h-[calc(100%-1.75rem)] bg-[#0a0a0f] p-4 overflow-hidden">
            {/* App top bar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-cyan-500" />
              <span className="text-[10px] font-bold text-white/80">TransformAI</span>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white/5" />
                <div className="w-4 h-4 rounded bg-white/5" />
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-[6px] text-white font-bold">U</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {/* Sidebar */}
              <div className="w-32 shrink-0 space-y-1.5 hidden sm:block">
                {["Overview", "New Transform", "Projects", "History", "Templates"].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9px] ${i === 1 ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "text-white/30"}`}>
                    <div className={`w-3 h-3 rounded ${i === 1 ? "bg-violet-500/30" : "bg-white/10"}`} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 space-y-3">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Outputs", value: "24", color: "violet" },
                    { label: "Sources", value: "8", color: "cyan" },
                    { label: "Accuracy", value: "96%", color: "emerald" },
                    { label: "Time Saved", value: "14h", color: "amber" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/[0.03] border border-white/5 rounded-lg p-2">
                      <div className="text-[7px] text-white/30 uppercase">{stat.label}</div>
                      <div className={`text-sm font-bold text-${stat.color}-400`}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Source input area */}
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-2 py-0.5 rounded bg-violet-500/10 text-[7px] text-violet-400 border border-violet-500/20">Text</div>
                    <div className="px-2 py-0.5 rounded bg-white/5 text-[7px] text-white/30">URL</div>
                    <div className="px-2 py-0.5 rounded bg-white/5 text-[7px] text-white/30">Upload</div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-md p-2 h-16">
                    <div className="text-[8px] text-white/20 leading-relaxed">
                      CRITICAL SECURITY ADVISORY — Active exploitation detected in VPN infrastructure. CVE-2024-38816, CVSS 9.8...
                    </div>
                  </div>
                </div>

                {/* Output cards */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "📱", name: "LinkedIn Post", status: "Ready", color: "emerald" },
                    { icon: "🎬", name: "Video Package", status: "Ready", color: "emerald" },
                    { icon: "📋", name: "Advisory", status: "Ready", color: "emerald" },
                    { icon: "📊", name: "Presentation", status: "Ready", color: "emerald" },
                  ].map((output) => (
                    <div key={output.name} className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-lg p-2">
                      <span className="text-[10px]">{output.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[8px] font-medium text-white/60 truncate">{output.name}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span className="text-[7px] text-emerald-400">{output.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop base */}
        <div className="relative">
          <div className="bg-[#1a1a2e] h-3 rounded-b-xl border border-white/10 border-t-0" style={{ width: "calc(min(820px, 90vw) + 20px)", marginLeft: "-10px" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

// ── Animated Counter ─────────────────────────────────────────────────────
function AnimatedCounter({
  end,
  suffix = "",
}: {
  end: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ── Main Landing Page ────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-bg noise">
      <Navbar />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-0 px-6 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Centered headline */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Content Transformation
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              ONE SOURCE.
              <br />
              <span className="gradient-text">INFINITE</span>
              <br />
              COMMUNICATION.
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Transform complex information into publication-ready content,
              briefings, advisories, presentations and multimedia — powered
              by AI.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:translate-y-[-1px]"
              >
                Start Transforming
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm"
              >
                See How It Works
              </button>
            </div>

            {/* Floating metric */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-xs text-gray-400">7 formats</span>
              </div>
              <span className="text-white/20">·</span>
              <span className="text-xs text-gray-400">1 source</span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-cyan-400 font-semibold">seconds</span>
            </div>
          </div>

          {/* Device showcase with scroll animation */}
          <LaptopMockup />
        </div>
      </section>

      {/* ═══ PROBLEM ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Information isn&apos;t the problem.
            <br />
            <span className="gradient-text">Transformation is.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
            Organizations drown in information but starve for communication.
            TransformAI bridges that gap.
          </p>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Left: Input types */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Your Sources
              </h3>
              {["Articles", "Reports", "Research", "Threat Intel", "Policies", "Incidents"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {item}
                  </div>
                )
              )}
            </div>

            {/* Middle: The problem */}
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Manual Process
                </h3>
                {["Analysis", "Writing", "Formatting", "Editing", "Repurposing"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {item}
                    </div>
                  )
                )}
              </div>
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-amber-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-semibold">Hours of Work</span>
                </div>
              </div>
            </div>

            {/* Right: TransformAI */}
            <div className="glass-card rounded-2xl p-6 space-y-3 border-violet-500/20">
              <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-4">
                With TransformAI
              </h3>
              {["Analyze", "Understand", "Transform", "Deliver"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {item}
                  </div>
                )
              )}
              <div className="text-center pt-4">
                <div className="inline-flex items-center gap-2 text-cyan-400">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-semibold">Seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Four steps from source to professional communication assets.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "INGEST",
                desc: "Bring your information.",
                icon: Upload,
                details: ["PDF, DOCX, PPTX", "Paste text", "Add URL", "Upload media"],
                color: "violet",
              },
              {
                num: "02",
                title: "UNDERSTAND",
                desc: "AI extracts what matters.",
                icon: Brain,
                details: ["Context & intent", "Key entities", "Audience analysis", "Topic mapping"],
                color: "cyan",
              },
              {
                num: "03",
                title: "TRANSFORM",
                desc: "Choose what you need.",
                icon: Layers,
                details: ["Select outputs", "Configure tone", "Set audience", "Define style"],
                color: "violet",
              },
              {
                num: "04",
                title: "DELIVER",
                desc: "Get communication-ready assets.",
                icon: Sparkles,
                details: ["Video scripts", "Social posts", "Advisories", "Presentations"],
                color: "cyan",
              },
            ].map((step, i) => (
              <div key={step.num} className="relative group">
                <div className="glass-card rounded-2xl p-6 h-full transition-all hover:border-violet-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-3xl font-black ${
                        step.color === "violet" ? "text-violet-500/30" : "text-cyan-500/30"
                      }`}
                    >
                      {step.num}
                    </span>
                    <step.icon
                      className={`w-5 h-5 ${
                        step.color === "violet" ? "text-violet-400" : "text-cyan-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{step.desc}</p>
                  <div className="space-y-2">
                    {step.details.map((d) => (
                      <div key={d} className="flex items-center gap-2 text-xs text-gray-500">
                        <Check className="w-3 h-3 text-emerald-400" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="w-5 h-5 text-white/10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CAPABILITIES ═══════════════════════════════════════════════ */}
      <section id="platform" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              One Source.
              <br />
              <span className="gradient-text-cyan">Every Format.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Transform a single source into seven professional communication
              formats, each optimized for its channel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Video, title: "Video Package", desc: "Scripts, storyboards, scene descriptions, narration, and subtitles.", color: "#ef4444" },
              { icon: Share2, title: "LinkedIn Post", desc: "Professional, publication-ready social content with insights.", color: "#0a66c2" },
              { icon: MessageSquare, title: "X / Twitter Thread", desc: "Optimized posts and threads for maximum engagement.", color: "#94a3b8" },
              { icon: Shield, title: "Advisory", desc: "Structured professional advisory with prioritized actions.", color: "#f59e0b" },
              { icon: Image, title: "Infographic", desc: "Visual hierarchy, key statistics, and design specifications.", color: "#10b981" },
              { icon: FileText, title: "Executive Summary", desc: "Concise leadership briefing with decision points.", color: "#06b6d4" },
              { icon: Presentation, title: "Presentation", desc: "Slide decks with speaker notes, ready for delivery.", color: "#8b5cf6" },
            ].map((fmt) => (
              <div
                key={fmt.title}
                className="glass-card rounded-2xl p-6 group cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${fmt.color}15`, border: `1px solid ${fmt.color}25` }}
                >
                  <fmt.icon className="w-5 h-5" style={{ color: fmt.color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{fmt.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{fmt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: 7, suffix: "", label: "Output Formats", icon: Layers },
                { value: 96, suffix: "%", label: "Context Accuracy", icon: TrendingUp },
                { value: 85, suffix: "%", label: "Time Saved", icon: Clock },
                { value: 500, suffix: "+", label: "Transformations", icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Turn information
            <br />
            <span className="gradient-text">into impact.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
            Transform once. Communicate everywhere.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:translate-y-[-2px]"
          >
            Launch TransformAI
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-6">
            Built for teams that move information at speed.
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="py-8 px-6 border-t border-white/5 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">TransformAI</span>
          </div>
          <p className="text-xs text-gray-500">
            One Source. Infinite Communication.
          </p>
          <div className="flex gap-6">
            {[
              { label: "Platform", href: "#platform" },
              { label: "Templates", href: "/app/templates" },
              { label: "API", href: "#" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
