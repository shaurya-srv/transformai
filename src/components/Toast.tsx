"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-xl animate-toast-in",
              t.type === "success" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
              t.type === "error" && "bg-red-500/10 border-red-500/20 text-red-400",
              t.type === "info" && "bg-violet-500/10 border-violet-500/20 text-violet-400"
            )}
          >
            {t.type === "success" && <CheckCircle className="w-4 h-4 shrink-0" />}
            {t.type === "error" && <AlertCircle className="w-4 h-4 shrink-0" />}
            {t.type === "info" && <Info className="w-4 h-4 shrink-0" />}
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
