"use client";

import { useState, useCallback } from "react";
import type { SourceContext, TransformationConfig, GeneratedOutput } from "@/lib/ai";
import { analyzeConsistency, type ConsistencyResult } from "@/lib/consistencyEngine";
import {
  createSourceRecord,
  createOutputRecord,
  saveSourceRecord,
  saveOutputRecord,
  type SourceRecord,
  type OutputRecord,
} from "@/lib/sourceLinkage";
import type { CrisisTemplate } from "@/lib/crisisTemplates";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

interface TransformState {
  step: WizardStep;
  sourceContent: string;
  context: SourceContext | null;
  config: TransformationConfig;
  selectedOutputs: string[];
  results: {
    outputs: GeneratedOutput[];
    validation: {
      sourceGrounded: boolean;
      consistencyChecked: boolean;
      formatValidated: boolean;
    };
  } | null;
  isAnalyzing: boolean;
  isTransforming: boolean;
  analysisStep: number;
  // New: consistency & linkage
  consistencyResult: ConsistencyResult | null;
  sourceRecord: SourceRecord | null;
  outputRecords: OutputRecord[];
  activeTemplate: CrisisTemplate | null;
}

const defaultConfig: TransformationConfig = {
  audiences: [],
  tone: "Professional",
  language: "English",
  detail: "Standard",
  objectives: [],
};

export function useTransform() {
  const [state, setState] = useState<TransformState>({
    step: 1,
    sourceContent: "",
    context: null,
    config: { ...defaultConfig },
    selectedOutputs: [],
    results: null,
    isAnalyzing: false,
    isTransforming: false,
    analysisStep: 0,
    consistencyResult: null,
    sourceRecord: null,
    outputRecords: [],
    activeTemplate: null,
  });

  const setSourceContent = useCallback((content: string) => {
    setState((s) => ({ ...s, sourceContent: content }));
  }, []);

  const setStep = useCallback((step: WizardStep) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((s) => ({ ...s, step: Math.min(s.step + 1, 5) as WizardStep }));
  }, []);

  const prevStep = useCallback(() => {
    setState((s) => ({ ...s, step: Math.max(s.step - 1, 1) as WizardStep }));
  }, []);

  const updateConfig = useCallback(
    (updates: Partial<TransformationConfig>) => {
      setState((s) => ({
        ...s,
        config: { ...s.config, ...updates },
      }));
    },
    []
  );

  const toggleOutput = useCallback((output: string) => {
    setState((s) => {
      const exists = s.selectedOutputs.includes(output);
      return {
        ...s,
        selectedOutputs: exists
          ? s.selectedOutputs.filter((o) => o !== output)
          : [...s.selectedOutputs, output],
      };
    });
  }, []);

  // Apply a crisis template's defaults
  const applyTemplate = useCallback((template: CrisisTemplate) => {
    setState((s) => ({
      ...s,
      activeTemplate: template,
      config: { ...defaultConfig, ...template.defaultConfig },
      selectedOutputs: template.defaultOutputs,
    }));
  }, []);

  const analyzeSource = useCallback(async () => {
    setState((s) => ({ ...s, isAnalyzing: true, analysisStep: 0 }));

    // Animate through pipeline steps
    const totalSteps = 9;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((r) => setTimeout(r, 350));
      setState((s) => ({ ...s, analysisStep: i }));
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: state.sourceContent }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();

      // Create source record for linkage
      const sourceRecord = createSourceRecord(
        state.sourceContent,
        data.context.topic,
        data.context.source_type
      );
      saveSourceRecord(sourceRecord);

      setState((s) => ({
        ...s,
        context: data.context,
        sourceRecord,
        isAnalyzing: false,
        step: 3,
      }));
    } catch (error) {
      console.error("Analysis error:", error);
      setState((s) => ({ ...s, isAnalyzing: false }));
    }
  }, [state.sourceContent]);

  const transform = useCallback(async () => {
    if (!state.context) return;

    setState((s) => ({ ...s, isTransforming: true }));

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: state.context,
          config: state.config,
          outputTypes: state.selectedOutputs,
        }),
      });

      if (!res.ok) throw new Error("Transform failed");

      const data = await res.json();

      // Run consistency analysis
      const consistencyResult = analyzeConsistency(state.context, data.outputs);

      // Create output records for linkage
      const outputRecords = data.outputs.map((output: GeneratedOutput) => {
        const record = createOutputRecord(
          state.sourceRecord?.id || "unknown",
          output.format,
          output.content,
          consistencyResult.overallScore
        );
        saveOutputRecord(record);
        return record;
      });

      setState((s) => ({
        ...s,
        results: data,
        consistencyResult,
        outputRecords,
        isTransforming: false,
        step: 5,
      }));

      return data;
    } catch (error) {
      console.error("Transform error:", error);
      setState((s) => ({ ...s, isTransforming: false }));
      return null;
    }
  }, [state.context, state.config, state.selectedOutputs, state.sourceRecord]);

  const reset = useCallback(() => {
    setState({
      step: 1,
      sourceContent: "",
      context: null,
      config: { ...defaultConfig },
      selectedOutputs: [],
      results: null,
      isAnalyzing: false,
      isTransforming: false,
      analysisStep: 0,
      consistencyResult: null,
      sourceRecord: null,
      outputRecords: [],
      activeTemplate: null,
    });
  }, []);

  const updateOutput = useCallback((format: string, newContent: string) => {
    setState((s) => {
      if (!s.results) return s;
      return {
        ...s,
        results: {
          ...s.results,
          outputs: s.results.outputs.map((o) =>
            o.format === format ? { ...o, content: newContent } : o
          ),
        },
      };
    });
  }, []);

  return {
    ...state,
    setSourceContent,
    setStep,
    nextStep,
    prevStep,
    updateConfig,
    toggleOutput,
    analyzeSource,
    transform,
    reset,
    updateOutput,
    applyTemplate,
  };
}
