/**
 * Compliance Checker
 * Scans content for GDPR, HIPAA, PCI-DSS, and PII compliance issues.
 */

export interface ComplianceIssue {
  id: string;
  regulation: "GDPR" | "HIPAA" | "PCI-DSS" | "PII" | "GENERAL";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  evidence: string;
  recommendation: string;
}

export interface ComplianceResult {
  compliant: boolean;
  score: number;
  issues: ComplianceIssue[];
  summary: string;
  scanTimestamp: string;
}

const GDPR_PATTERNS = [
  { pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/g, title: "Personal email address (GDPR)", desc: "Email addresses are personal data under GDPR Article 4(1)." },
  { pattern: /\d{3}[-.]?\d{2}[-.]?\d{4}/g, title: "National ID / SSN (GDPR)", desc: "National identification numbers are personal data requiring protection." },
  { pattern: /(?:born|birth|dob|date of birth)[:\s]+\d/gi, title: "Date of birth reference (GDPR)", desc: "Date of birth is classified as personal data under GDPR." },
];

const HIPAA_PATTERNS = [
  { pattern: /\d{3}[-.]?\d{2}[-.]?\d{4}/g, title: "SSN detected (HIPAA)", desc: "Social Security Numbers are PHI under HIPAA." },
  { pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/g, title: "Email address (HIPAA)", desc: "Email addresses combined with health info may be PHI." },
  { pattern: /(?:patient|diagnosis|treatment|medication|prescription|medical record)/gi, title: "Health information term (HIPAA)", desc: "Health-related terms detected. Ensure no PHI is exposed." },
];

const PCI_PATTERNS = [
  { pattern: /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g, title: "Credit card number (PCI-DSS)", desc: "Credit card numbers must never appear in unencrypted form." },
  { pattern: /\d{3,4}[-]?\d{6}[-]?\d{5}/g, title: "Payment card number variant (PCI-DSS)", desc: "Potential payment card number detected." },
];

let complianceCounter = 0;

function createIssue(regulation: ComplianceIssue["regulation"], severity: ComplianceIssue["severity"], title: string, desc: string, evidence: string, rec: string): ComplianceIssue {
  complianceCounter++;
  return { id: "CI-" + String(complianceCounter).padStart(4, "0"), regulation, severity, title, description: desc, evidence, recommendation: rec };
}

export function checkCompliance(content: string): ComplianceResult {
  complianceCounter = 0;
  const issues: ComplianceIssue[] = [];

  for (const p of GDPR_PATTERNS) {
    const regex = new RegExp(p.pattern.source, p.pattern.flags);
    let m;
    while ((m = regex.exec(content)) !== null) {
      issues.push(createIssue("GDPR", "high", p.title, p.desc, m[0].substring(0, 60), "Ensure consent is obtained and data is processed lawfully under GDPR."));
    }
  }

  for (const p of HIPAA_PATTERNS) {
    const regex = new RegExp(p.pattern.source, p.pattern.flags);
    let m;
    while ((m = regex.exec(content)) !== null) {
      issues.push(createIssue("HIPAA", "critical", p.title, p.desc, m[0].substring(0, 60), "Ensure PHI is encrypted and access is logged per HIPAA requirements."));
    }
  }

  for (const p of PCI_PATTERNS) {
    const regex = new RegExp(p.pattern.source, p.pattern.flags);
    let m;
    while ((m = regex.exec(content)) !== null) {
      issues.push(createIssue("PCI-DSS", "critical", p.title, p.desc, m[0].substring(0, 60), "Credit card data must be encrypted at rest and in transit. Never store plaintext card numbers."));
    }
  }

  const severityPenalty: Record<string, number> = { critical: 20, high: 12, medium: 6, low: 2 };
  let score = 100;
  for (const issue of issues) { score -= severityPenalty[issue.severity] || 0; }
  score = Math.max(0, score);

  const summary = issues.length === 0
    ? "Content appears compliant. No regulatory issues detected."
    : issues.length + " compliance issue(s) found. Score: " + score + "/100.";

  return { compliant: score >= 80, score, issues, summary, scanTimestamp: new Date().toISOString() };
}
