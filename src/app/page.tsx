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

// ── Hero Visualization ───────────────────────────────────────────────────
function HeroVisualization() {
  const outputs = [
    { icon: Video, label: "VIDEO", angle: -60, color: "#ef4444" },
    { icon: Share2, label: "LINKEDIN", angle: -30, color: "#0a66c2" },
    { icon: MessageSquare, label: "X THREAD", angle: 0, color: "#94a3b8" },
    { icon: Shield, label: "ADVISORY", angle: 30, color: "#f59e0b" },
    { icon: Image, label: "INFOGRAPHIC", angle: 60, color: "#10b981" },
    { icon: Presentation, label: "PRESENTATION", angle: 90, color: "#8b5cf6" },
    { icon: FileText, label: "EXEC SUMMARY", angle: 120, color: "#06b6d4" },
  ];

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
      {/* Background glows */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[300px] h-[300px] bg-violet-500/15 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[200px] h-[200px] bg-cyan-500/15 rounded-full blur-[100px]" />
      </div>

      {/* Center source node */}
      <div className="relative z-10">
        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-violet-500/30 animate-node-pulse">
          <div className="text-center">
            <Layers className="w-7 h-7 text-white mx-auto mb-1" />
            <span className="text-xs font-bold text-white">SOURCE</span>
          </div>
        </div>

        {/* Orbiting output nodes */}
        {outputs.map((output, i) => {
          const radius = 180;
          const rad = (output.angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          return (
            <div
              key={output.label}
              className="absolute animate-fade-in-up"
              style={{
                left: `calc(50% + ${x}px - 36px)`,
                top: `calc(50% + ${y}px - 24px)`,
                animationDelay: `${i * 0.12}s`,
              }}
            >
              {/* Connection line */}
              <svg
                className="absolute"
                style={{
                  left: 36 - x,
                  top: 24 - y,
                  width: Math.abs(x) + 10,
                  height: Math.abs(y) + 10,
                  overflow: "visible",
                  pointerEvents: "none",
                }}
              >
                <line
                  x1={x > 0 ? 0 : Math.abs(x)}
                  y1={y > 0 ? 0 : Math.abs(y)}
                  x2={x > 0 ? Math.abs(x) : 0}
                  y2={y > 0 ? Math.abs(y) : 0}
                  stroke={output.color}
                  strokeWidth="1"
                  opacity="0.3"
                  strokeDasharray="4 4"
                />
              </svg>

              <Link
                href="/signup"
                className="w-[72px] h-[48px] rounded-xl flex items-center justify-center gap-1.5 backdrop-blur-sm transition-all hover:scale-110 cursor-pointer shadow-lg"
                style={{
                  background: `${output.color}15`,
                  border: `1px solid ${output.color}30`,
                  boxShadow: `0 0 20px ${output.color}15`,
                  animation: `float ${4 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                <output.icon
                  className="w-3.5 h-3.5"
                  style={{ color: output.color }}
                />
                <span
                  className="text-[8px] font-bold"
                  style={{ color: output.color }}
                >
                  {output.label}
                </span>
              </Link>
            </div>
          );
        })}
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
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Content Transformation
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                ONE SOURCE.
                <br />
                <span className="gradient-text">INFINITE</span>
                <br />
                COMMUNICATION.
              </h1>

              <p className="text-lg text-gray-400 max-w-lg mb-8 leading-relaxed">
                Transform complex information into publication-ready content,
                briefings, advisories, presentations and multimedia — powered
                by AI.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
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

            {/* Right: Visualization */}
            <div className="hidden lg:block animate-fade-in-up stagger-2">
              <HeroVisualization />
            </div>
          </div>
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
