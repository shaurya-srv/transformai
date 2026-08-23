"use client";

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main aurora blob 1 */}
      <div
        className="absolute animate-aurora"
        style={{
          width: "800px",
          height: "600px",
          top: "-10%",
          left: "-10%",
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)",
          filter: "blur(80px)",
          animation: "aurora-1 12s ease-in-out infinite",
        }}
      />
      {/* Main aurora blob 2 */}
      <div
        className="absolute animate-aurora"
        style={{
          width: "600px",
          height: "500px",
          top: "20%",
          right: "-5%",
          background: "radial-gradient(ellipse at center, rgba(6,182,212,0.1) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
          filter: "blur(80px)",
          animation: "aurora-2 15s ease-in-out infinite",
        }}
      />
      {/* Bottom aurora */}
      <div
        className="absolute"
        style={{
          width: "1000px",
          height: "400px",
          bottom: "-10%",
          left: "20%",
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.05) 50%, transparent 70%)",
          filter: "blur(100px)",
          animation: "aurora-3 18s ease-in-out infinite",
        }}
      />
      <style jsx>{`
        @keyframes aurora-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, 50px) scale(1.1); }
          66% { transform: translate(-50px, -30px) scale(0.95); }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-80px, 40px) scale(1.05); }
          66% { transform: translate(60px, -60px) scale(1.1); }
        }
        @keyframes aurora-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(50px, -30px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
