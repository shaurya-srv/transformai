/**
 * Data Loss Prevention (DLP) Scanner
 */

export type DLPSeverity = "critical" | "high" | "medium" | "low" | "info";
export type DLPCategory = "pii" | "credentials" | "financial" | "health" | "internal" | "classification" | "network" | "source_code";

export interface DLPFinding {
  id: string;
  category: DLPCategory;
  severity: DLPSeverity;
  title: string;
  description: string;
  evidence: string;
  recommendation: string;
  regulation?: string;
}

export interface DLPScanResult {
  safe: boolean;
  riskLevel: "blocked" | "warning" | "clean";
  score: number;
  findings: DLPFinding[];
  summary: string;
  scanTimestamp: string;
  totalMatches: number;
  blockedByPolicy: boolean;
}

export interface DLPPolicy {
  id: string;
  name: string;
  enabled: boolean;
  categories: DLPCategory[];
  blockOnDetection: boolean;
  minSeverity: DLPSeverity;
}

export const DEFAULT_DLP_POLICIES: DLPPolicy[] = [
  { id: "pii-block", name: "PII Blocking", enabled: true, categories: ["pii", "financial", "health"], blockOnDetection: true, minSeverity: "high" },
  { id: "cred-block", name: "Credential Blocking", enabled: true, categories: ["credentials"], blockOnDetection: true, minSeverity: "medium" },
  { id: "internal-warn", name: "Internal Data Warning", enabled: true, categories: ["internal", "classification", "network"], blockOnDetection: false, minSeverity: "low" },
  { id: "source-warn", name: "Source Code Warning", enabled: true, categories: ["source_code"], blockOnDetection: false, minSeverity: "medium" },
];

let findingCounter = 0;

function createFinding(category: DLPCategory, severity: DLPSeverity, title: string, desc: string, evidence: string, rec: string, regulation?: string): DLPFinding {
  findingCounter++;
  return { id: "DLP-" + String(findingCounter).padStart(4, "0"), category, severity, title, description: desc, evidence: evidence.substring(0, 120), recommendation: rec, regulation };
}

