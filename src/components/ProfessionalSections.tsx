"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, ArrowRight, Check, X, Clock, Users, FileText, TrendingUp, Shield, Sparkles } from "lucide-react";

// ═══ TRUSTED BY LOGOS ═══════════════════════════════════════════════════
export function TrustedBy() {
  const logos = [
    "Google", "Microsoft", "Amazon", "Meta", "Salesforce",
    "Deloitte", "IBM", "Oracle", "SAP", "Cisco",
  ];

  return (
    <section className="py-16 px-6 border-b border-white/5">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-8 font-medium">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((name) => (
            <div
              key={name}
              className="text-white/15 hover:text-white/30 transition-colors duration-300 text-lg font-bold tracking-tight"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══ BEFORE / AFTER COMPARISON ══════════════════════════════════════════
export function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, x)));
  };

  useEffect(() => {
    const up = () => { isDragging.current = false; };
    const move = (e: MouseEvent) => handleMove(e.clientX);
    const touchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchend", up);
    window.addEventListener("touchmove", touchMove);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchmove", touchMove);
    };
  }, []);

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-4">
            <Clock className="w-3 h-3" /> Time Comparison
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Hours vs <span className="gradient-text">Seconds</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Drag the slider to see the difference between manual content creation and TransformAI.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden border border-white/10 cursor-col-resize select-none"
          onMouseDown={() => { isDragging.current = true; }}
          onTouchStart={() => { isDragging.current = true; }}
        >
          <div className="flex h-[320px] md:h-[400px]">
            {/* BEFORE (Manual) */}
            <div
              className="relative bg-[#12121a] p-6 md:p-10 flex flex-col justify-center overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-transparent" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold mb-4">
                  <X className="w-3 h-3" /> BEFORE
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Manual Process</h3>
                <div className="space-y-3">
                  {[
                    { time: "45 min", task: "Read & understand source document" },
                    { time: "2 hours", task: "Write LinkedIn post draft" },
                    { time: "1.5 hours", task: "Create security advisory" },
                    { time: "3 hours", task: "Build presentation slides" },
                    { time: "1 hour", task: "Write executive summary" },
                    { time: "2 hours", task: "Create video script" },
                    { time: "30 min", task: "Review & fix inconsistencies" },
                  ].map((item) => (
                    <div key={item.task} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-red-400/70 w-14 shrink-0">{item.time}</span>
                      <span className="text-xs text-gray-400">{item.task}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-bold text-red-400">Total: ~10.5 hours</span>
                </div>
              </div>
            </div>

            {/* AFTER (TransformAI) */}
            <div
              className="relative bg-[#12121a] p-6 md:p-10 flex flex-col justify-center overflow-hidden"
              style={{ width: `${100 - sliderPos}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 to-cyan-950/10" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold mb-4">
                  <Check className="w-3 h-3" /> AFTER
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">With TransformAI</h3>
                <div className="space-y-3">
                  {[
                    { time: "10 sec", task: "Upload source document" },
                    { time: "5 sec", task: "AI analyzes & extracts context" },
                    { time: "15 sec", task: "Select output formats" },
                    { time: "30 sec", task: "All 7 deliverables generated" },
                    { time: "—", task: "Consistency scoring applied" },
                    { time: "—", task: "Source grounding verified" },
                    { time: "—", task: "Ready to export & publish" },
                  ].map((item) => (
                    <div key={item.task} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-emerald-400/70 w-14 shrink-0">{item.time}</span>
                      <span className="text-xs text-gray-300">{item.task}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">Total: ~1 minute</span>
                  <span className="text-[10px] text-emerald-400/50 ml-1">(630x faster)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white/30 cursor-col-resize z-20"
            style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-3 rounded-full bg-white/50" />
                <div className="w-0.5 h-3 rounded-full bg-white/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══ LIVE METRICS ═══════════════════════════════════════════════════════
export function LiveMetrics() {
  const metrics = [
    { label: "Transformations Completed", value: 12847, icon: Zap, color: "#8b5cf6", suffix: "" },
    { label: "Hours Saved This Month", value: 3420, icon: Clock, color: "#06b6d4", suffix: "h" },
    { label: "Deliverables Generated", value: 89929, icon: FileText, color: "#10b981", suffix: "" },
    { label: "Active Teams", value: 567, icon: Users, color: "#f59e0b", suffix: "" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-4">
            <TrendingUp className="w-3 h-3" /> Live Platform Metrics
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Real impact, <span className="gradient-text">real numbers</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="glass-card rounded-2xl p-6 text-center group hover:border-white/15 transition-all">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}
              >
                <m.icon className="w-5 h-5" style={{ color: m.color }} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                <AnimatedNumber value={m.value} />{m.suffix}
              </div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, value]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// ═══ TESTIMONIALS ═══════════════════════════════════════════════════════
export function Testimonials() {
  const testimonials = [
    {
      quote: "TransformAI cut our incident response communication time from 4 hours to under 2 minutes. The consistency across all outputs is remarkable.",
      name: "Sarah Chen",
      role: "CISO, TechVault Security",
      avatar: "SC",
      color: "#8b5cf6",
    },
    {
      quote: "We use it for every policy update now. One document goes in, and we get advisory, executive brief, and employee comms out. Game changer.",
      name: "Marcus Rivera",
      role: "Head of Comms, NovaCorp",
      avatar: "MR",
      color: "#06b6d4",
    },
    {
      quote: "The consistency scoring alone is worth it. No more embarrassing contradictions between our LinkedIn post and the official advisory.",
      name: "Priya Sharma",
      role: "VP Marketing, SecureNet",
      avatar: "PS",
      color: "#10b981",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-400 font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3 h-3" /> What Teams Say
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Loved by <span className="gradient-text">communication teams</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card rounded-2xl p-6 flex flex-col">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed flex-1 mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ background: `${t.color}30`, border: `1px solid ${t.color}40` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-[10px] text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══ WORKFLOW PIPELINE ══════════════════════════════════════════════════
export function WorkflowPipeline() {
  const steps = [
    { icon: FileText, label: "Source", desc: "Paste text, upload file, or add URL", color: "#8b5cf6" },
    { icon: Sparkles, label: "Analyze", desc: "AI extracts context & key facts", color: "#06b6d4" },
    { icon: Users, label: "Configure", desc: "Set audience, tone, and style", color: "#10b981" },
    { icon: Zap, label: "Generate", desc: "All outputs created simultaneously", color: "#f59e0b" },
    { icon: Shield, label: "Validate", desc: "Consistency & accuracy scoring", color: "#ef4444" },
    { icon: TrendingUp, label: "Deliver", desc: "Export, share, or publish", color: "#8b5cf6" },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-300 font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3 h-3" /> Automated Workflow
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            The <span className="gradient-text">pipeline</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From raw information to publication-ready deliverables in six automated steps.
          </p>
        </div>

        <div className="relative">
          {/* Animated connecting line with glow */}
          <div className="absolute top-[52px] left-[8%] right-[8%] h-[3px] hidden md:block" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.4), rgba(6,182,212,0.4), rgba(139,92,246,0.4))" }} />
          {/* Animated glow on the line */}
          <div className="absolute top-[50px] left-[8%] right-[8%] h-[7px] hidden md:block" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15), rgba(139,92,246,0.15))", filter: "blur(4px)" }} />
          {/* Data flow dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-[49px] hidden md:block"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "radial-gradient(circle, #8b5cf6 0%, #06b6d4 100%)",
                boxShadow: "0 0 12px rgba(139,92,246,0.6), 0 0 24px rgba(6,182,212,0.3)",
                animation: `data-flow 3s linear infinite`,
                animationDelay: `${i * 1}s`,
                left: "8%",
              }}
            />
          ))}

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-2">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center text-center group">
                {/* Step number */}
                <div className="text-[9px] font-bold text-white/20 mb-2 tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Icon node with glow */}
                <div className="relative mb-4">
                  {/* Outer glow ring */}
                  <div
                    className="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${step.color}20 0%, transparent 70%)` }}
                  />
                  {/* Node */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}20, ${step.color}08)`,
                      border: `1.5px solid ${step.color}40`,
                      boxShadow: `0 0 25px ${step.color}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
                    }}
                  >
                    <step.icon className="w-7 h-7" style={{ color: step.color }} />
                  </div>
                  {/* Pulse dot */}
                  <div
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full z-20"
                    style={{
                      background: step.color,
                      boxShadow: `0 0 8px ${step.color}80`,
                      animation: `pulse-dot 2s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                </div>

                {/* Label */}
                <div className="text-sm font-bold text-white mb-1 group-hover:text-white transition-colors">{step.label}</div>
                <div className="text-[10px] text-gray-400 leading-snug max-w-[110px]">{step.desc}</div>

                {/* Mobile arrow */}
                {i < steps.length - 1 && (
                  <div className="md:hidden mt-3 flex items-center gap-1">
                    <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes data-flow {
          0% { left: 8%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 88%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
