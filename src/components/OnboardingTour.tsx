"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  title: string;
  description: string;
  highlight?: string;
  icon: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to TransformAI",
    description:
      "TransformAI turns any source information into professional communication assets — in seconds. Let's walk through the key features.",
    icon: "🚀",
  },
  {
    title: "New Transformation",
    description:
      "Start by clicking 'New Transformation' in the sidebar. You can paste text, upload documents (PDF/DOCX), add URLs, or even use voice input.",
    highlight: "sidebar",
    icon: "✦",
  },
  {
    title: "Source Input",
    description:
      "Paste your content in the text editor, upload files, or try the Voice tab for speech-to-text. You can also translate your content to multiple languages.",
    icon: "📝",
  },
  {
    title: "AI Analysis",
    description:
      "Once you submit your source, TransformAI analyzes it — understanding the topic, extracting key facts, and identifying the best content strategy.",
    icon: "🧠",
  },
  {
    title: "Choose Outputs",
    description:
      "Select from 7 output formats: LinkedIn, X/Twitter, Advisory, Executive Summary, Presentation, Infographic, and Video Package. Choose multiple at once.",
    icon: "📋",
  },
  {
    title: "Generate & Edit",
    description:
      "Click 'Transform Content' and watch the AI generate your outputs. You can edit, copy, regenerate, and export each one as PDF or other formats.",
    icon: "✨",
  },
  {
    title: "You're Ready!",
    description:
      "That's the core flow. Try the 'Try Demo' button to see it in action instantly, or start your first transformation now. Enjoy!",
    icon: "🎉",
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  const current = tourSteps[step];
  const isLast = step === tourSteps.length - 1;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Tour card */}
      <div className="relative w-full max-w-md bg-[#0e0e16] rounded-2xl shadow-2xl border border-violet-500/20 z-10 animate-fade-in-up overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-500"
            style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] text-gray-500 font-medium">
              Step {step + 1} of {tourSteps.length}
            </span>
            <button
              onClick={onComplete}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="text-4xl mb-4">{current.icon}</div>
            <h2 className="text-xl font-bold text-white mb-3">
              {current.title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
              {current.description}
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-1.5 mb-8">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === step
                    ? "w-6 bg-gradient-to-r from-violet-600 to-cyan-500"
                    : i < step
                    ? "w-1.5 bg-violet-500"
                    : "w-1.5 bg-white/10"
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all",
                step === 0
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              )}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {isLast ? (
              <button
                onClick={onComplete}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-violet-500/25"
              >
                <Sparkles className="w-4 h-4" />
                Get Started
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/25"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage onboarding state
 */
export function useOnboarding() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem("transformai-onboarding-done");
    if (!hasCompleted) {
      setShowTour(true);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem("transformai-onboarding-done", "true");
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem("transformai-onboarding-done");
    setShowTour(true);
  };

  return { showTour, completeTour, resetTour };
}
