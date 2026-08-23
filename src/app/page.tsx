"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
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
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { AuroraBackground } from "@/components/AuroraBackground";
import { GlitchText } from "@/components/GlitchText";
import { TypewriterText } from "@/components/TypewriterText";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeroEffects } from "@/components/HeroEffects";
import { BeforeAfter, LiveMetrics, Testimonials, WorkflowPipeline } from "@/components/ProfessionalSections";

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

    // Mouse parallax for 3D tilt
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    return () => { observer.disconnect(); window.removeEventListener("scroll", handleScroll); window.removeEventListener("mousemove", handleMouse); };
  }, []);

  const translateY = 80 - scrollProgress * 80;
  const scale = 0.85 + scrollProgress * 0.15;
  const opacity = 0.3 + scrollProgress * 0.7;
  const glowIntensity = scrollProgress;

  // 3D tilt from mouse + scroll
  const rotateX = 8 - scrollProgress * 8 + mousePos.y * -3;
  const rotateY = mousePos.x * 5;
  const rotateZ = mousePos.x * -1;

  return (
    <div ref={ref} className="relative w-full flex items-center justify-center py-12" style={{ perspective: "1200px" }}>
      {/* Aurora glow behind device */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse, rgba(139,92,246,${0.25 * glowIntensity}) 0%, rgba(6,182,212,${0.18 * glowIntensity}) 35%, rgba(139,92,246,${0.08 * glowIntensity}) 55%, transparent 75%)`,
          filter: `blur(${60 + glowIntensity * 50}px)`,
          opacity: glowIntensity,
        }}
      />

      {/* Orbiting ring glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-violet-500/10 animate-spin-slow"
        style={{ opacity: glowIntensity * 0.4 }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-cyan-500/10 animate-spin-slow"
        style={{ opacity: glowIntensity * 0.3, animationDirection: "reverse", animationDuration: "12s" }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${3 + i}px`,
            height: `${3 + i}px`,
            background: i % 2 === 0 ? "rgba(139,92,246,0.4)" : "rgba(6,182,212,0.4)",
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 15}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            opacity: glowIntensity * 0.6,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Laptop frame with 3D transform */}
      <div
        className="relative z-10 transition-all duration-700 ease-out"
        style={{
          transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          transformStyle: "preserve-3d",
          opacity,
        }}
      >
        {/* Screen bezel */}
        <div
          className="relative bg-[#1a1a2e] rounded-t-2xl border border-white/10 border-b-0 overflow-hidden shadow-2xl shadow-black/50"
          style={{
            width: "min(820px, 90vw)",
            height: "min(500px, 55vw)",
            boxShadow: `0 25px 80px rgba(139,92,246,${0.15 * glowIntensity}), 0 10px 40px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Top bar (notch area) */}
          <div className="flex items-center justify-center h-7 bg-[#12121a] border-b border-white/5">
            <div className="w-20 h-1.5 rounded-full bg-white/10" />
          </div>

          {/* Screen content — Data-rich presentation dashboard */}
          <div className="w-full h-[calc(100%-1.75rem)] bg-[#0a0a0f] p-4 overflow-hidden">
            {/* App top bar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-cyan-500" />
              <span className="text-[10px] font-bold text-white/80">TransformAI</span>
              <div className="flex-1" />
              <div className="flex items-center gap-1.5">
                <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-[7px] text-emerald-400 border border-emerald-500/20">● Live</div>
                <div className="w-4 h-4 rounded bg-white/5" />
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-[6px] text-white font-bold">U</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {/* Sidebar */}
              <div className="w-28 shrink-0 space-y-1 hidden sm:block">
                {[{ n: "Dashboard", a: false }, { n: "Transform", a: true }, { n: "Projects", a: false }, { n: "Analytics", a: false }, { n: "Templates", a: false }, { n: "Settings", a: false }].map((item) => (
                  <div key={item.n} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[8px] ${item.a ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "text-white/25 hover:text-white/40"}`}>
                    <div className={`w-2.5 h-2.5 rounded-sm ${item.a ? "bg-violet-500/30" : "bg-white/8"}`} />
                    {item.n}
                  </div>
                ))}
              </div>

              {/* Main content — presentation view */}
              <div className="flex-1 space-y-2.5">
                {/* Title bar */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-white/90">CVE-2024-38816 — Security Advisory</div>
                    <div className="text-[7px] text-white/30">Generated 2 min ago · 7 deliverables · 96% accuracy</div>
                  </div>
                  <div className="flex gap-1">
                    <div className="px-1.5 py-0.5 rounded bg-white/5 text-[6px] text-white/30">Export</div>
                    <div className="px-1.5 py-0.5 rounded bg-violet-500/10 text-[6px] text-violet-400">Share</div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { l: "Outputs", v: "7", c: "#8b5cf6" },
                    { l: "Sources", v: "1", c: "#06b6d4" },
                    { l: "Accuracy", v: "96%", c: "#10b981" },
                    { l: "Consistency", v: "94%", c: "#10b981" },
                    { l: "Time Saved", v: "4.2h", c: "#f59e0b" },
                  ].map((s) => (
                    <div key={s.l} className="bg-white/[0.03] border border-white/5 rounded-lg p-1.5 text-center">
                      <div className="text-[6px] text-white/25 uppercase tracking-wider">{s.l}</div>
                      <div className="text-[11px] font-bold" style={{ color: s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {/* Two-column layout: Chart + Output list */}
                <div className="flex gap-2.5">
                  {/* Left: Mini chart */}
                  <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg p-2.5">
                    <div className="text-[7px] text-white/30 uppercase mb-2">Transformation Pipeline</div>
                    {/* Bar chart */}
                    <div className="flex items-end gap-1 h-16">
                      {[65, 82, 45, 90, 72, 88, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                          <div
                            className="w-full rounded-t-sm"
                            style={{
                              height: `${h}%`,
                              background: `linear-gradient(to top, rgba(139,92,246,${0.3 + i * 0.08}), rgba(6,182,212,${0.2 + i * 0.05}))`,
                            }}
                          />
                          <div className="text-[5px] text-white/20">{["Lin", "X", "Adv", "Vid", "Pre", "Inf", "Exe"][i]}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Output list */}
                  <div className="w-[45%] space-y-1.5">
                    {[
                      { icon: "📱", name: "LinkedIn Post", words: "284", status: "done" },
                      { icon: "🐦", name: "X/Twitter Thread", words: "180", status: "done" },
                      { icon: "📋", name: "Security Advisory", words: "1,240", status: "done" },
                      { icon: "🎬", name: "Video Script", words: "890", status: "done" },
                      { icon: "📊", name: "Presentation (6 slides)", words: "1,100", status: "done" },
                      { icon: "🖼️", name: "Infographic Spec", words: "320", status: "done" },
                      { icon: "📄", name: "Executive Summary", words: "560", status: "done" },
                    ].map((o) => (
                      <div key={o.name} className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg px-2 py-1.5">
                        <span className="text-[9px]">{o.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[7px] font-medium text-white/50 truncate">{o.name}</div>
                        </div>
                        <div className="text-[6px] text-white/20">{o.words}w</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom: Consistency score bar */}
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-1.5">
                  <div className="text-[7px] text-white/30">Consistency</div>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" style={{ width: "94%" }} />
                  </div>
                  <div className="text-[7px] font-bold text-emerald-400">94%</div>
                  <div className="text-[6px] text-white/20">|</div>
                  <div className="text-[7px] text-white/30">Source Grounding</div>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full" style={{ width: "96%" }} />
                  </div>
                  <div className="text-[7px] font-bold text-emerald-400">96%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop base */}
        <div className="relative" style={{ transform: "translateZ(-1px)" }}>
          <div className="bg-[#1a1a2e] h-3 rounded-b-xl border border-white/10 border-t-0" style={{ width: "calc(min(820px, 90vw) + 20px)", marginLeft: "-10px" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

// ── Showcase Slideshow ────────────────────────────────────────────────
function ShowcaseSlideshow() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      tag: "THE PROBLEM",
      title: "One source. Seven deliverables. Every time.",
      desc: "Paste any source — articles, reports, incidents, policies. TransformAI understands the content and generates all formats simultaneously from a shared context.",
      visual: (
        <div className="relative w-full h-48 flex items-center justify-center">
          <div className="absolute w-[120px] h-[120px] rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-violet-500/20 animate-node-pulse">
            <div className="text-center">
              <Layers className="w-8 h-8 text-white mx-auto mb-1" />
              <span className="text-[10px] font-bold text-white">SOURCE</span>
            </div>
          </div>
          {[
            { x: -160, y: -60, label: "LinkedIn", color: "#0a66c2" },
            { x: 160, y: -60, label: "Advisory", color: "#f59e0b" },
            { x: -160, y: 60, label: "Video", color: "#ef4444" },
            { x: 160, y: 60, label: "Slides", color: "#8b5cf6" },
            { x: 0, y: -90, label: "X Thread", color: "#94a3b8" },
            { x: 0, y: 90, label: "Infographic", color: "#10b981" },
            { x: -200, y: 0, label: "Exec Summary", color: "#06b6d4" },
          ].map((n, i) => (
            <div key={i} className="absolute animate-fade-in" style={{ left: `calc(50% + ${n.x}px)`, top: `calc(50% + ${n.y}px)`, animationDelay: `${i * 0.15}s` }}>
              <div className="px-2 py-1 rounded-lg text-[8px] font-bold backdrop-blur-sm" style={{ background: `${n.color}15`, border: `1px solid ${n.color}30`, color: n.color }}>
                {n.label}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      tag: "LINKEDIN OUTPUT",
      title: "Professional posts. Ready to publish.",
      desc: "Hook, body, call-to-action, and hashtags — all generated from the source with perfect factual accuracy.",
      visual: (
        <div className="w-full max-w-md mx-auto">
          <div className="bg-[#12121a] rounded-xl border border-white/10 p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
              <div>
                <div className="text-[10px] font-bold text-white/80">Your Company</div>
                <div className="text-[7px] text-white/30">Cybersecurity · 2h</div>
              </div>
            </div>
            <div className="space-y-2 text-[9px] text-white/50 leading-relaxed">
              <p className="text-white/70">🚨 <span className="font-bold text-white/80">Critical Security Alert: VPN Vulnerability Under Active Attack</span></p>
              <p>A severe remote code execution vulnerability (CVE-2024-38816, CVSS 9.8) has been found in NovaTech SecureConnect VPN Gateway — and it&apos;s already being exploited.</p>
              <div className="space-y-1">
                <p>📌 Affects versions 4.2.0 through 4.5.3</p>
                <p>📌 Unauthenticated code execution</p>
                <p>📌 Active exploitation confirmed</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {"#CyberSecurity #VPN #InfoSec #CVE2024".split(" ").map((h) => (
                  <span key={h} className="text-[7px] text-cyan-400/70">{h}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      tag: "CONSISTENCY SCORING",
      title: "Prove every output is accurate.",
      desc: "Our engine compares all outputs against the source and each other — flagging contradictions, missing facts, and hallucinations.",
      visual: (
        <div className="w-full max-w-md mx-auto space-y-3">
          {[
            { name: "LinkedIn Post", grounding: 94, consistency: 96, issues: 0 },
            { name: "Advisory", grounding: 98, consistency: 97, issues: 0 },
            { name: "Video Script", grounding: 91, consistency: 93, issues: 1 },
            { name: "Presentation", grounding: 95, consistency: 94, issues: 0 },
          ].map((o) => (
            <div key={o.name} className="bg-[#12121a] rounded-lg border border-white/10 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-white/70">{o.name}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${o.issues === 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                  {o.issues === 0 ? "✓ Validated" : `⚠ ${o.issues} issue`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[6px] text-white/25 mb-1">Source Grounding</div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" style={{ width: `${o.grounding}%` }} />
                  </div>
                  <div className="text-[7px] text-emerald-400 mt-0.5">{o.grounding}%</div>
                </div>
                <div>
                  <div className="text-[6px] text-white/25 mb-1">Cross-Output Consistency</div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full" style={{ width: `${o.consistency}%` }} />
                  </div>
                  <div className="text-[7px] text-emerald-400 mt-0.5">{o.consistency}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      tag: "PRESENTATION OUTPUT",
      title: "Board-ready slides. Generated in seconds.",
      desc: "Full PowerPoint decks with speaker notes, branded styling, and structured content — downloaded as real .pptx files.",
      visual: (
        <div className="w-full max-w-md mx-auto">
          <div className="flex gap-3">
            {/* Slide thumbnails */}
            <div className="space-y-2 shrink-0">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className={`w-16 h-10 rounded-md border ${n === 1 ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 bg-white/5"} flex items-center justify-center`}>
                  <span className="text-[7px] text-white/30">{n}</span>
                </div>
              ))}
            </div>
            {/* Main slide */}
            <div className="flex-1 bg-[#12121a] rounded-xl border border-white/10 p-4 shadow-xl">
              <div className="text-[10px] font-bold text-white/80 mb-2">CVE-2024-38816</div>
              <div className="text-[8px] font-semibold text-white/60 mb-3">Critical VPN Vulnerability — Immediate Response Required</div>
              <div className="space-y-1.5">
                {["CVSS 9.8 — Critical Severity", "Affects 11 versions (4.2.0 → 4.5.3)", "Patch available: v4.5.4", "Active exploitation confirmed"].map((point) => (
                  <div key={point} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-violet-400" />
                    <span className="text-[7px] text-white/40">{point}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[6px] text-white/20">Speaker: "This briefing addresses a critical security vulnerability..."</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      tag: "MULTI-FORMAT",
      title: "One click. Every format.",
      desc: "Select LinkedIn, Advisory, Video, Presentation, Infographic, X Thread, and Executive Summary — all generated simultaneously.",
      visual: (
        <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-2">
          {[
            { icon: "📱", name: "LinkedIn Post", words: "284 words", color: "#0a66c2" },
            { icon: "🐦", name: "X/Twitter Thread", words: "180 words", color: "#94a3b8" },
            { icon: "📋", name: "Security Advisory", words: "1,240 words", color: "#f59e0b" },
            { icon: "🎬", name: "Video Script", words: "890 words", color: "#ef4444" },
            { icon: "📊", name: "Presentation", words: "6 slides", color: "#8b5cf6" },
            { icon: "🖼️", name: "Infographic Spec", words: "320 words", color: "#10b981" },
          ].map((o) => (
            <div key={o.name} className="bg-[#12121a] rounded-lg border border-white/10 p-3 flex items-center gap-2.5 hover:border-white/20 transition-all cursor-default">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${o.color}15`, border: `1px solid ${o.color}25` }}>
                <span className="text-sm">{o.icon}</span>
              </div>
              <div>
                <div className="text-[9px] font-medium text-white/70">{o.name}</div>
                <div className="text-[7px] text-white/30">{o.words}</div>
              </div>
              <div className="ml-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, nextSlide]);

  const current = slides[activeSlide];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            See TransformAI <span className="gradient-text">in action</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explore how a single source becomes seven professional deliverables — with built-in accuracy scoring.
          </p>
        </div>

        {/* Slideshow container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Tag + Title area */}
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Text content */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-400 font-bold uppercase tracking-wider mb-4 w-fit">
                  {current.tag}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4 whitespace-pre-line">
                  {current.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {current.desc}
                </p>
              </div>

              {/* Right: Visual */}
              <div className="p-6 lg:p-8 flex items-center justify-center bg-white/[0.02] border-l border-white/5">
                <div className="w-full animate-fade-in" key={activeSlide}>
                  {current.visual}
                </div>
              </div>
            </div>

            {/* Bottom bar: navigation + progress */}
            <div className="flex items-center gap-4 px-8 py-4 border-t border-white/5">
              <button onClick={prevSlide} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                ←
              </button>
              <button onClick={nextSlide} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                →
              </button>

              <div className="flex-1 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className="flex-1 h-1 rounded-full overflow-hidden transition-all"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: i === activeSlide ? "100%" : "0%",
                        background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                      }}
                    />
                  </button>
                ))}
              </div>

              <span className="text-[10px] text-white/30 font-mono">
                {activeSlide + 1}/{slides.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
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
    <div className="min-h-screen bg-[#0a0a0f] grid-bg noise relative">
      <AuroraBackground />
      <ParticleCanvas />
      <Navbar />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-0 px-6 overflow-hidden">
        <HeroEffects />
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
              <GlitchText text="ONE SOURCE." />
              <br />
              <span className="gradient-text"><GlitchText text="INFINITE" /></span>
              <br />
              <GlitchText text="COMMUNICATION." />
            </h1>

            <div className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed h-6">
              <TypewriterText
                texts={[
                  "Transform complex information into publication-ready content.",
                  "One source. Seven deliverables. Seconds.",
                  "AI-powered content transformation engine.",
                  "From incident reports to LinkedIn posts instantly.",
                ]}
              />
            </div>

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

      {/* ═══ SHOWCASE SLIDESHOW ════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={100}>
        <ShowcaseSlideshow />
      </ScrollReveal>

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

n      {/* ═══ BEFORE / AFTER ═══════════════════════════════════════════ */}
      <BeforeAfter />
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

n      {/* ═══ WORKFLOW PIPELINE ════════════════════════════════════════ */}
      <WorkflowPipeline />
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

n      {/* ═══ LIVE METRICS ═════════════════════════════════════════════ */}
      <LiveMetrics />
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

n      {/* ═══ TESTIMONIALS ═════════════════════════════════════════════ */}
      <Testimonials />
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
