/**
 * Cybersecurity Threat Analysis Engine
 */

export interface ThreatFinding {
  id: string;
  type: "cve" | "ioc" | "vulnerability" | "sensitive_data" | "malware" | "phishing" | "misconfiguration";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  evidence: string;
  recommendation: string;
  cveId?: string;
  cvssScore?: number;
}

export interface ThreatAnalysisResult {
  overallRisk: "critical" | "high" | "medium" | "low" | "clean";
  riskScore: number;
  findings: ThreatFinding[];
  summary: string;
  scanTimestamp: string;
}

const CVE_PATTERNS = [
  { pattern: /CVE-\d{4}-\d{4,}/gi, severity: "high" as const, desc: "CVE vulnerability reference detected" },
  { pattern: /CVSS\s*(?:score)?\s*:?\s*(\d+\.?\d*)/gi, severity: "high" as const, desc: "CVSS score reference" },
  { pattern: /zero[- ]?day/gi, severity: "critical" as const, desc: "Zero-day vulnerability reference" },
  { pattern: /remote\s+code\s+execution/gi, severity: "critical" as const, desc: "RCE vulnerability pattern" },
  { pattern: /privilege\s+escalation/gi, severity: "high" as const, desc: "Privilege escalation pattern" },
  { pattern: /buffer\s+overflow/gi, severity: "high" as const, desc: "Buffer overflow vulnerability" },
  { pattern: /sql\s+injection/gi, severity: "high" as const, desc: "SQL injection vulnerability" },
  { pattern: /cross[- ]site\s+(?:scripting|xss)/gi, severity: "medium" as const, desc: "XSS vulnerability pattern" },
  { pattern: /denial[- ]of[- ]service|dos\s+attack/gi, severity: "medium" as const, desc: "DoS attack pattern" },
  { pattern: /man[- ]in[- ]the[- ]middle|mitm/gi, severity: "high" as const, desc: "MITM attack pattern" },
];

const SENSITIVE_PATTERNS = [
  { pattern: /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g, severity: "critical" as const, desc: "Potential credit card number" },
  { pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/g, severity: "low" as const, desc: "Email address detected" },
  { pattern: /(?:password|passwd|pwd)\s*[:=]\s*\S+/gi, severity: "critical" as const, desc: "Hardcoded password detected" },
  { pattern: /(?:api[_-]?key|apikey|secret[_-]?key|access[_-]?token)\s*[:=]\s*\S+/gi, severity: "critical" as const, desc: "API key or secret detected" },
];

let findingCounter = 0;

function createFinding(
  type: ThreatFinding["type"],
  severity: ThreatFinding["severity"],
  title: string,
  description: string,
  evidence: string,
  recommendation: string,
  extra?: Partial<ThreatFinding>
): ThreatFinding {
  findingCounter++;
  return { id: "TF-" + String(findingCounter).padStart(4, "0"), type, severity, title, description, evidence, recommendation, ...extra };
}

export function analyzeThreats(content: string): ThreatAnalysisResult {
  findingCounter = 0;
  const findings: ThreatFinding[] = [];

  for (const { pattern, severity, desc } of CVE_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(content)) !== null) {
      const cveMatch = match[0].match(/CVE-\d{4}-\d{4,}/i);
      findings.push(createFinding("vulnerability", severity, desc, "Detected reference to known vulnerability pattern", match[0].substring(0, 100), "Validate CVE details against NVD database. Ensure affected systems are patched.", cveMatch ? { cveId: cveMatch[0], cvssScore: severity === "critical" ? 9.5 : 7.5 } : {}));
    }
  }

  const ipRegex = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/g;
  let ipMatch;
  const foundIPs = new Set<string>();
  while ((ipMatch = ipRegex.exec(content)) !== null) {
    const ip = ipMatch[0];
    if (!foundIPs.has(ip) && ip !== "0.0.0.0" && ip !== "127.0.0.1") {
      foundIPs.add(ip);
      findings.push(createFinding("ioc", "medium", "IP Address Detected", "An IP address was found in the content", ip, "Cross-reference with threat intelligence feeds."));
    }
  }

  const malwareRegex = /(?:malware|trojan|ransomware|worm|rootkit|backdoor|keylogger|spyware|botnet)/gi;
  let malwareMatch;
  while ((malwareMatch = malwareRegex.exec(content)) !== null) {
    findings.push(createFinding("malware", "high", "Malware Reference: " + malwareMatch[0], "Content references a type of malware", malwareMatch[0], "Determine if this is a threat report or actual incident."));
  }

  for (const { pattern, severity, desc } of SENSITIVE_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(content)) !== null) {
      findings.push(createFinding("sensitive_data", severity, desc, "Potentially sensitive data detected", match[0].substring(0, 60), "Review if this data should be redacted before distribution."));
    }
  }

  const severityScores: Record<string, number> = { critical: 25, high: 15, medium: 8, low: 3, info: 1 };
  let riskScore = 0;
  for (const f of findings) { riskScore += severityScores[f.severity] || 0; }
  riskScore = Math.min(100, riskScore);

  let overallRisk: ThreatAnalysisResult["overallRisk"];
  if (findings.some((f) => f.severity === "critical")) overallRisk = "critical";
  else if (riskScore >= 50) overallRisk = "high";
  else if (riskScore >= 25) overallRisk = "medium";
  else if (riskScore > 0) overallRisk = "low";
  else overallRisk = "clean";

  const summary = findings.length === 0 ? "No security threats detected." : findings.length + " finding(s) detected. Risk level: " + overallRisk.toUpperCase() + ".";

  return { overallRisk, riskScore, findings, summary, scanTimestamp: new Date().toISOString() };
}

export function analyzeOutputSecurity(content: string, format: string): { safe: boolean; issues: string[]; score: number } {
  const issues: string[] = [];
  let score = 100;
  if (/(?:password|passwd|pwd|secret|token|key)\s*[:=]\s*\S+/gi.test(content)) { issues.push("Potential credential detected"); score -= 30; }
  if (/\d{3}[-.]?\d{2}[-.]?\d{4}/.test(content)) { issues.push("Potential SSN pattern detected"); score -= 25; }
  if (/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/.test(content)) { issues.push("Potential credit card number detected"); score -= 25; }
  return { safe: score >= 70 && issues.length === 0, issues, score: Math.max(0, score) };
}
