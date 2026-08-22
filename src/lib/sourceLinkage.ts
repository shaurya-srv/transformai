/**
 * Source Linkage System
 * Tracks the relationship between source content and generated outputs.
 * Detects when source content changes and flags affected outputs.
 */

export interface SourceRecord {
  id: string;
  hash: string;
  content: string;
  createdAt: string;
  lastModified: string;
  metadata: {
    topic: string;
    wordCount: number;
    sourceType: string;
  };
}

export interface OutputRecord {
  id: string;
  sourceId: string;
  format: string;
  content: string;
  hash: string;
  generatedAt: string;
  lastValidated: string;
  isCurrent: boolean; // false if source has changed since generation
  consistencyScore: number;
}

export interface SourceVersion {
  hash: string;
  content: string;
  timestamp: string;
  changeDescription: string;
}

/**
 * Simple string hash for change detection
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Create a source record from content
 */
export function createSourceRecord(
  content: string,
  topic: string,
  sourceType: string = "Document"
): SourceRecord {
  const now = new Date().toISOString();
  return {
    id: `src_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    hash: simpleHash(content),
    content,
    createdAt: now,
    lastModified: now,
    metadata: {
      topic,
      wordCount: content.split(/\s+/).length,
      sourceType,
    },
  };
}

/**
 * Create an output record linked to a source
 */
export function createOutputRecord(
  sourceId: string,
  format: string,
  content: string,
  consistencyScore: number
): OutputRecord {
  return {
    id: `out_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    sourceId,
    format,
    content,
    hash: simpleHash(content),
    generatedAt: new Date().toISOString(),
    lastValidated: new Date().toISOString(),
    isCurrent: true,
    consistencyScore,
  };
}

/**
 * Detect changes between two versions of source content
 */
export function detectChanges(
  oldContent: string,
  newContent: string
): {
  hasChanged: boolean;
  changeType: "none" | "minor" | "moderate" | "major";
  changeDescription: string;
  affectedSections: string[];
} {
  const oldHash = simpleHash(oldContent);
  const newHash = simpleHash(newContent);

  if (oldHash === newHash) {
    return {
      hasChanged: false,
      changeType: "none",
      changeDescription: "No changes detected",
      affectedSections: [],
    };
  }

  const oldWords = new Set(oldContent.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  const newWords = new Set(newContent.toLowerCase().split(/\s+/).filter((w) => w.length > 3));

  const addedWords = [...newWords].filter((w) => !oldWords.has(w));
  const removedWords = [...oldWords].filter((w) => !newWords.has(w));

  const totalWords = Math.max(oldWords.size, newWords.size, 1);
  const changeRatio = (addedWords.length + removedWords.length) / totalWords;

  let changeType: "minor" | "moderate" | "major";
  let changeDescription: string;

  if (changeRatio < 0.05) {
    changeType = "minor";
    changeDescription = `Minor text changes (${addedWords.length} words added, ${removedWords.length} removed)`;
  } else if (changeRatio < 0.2) {
    changeType = "moderate";
    changeDescription = `Moderate changes detected (${addedWords.length} new concepts, ${removedWords.length} removed)`;
  } else {
    changeType = "major";
    changeDescription = `Major revision detected — significant content changes`;
  }

  // Detect affected sections by looking for context keywords
  const sectionKeywords = [
    "summary", "risk", "impact", "recommendation", "action",
    "affected", "technical", "timeline", "reference", "conclusion",
  ];

  const affectedSections = sectionKeywords.filter((keyword) => {
    const oldHas = oldContent.toLowerCase().includes(keyword);
    const newHas = newContent.toLowerCase().includes(keyword);
    return oldHas !== newHas || addedWords.some((w) => newContent.toLowerCase().includes(keyword));
  });

  return {
    hasChanged: true,
    changeType,
    changeDescription,
    affectedSections,
  };
}

/**
 * Get stale outputs that need regeneration
 */
export function getStaleOutputs(
  outputs: OutputRecord[],
  currentSourceHash: string
): OutputRecord[] {
  return outputs.filter((o) => {
    // Mark as stale if we can compare hashes
    // In a real system, we'd store the source hash at generation time
    return !o.isCurrent;
  });
}

/**
 * Calculate freshness score for an output
 * Returns 0-100 (100 = perfectly current, 0 = very stale)
 */
export function calculateFreshness(
  generatedAt: string,
  lastModified: string
): number {
  const genTime = new Date(generatedAt).getTime();
  const modTime = new Date(lastModified).getTime();
  const ageMs = modTime - genTime;

  if (ageMs <= 0) return 100; // Generated after last modification

  // Freshness decays over time
  const hoursOld = ageMs / (1000 * 60 * 60);
  if (hoursOld < 1) return 100;
  if (hoursOld < 24) return 90;
  if (hoursOld < 72) return 70;
  if (hoursOld < 168) return 50; // 1 week
  return 30;
}

/**
 * Store records in localStorage (for demo persistence)
 */
const STORAGE_KEY = "transformai_source_records";
const OUTPUT_KEY = "transformai_output_records";

export function saveSourceRecord(record: SourceRecord): void {
  const existing = getSourceRecords();
  existing.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(-50))); // Keep last 50
}

export function getSourceRecords(): SourceRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveOutputRecord(record: OutputRecord): void {
  const existing = getOutputRecords();
  existing.push(record);
  localStorage.setItem(OUTPUT_KEY, JSON.stringify(existing.slice(-200))); // Keep last 200
}

export function getOutputRecords(): OutputRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(OUTPUT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getSourceRecord(id: string): SourceRecord | undefined {
  return getSourceRecords().find((r) => r.id === id);
}

export function getOutputsForSource(sourceId: string): OutputRecord[] {
  return getOutputRecords().filter((r) => r.sourceId === sourceId);
}
