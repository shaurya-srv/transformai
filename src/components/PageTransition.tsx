"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter");

  useEffect(() => {
    // Trigger exit animation
    setTransitionStage("exit");

    // After exit, swap children and trigger enter
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage("enter");
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div
      className="transition-opacity duration-300 ease-in-out"
      style={{
        opacity: transitionStage === "enter" ? 1 : 0,
        transform: transitionStage === "enter" ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {displayChildren}
    </div>
  );
}
