/**
 * Consistency Score Engine
 * Compares generated outputs against the source context to detect:
 * - Factual accuracy (are source facts present in outputs?)
 * - Cross-output consistency (do all outputs convey the same core message?)
 * - Completeness (are key risks/recommendations covered?)
 */

import type { SourceContext } from "./ai";

export interface ConsistencyResult {
  overallScore: number; // 0-100
  sourceGrounding: number; // How well output references source facts
  crossOutputConsistency: number; // How consistent outputs are with each other
  completeness: number; // How many key facts are covered
  factCoverage: FactCoverage[];
  issues: ConsistencyIssue[];
}

export interface FactCoverage {
  fact: string;
  found: boolean;
  foundIn: string[]; // which outputs contain this fact
  confidence: number;
}

export interface ConsistencyIssue {
  type: "missing_fact" | "inconsistency" | "unsupported_claim" | "format_violation";
  severity: "high" | "medium" | "low";
  message: string;
  affectedOutputs: string[];
}

/**
 * Analyze consistency of outputs against source context
 */
export function analyzeConsistency(
  context: SourceContext,
  outputs: { format: string; content: string }[]
): ConsistencyResult {
  const issues: ConsistencyIssue[] = [];
  const factCoverage: FactCoverage[] = [];

  // 1. Check source grounding — are key facts present in outputs?
  const allFacts = [
    ...context.key_facts,
    ...context.risks.map((r) => `Risk: ${r}`),
    ...context.recommendations.map((r) => `Action: ${r}`),
  ];

  let totalFactPresence = 0;

  for (const fact of allFacts) {
    const normalizedFact = normalizeText(fact);
    const foundIn: string[] = [];

    for (const output of outputs) {
      const normalizedOutput = normalizeText(output.content);
      if (fuzzyContains(normalizedOutput, normalizedFact)) {
        foundIn.push(output.format);
      }
    }

    const coverage: FactCoverage = {
      fact,
      found: foundIn.length > 0,
      foundIn,
      confidence: foundIn.length / outputs.length,
    };
    factCoverage.push(coverage);

    if (foundIn.length === 0) {
      issues.push({
        type: "missing_fact",
        severity: "high",
        message: `Key fact not found in any output: "${fact.substring(0, 80)}..."`,
        affectedOutputs: outputs.map((o) => o.format),
      });
    } else if (foundIn.length < outputs.length * 0.5) {
      issues.push({
        type: "missing_fact",
        severity: "medium",
        message: `Fact only present in ${foundIn.length}/${outputs.length} outputs: "${fact.substring(0, 60)}..."`,
        affectedOutputs: outputs.filter((o) => !foundIn.includes(o.format)).map((o) => o.format),
      });
    }

    totalFactPresence += foundIn.length / outputs.length;
  }

  // 2. Check cross-output consistency — do outputs mention the same entities and numbers?
  const entityConsistency = checkEntityConsistency(outputs, context.entities);
  const numberConsistency = checkNumberConsistency(outputs, context.numbers);

  // 3. Check completeness — do outputs cover key sections?
  const completeness = checkCompleteness(outputs, context);

  // Calculate overall scores
  const sourceGrounding = allFacts.length > 0
    ? Math.round((totalFactPresence / allFacts.length) * 100)
    : 100;

  const crossOutputConsistency = Math.round(
    (entityConsistency + numberConsistency) / 2
  );

  const overallScore = Math.round(
    sourceGrounding * 0.4 + crossOutputConsistency * 0.3 + completeness * 0.3
  );

  return {
    overallScore: Math.min(100, overallScore),
    sourceGrounding: Math.min(100, sourceGrounding),
    crossOutputConsistency: Math.min(100, crossOutputConsistency),
    completeness: Math.min(100, completeness),
    factCoverage,
    issues,
  };
}

/**
 * Check entity consistency across outputs
 */
function checkEntityConsistency(
  outputs: { content: string }[],
  entities: string[]
): number {
  if (entities.length === 0) return 100;

  let totalConsistency = 0;

  for (const entity of entities) {
    const normalizedEntity = entity.toLowerCase();
    const presence = outputs.map((o) =>
      normalizeText(o.content).includes(normalizedEntity)
    );

    const presentCount = presence.filter(Boolean).length;
    if (presentCount > 0 && presentCount < outputs.length) {
      // Some have it, some don't — partial consistency
      totalConsistency += presentCount / outputs.length;
    } else {
      totalConsistency += 1; // All have it or none have it (consistent)
    }
  }

  return Math.round((totalConsistency / entities.length) * 100);
}

/**
 * Check number consistency across outputs
 */
function checkNumberConsistency(
  outputs: { content: string }[],
  numbers: Record<string, unknown>
): number {
  const numericValues = Object.values(numbers)
    .filter((v) => typeof v === "number" || typeof v === "string")
    .map(String);

  if (numericValues.length === 0) return 100;

  let matches = 0;
  for (const num of numericValues) {
    const normalizedNum = num.toLowerCase();
    const allContain = outputs.every((o) =>
      normalizeText(o.content).includes(normalizedNum)
    );
    if (allContain) matches++;
  }

  return Math.round((matches / numericValues.length) * 100);
}

/**
 * Check if outputs cover required sections
 */
function checkCompleteness(
  outputs: { format: string; content: string }[],
  context: SourceContext
): number {
  let score = 100;

  // Check if risks are mentioned
  const risksMentioned = outputs.some((o) =>
    normalizeText(o.content).includes("risk")
  );
  if (!risksMentioned) score -= 20;

  // Check if recommendations are mentioned
  const actionsMentioned = outputs.some((o) => {
    const content = normalizeText(o.content);
    return content.includes("recommend") || content.includes("action") || content.includes("should");
  });
  if (!actionsMentioned) score -= 20;

  // Check if summary/overview is present
  const hasSummary = outputs.some((o) => {
    const content = normalizeText(o.content);
    return content.includes("overview") || content.includes("summary") || content.includes("executive");
  });
  if (!hasSummary) score -= 15;

  // Check for impact discussion
  const hasImpact = outputs.some((o) => {
    const content = normalizeText(o.content);
    return content.includes("impact") || content.includes("effect") || content.includes("consequence");
  });
  if (!hasImpact) score -= 15;

  return Math.max(0, score);
}

/**
 * Normalize text for comparison
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fuzzy string containment check
 */
function fuzzyContains(haystack: string, needle: string): boolean {
  // Direct contains
  if (haystack.includes(needle)) return true;

  // Check if most words from needle appear in haystack
  const needleWords = needle.split(" ").filter((w) => w.length > 3);
  if (needleWords.length === 0) return false;

  const foundWords = needleWords.filter((w) => haystack.includes(w));
  return foundWords.length >= needleWords.length * 0.6;
}
