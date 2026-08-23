"use client";

import { useEffect, useState } from "react";

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 z-20 opacity-80"
            style={{
              color: "#8b5cf6",
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
              transform: "translate(-2px, -1px)",
              animation: "glitch-1 0.2s linear",
            }}
            aria-hidden
          >
            {text}
          </span>
          <span
            className="absolute inset-0 z-20 opacity-80"
            style={{
              color: "#06b6d4",
              clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
              transform: "translate(2px, 1px)",
              animation: "glitch-2 0.2s linear",
            }}
            aria-hidden
          >
            {text}
          </span>
        </>
      )}
      <style jsx>{`
        @keyframes glitch-1 {
          0% { transform: translate(-3px, -2px); }
          25% { transform: translate(2px, 1px); }
          50% { transform: translate(-1px, -1px); }
          75% { transform: translate(3px, 2px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes glitch-2 {
          0% { transform: translate(3px, 2px); }
          25% { transform: translate(-2px, -1px); }
          50% { transform: translate(1px, 1px); }
          75% { transform: translate(-3px, -2px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </span>
  );
}
