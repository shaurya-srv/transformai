"use client";

import { useEffect, useState } from "react";
import { Video, Share2, MessageSquare, Shield, Image, Presentation, FileText } from "lucide-react";

const outputCards = [
  { icon: Video, label: "Video Package", color: "#ef4444", x: 3, y: 18, rotation: -12 },
  { icon: Share2, label: "LinkedIn Post", color: "#0a66c2", x: 82, y: 12, rotation: 8 },
  { icon: MessageSquare, label: "X Thread", color: "#94a3b8", x: 2, y: 68, rotation: 6 },
  { icon: Shield, label: "Advisory", color: "#f59e0b", x: 84, y: 65, rotation: -8 },
  { icon: Image, label: "Infographic", color: "#10b981", x: 6, y: 42, rotation: 10 },
  { icon: Presentation, label: "Presentation", color: "#8b5cf6", x: 86, y: 40, rotation: -6 },
  { icon: FileText, label: "Exec Summary", color: "#06b6d4", x: 48, y: 5, rotation: 3 },
];

export function HeroEffects() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* ═══ LARGE GLOWING ORBS ═══════════════════════════════════════ */}
      <div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: "10%", left: "15%",
          background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-float-1 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: "20%", right: "10%",
          background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)",
          filter: "blur(50px)",
          animation: "orb-float-2 10s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          bottom: "5%", left: "30%",
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.08) 50%, transparent 70%)",
          filter: "blur(70px)",
          animation: "orb-float-3 12s ease-in-out infinite",
        }}
      />

      {/* ═══ ORBITING RINGS ═══════════════════════════════════════════ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Outer ring */}
        <div
          className="w-[600px] h-[600px] rounded-full"
          style={{
            border: "1px solid rgba(139,92,246,0.15)",
            animation: "spin-slow 25s linear infinite",
          }}
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
        </div>
        {/* Middle ring */}
        <div
          className="absolute inset-[60px] rounded-full"
          style={{
            border: "1px solid rgba(6,182,212,0.12)",
            animation: "spin-slow 18s linear infinite reverse",
          }}
        >
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
        </div>
        {/* Inner ring */}
        <div
          className="absolute inset-[130px] rounded-full"
          style={{
            border: "1px dashed rgba(139,92,246,0.08)",
            animation: "spin-slow 30s linear infinite",
          }}
        />
      </div>

      {/* ═══ FLOATING OUTPUT CARDS ════════════════════════════════════ */}
      {outputCards.map((card, i) => (
        <div
          key={card.label}
          className="absolute hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-xl border transition-all hover:scale-110 cursor-default z-10"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            background: `linear-gradient(135deg, ${card.color}15, ${card.color}08)`,
            borderColor: `${card.color}30`,
            boxShadow: `0 0 30px ${card.color}15, 0 8px 32px rgba(0,0,0,0.3)`,
            transform: `rotate(${card.rotation}deg)`,
            animation: `card-float-${i % 3} ${5 + i * 0.5}s ease-in-out infinite, fade-in-up 0.8s ease-out forwards`,
            animationDelay: `${i * 0.15}s, ${i * 0.1}s`,
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${card.color}20` }}
          >
            <card.icon className="w-4 h-4" style={{ color: card.color }} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-white/90">{card.label}</div>
            <div className="text-[8px] text-white/40">Ready to use</div>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
        </div>
      ))}

      {/* ═══ SCAN LINE EFFECT ═════════════════════════════════════════ */}
      <div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.3) 20%, rgba(6,182,212,0.4) 50%, rgba(139,92,246,0.3) 80%, transparent 100%)",
          animation: "scan-line 4s ease-in-out infinite",
          filter: "blur(1px)",
        }}
      />

      {/* ═══ GRID OVERLAY ═════════════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      <style jsx>{`
        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, 30px) scale(1.1); }
          66% { transform: translate(-30px, -20px) scale(0.95); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 40px) scale(1.08); }
          66% { transform: translate(40px, -30px) scale(0.92); }
        }
        @keyframes orb-float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -40px); }
        }
        @keyframes card-float-0 {
          0%, 100% { transform: rotate(var(--rotation, 0deg)) translateY(0); }
          50% { transform: rotate(var(--rotation, 0deg)) translateY(-12px); }
        }
        @keyframes card-float-1 {
          0%, 100% { transform: rotate(var(--rotation, 0deg)) translateY(0) translateX(0); }
          33% { transform: rotate(var(--rotation, 0deg)) translateY(-8px) translateX(5px); }
          66% { transform: rotate(var(--rotation, 0deg)) translateY(4px) translateX(-3px); }
        }
        @keyframes card-float-2 {
          0%, 100% { transform: rotate(var(--rotation, 0deg)) translateY(0); }
          50% { transform: rotate(var(--rotation, 0deg)) translateY(-16px); }
        }
        @keyframes scan-line {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
