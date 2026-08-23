"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
  className = "",
  once = true,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const transforms: Record<Direction, string> = {
    up: "translate-y-12",
    down: "translate-y-[-3rem]",
    left: "translate-x-12",
    right: "translate-x-[-3rem]",
    scale: "scale-90",
    fade: "",
  };

  return (
    <div
      ref={ref}
      className={cn("transition-all", className)}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : undefined,
      }}
    >
      <div
        style={{
          transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translate(0,0) scale(1)" : `translate(${direction === "left" ? "3rem" : direction === "right" ? "-3rem" : "0"}, ${direction === "up" ? "3rem" : direction === "down" ? "-3rem" : "0"}) ${direction === "scale" ? "scale(0.9)" : ""}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
