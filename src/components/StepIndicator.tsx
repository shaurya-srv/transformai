"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { num: 1, label: "Source" },
  { num: 2, label: "Analyze" },
  { num: 3, label: "Configure" },
  { num: 4, label: "Select" },
  { num: 5, label: "Transform" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-xl mx-auto mb-8">
      {steps.map((step, i) => {
        const isCompleted = currentStep > step.num;
        const isCurrent = currentStep === step.num;
        const isUpcoming = currentStep < step.num;

        return (
          <div key={step.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  isCompleted &&
                    "bg-emerald-500 border-emerald-500 text-white",
                  isCurrent &&
                    "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200",
                  isUpcoming && "bg-white border-slate-300 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.num
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium mt-1.5 whitespace-nowrap",
                  isCompleted && "text-emerald-600",
                  isCurrent && "text-indigo-600",
                  isUpcoming && "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mt-[-14px] rounded-full transition-colors duration-300",
                  isCompleted ? "bg-emerald-500" : "bg-slate-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
