"use client";

import { useEffect, useState } from "react";
import { Video, Share2, MessageSquare, Shield, Image, Presentation, FileText } from "lucide-react";

const outputIcons = [
  { icon: Video, label: "Video", color: "#ef4444", x: 8, y: 20 },
  { icon: Share2, label: "LinkedIn", color: "#0a66c2", x: 85, y: 15 },
  { icon: MessageSquare, label: "X Thread", color: "#94a3b8", x: 12, y: 75 },
  { icon: Shield, label: "Advisory", color: "#f59e0b", x: 88, y: 70 },
  { icon: Image, label: "Infographic", color: "#10b981", x: 5, y: 48 },
  { icon: Presentation, label: "Slides", color: "#8b5cf6", x: 90, y: 45 },
  { icon: FileText, label: "Exec Summary", color: "#06b6d4", x: 50, y: 8 },
];

export function HeroEffects() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Radial pulse behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)",
            animation: "hero-pulse 4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Orbiting rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-[500px] h-[500px] rounded-full border border-violet-500/10"
          style={{ animation: "spin-slow 20s linear infinite" }}
        />
        <div
          className="absolute inset-[40px] rounded-full border border-cyan-500/10"
          style={{ animation: "spin-slow 15s linear infinite reverse" }}
        />
        <div
          className="absolute inset-[90px] rounded-full border border-violet-500/8"
          style={{ animation: "spin-slow 25s linear infinite" }}
        />
        {/* Orbiting dot */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50"
          style={{ animation: "spin-slow 20s linear infinite" }}
        />
        <div
          className="absolute bottom-[40px] right-[40px] w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
          style={{ animation: "spin-slow 15s linear infinite reverse" }}
        />
      </div>

      {/* Floating output cards */}
      {outputIcons.map((item, i) => (
        <div
          key={item.label}
          className="absolute hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border transition-all hover:scale-110 z-10"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            background: `${item.color}10`,
            borderColor: `${item.color}25`,
            boxShadow: `0 0 20px ${item.color}10`,
            animation: `float ${4 + i * 0.7}s ease-in-out infinite, fade-in 0.8s ease-out forwards`,
            animationDelay: `${i * 0.2}s, ${i * 0.15}s`,
          }}
        >
          <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
          <span className="text-[10px] font-semibold" style={{ color: item.color }}>
            {item.label}
          </span>
        </div>
      ))}

      {/* Floating orbs */}
      {[
        { size: 120, x: "15%", y: "25%", color: "violet", delay: 0, duration: 6 },
        { size: 80, x: "80%", y: "20%", color: "cyan", delay: 1, duration: 7 },
        { size: 100, x: "10%", y: "65%", color: "cyan", delay: 2, duration: 5 },
        { size: 60, x: "85%", y: "60%", color: "violet", delay: 0.5, duration: 8 },
        { size: 40, x: "50%", y: "10%", color: "violet", delay: 1.5, duration: 6 },
        { size: 50, x: "45%", y: "80%", color: "cyan", delay: 3, duration: 7 },
      ].map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color === "violet"
              ? "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
            filter: "blur(30px)",
            animation: `float ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}

      {/* Animated lines from center */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 50;
          const cy = 45;
          const len = 35;
          const x2 = cx + Math.cos(rad) * len;
          const y2 = cy + Math.sin(rad) * len;
          return (
            <line
              key={angle}
              x1={`${cx}%`}
              y1={`${cy}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#line-gradient)"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              style={{
                animation: `fade-in 1s ease-out forwards`,
                animationDelay: `${angle / 360}s`,
              }}
            />
          );
        })}
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes hero-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
