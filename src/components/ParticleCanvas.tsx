"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#8b5cf6", "#06b6d4", "#a78bfa", "#22d3ee", "#7c3aed"];

    const createParticle = (x: number, y: number, fromMouse: boolean) => ({
      x,
      y,
      vx: (Math.random() - 0.5) * (fromMouse ? 2 : 0.5),
      vy: (Math.random() - 0.5) * (fromMouse ? 2 : 0.5),
      size: Math.random() * 2 + (fromMouse ? 1 : 0.5),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: fromMouse ? 0.8 : 0.3,
      life: fromMouse ? 60 + Math.random() * 40 : 200 + Math.random() * 200,
    });

    // Ambient particles
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(
        createParticle(Math.random() * canvas.width, Math.random() * canvas.height, false)
      );
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Spawn particles at mouse
      for (let i = 0; i < 2; i++) {
        if (particlesRef.current.length < 200) {
          particlesRef.current.push(
            createParticle(
              e.clientX + (Math.random() - 0.5) * 20,
              e.clientY + (Math.random() - 0.5) * 20,
              true
            )
          );
        }
      }
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha *= 0.98;

        if (p.life <= 0 || p.alpha < 0.01) {
          particles.splice(i, 1);
          // Respawn ambient particles
          if (!p.life || p.life < 60) {
            particles.push(createParticle(Math.random() * canvas.width, Math.random() * canvas.height, false));
          }
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      // Draw connection lines between nearby particles
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