export function scanForDLP(content: string, policies?: DLPPolicy[]): DLPScanResult {
  findingCounter = 0;
  const findings: DLPFinding[] = [];
  const activePolicies = policies || DEFAULT_DLP_POLICIES.filter((p) => p.enabled);
  let m: RegExpExecArray | null;

  // SSN
  const ssnRegex = /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g;
  while ((m = ssnRegex.exec(content)) !== null) {
    findings.push(createFinding("pii", "critical", "Social Security Number Detected", "SSN found in content. Regulated under multiple privacy laws.", m[0], "Redact or encrypt SSN before distribution.", "GDPR Art. 9, CCPA"));
  }

  // Email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = new Set<string>();
  while ((m = emailRegex.exec(content)) !== null) {
    if (!emails.has(m[0].toLowerCase())) {
      emails.add(m[0].toLowerCase());
      findings.push(createFinding("pii", "low", "Email Address Detected", "Personal email found. May constitute PII under GDPR.", m[0], "Verify if email is necessary.", "GDPR Art. 6"));
    }
  }

  // Credit card
  const ccRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
  while ((m = ccRegex.exec(content)) !== null) {
    const digits = m[0].replace(/\D/g, "");
    if (digits.length === 16) {
      findings.push(createFinding("financial", "critical", "Credit Card Number Detected", "Payment card number found. PCI-DSS violation.", m[0].substring(0, 19) + "...", "Remove immediately.", "PCI-DSS 3.4"));
    }
  }

  // Credentials
  const credPatterns = [
    { pattern: /(?:password|passwd|pwd)\s*[:=]\s*\S+/gi, title: "Hardcoded Password", severity: "critical" as const },
    { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*\S+/gi, title: "API Key Detected", severity: "critical" as const },
    { pattern: /(?:secret[_-]?key|client[_-]?secret)\s*[:=]\s*\S+/gi, title: "Secret Key Detected", severity: "critical" as const },
    { pattern: /(?:access[_-]?token|auth[_-]?token|bearer)\s*[:=]\s*\S+/gi, title: "Auth Token Detected", severity: "critical" as const },
    { pattern: /(?:AKIA)[A-Z0-9]{16}/g, title: "AWS Access Key Detected", severity: "critical" as const },
    { pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/gi, title: "Private Key Detected", severity: "critical" as const },
    { pattern: /ghp_[A-Za-z0-9]{36}/g, title: "GitHub PAT Detected", severity: "critical" as const },
    { pattern: /sk-[A-Za-z0-9]{32,}/g, title: "OpenAI API Key Detected", severity: "critical" as const },
  ];
  for (const { pattern, title, severity } of credPatterns) {
    while ((m = pattern.exec(content)) !== null) {
      findings.push(createFinding("credentials", severity, title, "Exposed credential found.", m[0].substring(0, 50) + "...", "Rotate immediately. Use env vars."));
    }
  }

  // Internal IPs
  const ipRegex = /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})\b/g;
  while ((m = ipRegex.exec(content)) !== null) {
    findings.push(createFinding("internal", "low", "Private IP Address", "Internal network IP exposed.", m[0], "Remove internal IPs from external content."));
  }

  // Classification
  const classPatterns = [
    { pattern: /\b(?:TOP\s*SECRET|SECRET|CONFIDENTIAL|CLASSIFIED)\b/gi, title: "Classification Marking", severity: "critical" as const },
    { pattern: /\b(?:DO\s+NOT\s+DISTRIBUTE|INTERNAL\s+ONLY|RESTRICTED)\b/gi, title: "Distribution Restriction", severity: "high" as const },
  ];
  for (const { pattern, title, severity } of classPatterns) {
    while ((m = pattern.exec(content)) !== null) {
      findings.push(createFinding("classification", severity, title, "Classification marking found.", m[0], "Verify content is appropriate for distribution."));
    }
  }

  // Source code
  const codeRegex = /\b(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE\s+TABLE)\b/gi;
  while ((m = codeRegex.exec(content)) !== null) {
    findings.push(createFinding("source_code", "medium", "SQL Statement Detected", "SQL found in content.", m[0], "Review if SQL should be in distributed content."));
  }

  // Calculate
  let score = 100;
  let hasCritical = false;
  let hasBlockable = false;
  const sevOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };

  for (const f of findings) {
    score -= f.severity === "critical" ? 20 : f.severity === "high" ? 12 : f.severity === "medium" ? 6 : 2;
    if (f.severity === "critical") hasCritical = true;
    const bp = activePolicies.find((p) => p.blockOnDetection && p.categories.includes(f.category) && sevOrder[f.severity] >= sevOrder[p.minSeverity]);
    if (bp) hasBlockable = true;
  }
  score = Math.max(0, score);

  let riskLevel: DLPScanResult["riskLevel"];
  if (hasBlockable || hasCritical) riskLevel = "blocked";
  else if (findings.length > 0) riskLevel = "warning";
  else riskLevel = "clean";

  const critCount = findings.filter((f) => f.severity === "critical" || f.severity === "high").length;
  const summary = findings.length === 0
    ? "Content is clean. No DLP violations detected."
    : findings.length + " DLP issue(s) found. " + (hasCritical ? "CRITICAL data detected. " : "") + (hasBlockable ? "BLOCKED by policy." : "");

  return { safe: riskLevel === "clean", riskLevel, score, findings, summary, scanTimestamp: new Date().toISOString(), totalMatches: findings.length, blockedByPolicy: hasBlockable };
}

export function quickDLPScan(content: string): { safe: boolean; criticalCount: number; findings: DLPFinding[] } {
  const full = scanForDLP(content);
  const criticals = full.findings.filter((f) => f.severity === "critical" || f.severity === "high");
  return { safe: criticals.length === 0, criticalCount: criticals.length, findings: criticals };
}
