/**
 * TransformAI Core Types
 */

// ── User & Auth ──────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  organization?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ── Projects ─────────────────────────────────────────────────────────────
export type ProjectStatus = "completed" | "processing" | "draft";

export interface Project {
  id: string;
  name: string;
  source: string;
  sourceType: "text" | "document" | "url" | "image" | "video";
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  ownerId: string;
  outputs: ProjectOutput[];
  settings: TransformationSettings;
}

export interface ProjectOutput {
  id: string;
  format: OutputFormat;
  title: string;
  content: string;
  isSaved: boolean;
  generatedAt: string;
}

// ── Transformation ───────────────────────────────────────────────────────
export type OutputFormat =
  | "video"
  | "linkedin"
  | "twitter"
  | "advisory"
  | "infographic"
  | "executive"
  | "presentation"
  | "briefing";

export interface TransformationSettings {
  audiences: string[];
  tone: string;
  language: string;
  detail: string;
  objectives: string[];
  style?: string;
}

export interface SourceContext {
  topic: string;
  source_type: string;
  summary: string;
  key_facts: string[];
  entities: string[];
  dates: string[];
  numbers: Record<string, unknown>;
  risks: string[];
  recommendations: string[];
  intent: string;
  confidence: number;
}

export interface GeneratedOutput {
  title: string;
  content: string;
  format: string;
  validated: boolean;
}

// ── Templates ────────────────────────────────────────────────────────────
export interface TransformationTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultOutputs: OutputFormat[];
  defaultSettings: Partial<TransformationSettings>;
}

// ── Dashboard ────────────────────────────────────────────────────────────
export interface DashboardStats {
  transformations: number;
  outputsGenerated: number;
  timeSaved: string;
  successRate: string;
}
