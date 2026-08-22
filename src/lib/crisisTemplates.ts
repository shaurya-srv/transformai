/**
 * Crisis Templates System
 * Pre-built transformation templates for common organizational scenarios.
 * Each template defines default config, output selection, and format instructions.
 */

export interface CrisisTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "security" | "policy" | "incident" | "health" | "corporate";
  defaultConfig: {
    audiences: string[];
    tone: string;
    language: string;
    detail: string;
    objectives: string[];
  };
  defaultOutputs: string[];
  formatInstructions: Record<string, string>;
  sampleSource: string;
}

export const crisisTemplates: CrisisTemplate[] = [
  {
    id: "cve-advisory",
    name: "CVE / Vulnerability Advisory",
    description: "Rapid response to a newly discovered vulnerability. Generates executive summary, employee advisory, technical bulletin, and public statement.",
    icon: "🛡️",
    category: "security",
    defaultConfig: {
      audiences: ["Executives", "Employees", "Technical Team"],
      tone: "Urgent",
      language: "English",
      detail: "Standard",
      objectives: ["Alert", "Inform"],
    },
    defaultOutputs: ["advisory", "executive", "linkedin", "presentation"],
    formatInstructions: {
      advisory: "Include CVSS score, affected versions, IOCs, and prioritized remediation steps.",
      executive: "Focus on business impact, risk level, and decision points for leadership.",
    },
    sampleSource: `CRITICAL SECURITY ADVISORY

Title: Critical Remote Code Execution in Enterprise Firewall (CVE-2024-55555)
Severity: CRITICAL (CVSS 9.8)
Affected Product: NetGuard Firewall versions 8.0-8.4.2
Vendor: CyberShield Inc.

A critical RCE vulnerability has been discovered in NetGuard Firewall. Unauthenticated attackers can execute arbitrary code via a crafted management API request. Active exploitation confirmed.

Affected: All organizations running NetGuard Firewall 8.0 through 8.4.2
Fixed Version: 8.4.3 (released today)

Actions Required:
1. IMMEDIATE: Update to version 8.4.3
2. URGENT: If patching is delayed, disable management API
3. IMPORTANT: Review logs for exploitation indicators
4. Monitor: Enhanced monitoring for suspicious API traffic`,
  },
  {
    id: "data-breach",
    name: "Data Breach Response",
    description: "Coordinate communications after a data breach. Covers internal notification, customer communication, regulatory filing, and public statement.",
    icon: "🔓",
    category: "security",
    defaultConfig: {
      audiences: ["Executives", "Customers", "Employees", "Media"],
      tone: "Formal",
      language: "English",
      detail: "Detailed",
      objectives: ["Inform", "Alert"],
    },
    defaultOutputs: ["advisory", "executive", "linkedin", "twitter"],
    formatInstructions: {
      advisory: "Include what data was affected, timeline, remediation steps, and support resources for affected parties.",
      linkedin: "Professional tone, acknowledge the incident, outline steps taken, express commitment to security.",
    },
    sampleSource: `DATA BREACH NOTIFICATION

Incident: Unauthorized access to customer database
Date Detected: August 20, 2024
Date of Breach: Estimated August 15-18, 2024

Affected Data:
- Customer names and email addresses
- Encrypted passwords (bcrypt, not compromised)
- Phone numbers (approximately 125,000 records)
- Payment card last 4 digits (NO full card numbers)

NOT Affected:
- Full payment card numbers (stored in separate PCI-compliant system)
- Social Security numbers
- Account passwords (bcrypt encrypted, not cracked)

Response Actions:
- Breach contained within 4 hours of detection
- Affected systems isolated and forensics engaged
- Law enforcement notified
- Affected customers will receive individual notifications
- Free credit monitoring offered for 24 months
- Security audit of all systems initiated

Regulatory: GDPR notification filed within 72 hours. CCPA notification pending.`,
  },
  {
    id: "policy-update",
    name: "Policy Change Announcement",
    description: "Communicate organizational policy changes across all levels. Adapts technical policy language for different audiences.",
    icon: "📋",
    category: "policy",
    defaultConfig: {
      audiences: ["Employees", "Executives", "Government Officials"],
      tone: "Professional",
      language: "English",
      detail: "Standard",
      objectives: ["Inform", "Educate"],
    },
    defaultOutputs: ["executive", "advisory", "linkedin", "presentation"],
    formatInstructions: {
      advisory: "Clearly state what changed, why it changed, effective date, and what employees need to do.",
      executive: "Focus on compliance implications and organizational impact.",
    },
    sampleSource: `POLICY UPDATE — WORK FROM HOME REVISION

Effective Date: September 1, 2024
Policy ID: HR-2024-017
Approved by: Board of Directors, August 18, 2024

Key Changes:
1. Remote work days increased from 2 to 3 per week for eligible roles
2. Core office hours changed to 10 AM - 3 PM (from 9 AM - 5 PM)
3. New hot-desking system replacing assigned desks
4. Mandatory in-office days: Tuesday and Thursday (unchanged)
5. Home office stipend increased from $500 to $1,000 annually
6. New requirement: Quarterly in-person team meetings

Eligible Roles: All roles not requiring physical presence (excludes facilities, reception, lab staff)

Manager Approval: Required for individual arrangements exceeding 3 remote days

Data Privacy: Home office setups must comply with updated data handling policy DP-2024-003`,
  },
  {
    id: "incident-response",
    name: "Incident Response Communication",
    description: "Coordinated response communications during an active incident. Time-critical messaging for stakeholders.",
    icon: "🚨",
    category: "incident",
    defaultConfig: {
      audiences: ["Executives", "Employees", "Technical Team"],
      tone: "Urgent",
      language: "English",
      detail: "Brief",
      objectives: ["Alert", "Inform"],
    },
    defaultOutputs: ["advisory", "executive", "twitter"],
    formatInstructions: {
      advisory: "Focus on current status, immediate actions required, and escalation path. Keep it brief and actionable.",
      executive: "Business impact only. What's affected, what's being done, when it will be resolved.",
      twitter: "Concise status update. Current state and next update time.",
    },
    sampleSource: `ACTIVE INCIDENT — SERVICE OUTAGE

Incident ID: INC-2024-8842
Started: 14:23 UTC, August 22, 2024
Status: INVESTIGATING

Affected Services:
- Customer portal (DOWN)
- API gateway (DEGRADED - 50% error rate)
- Internal tools (OPERATIONAL)
- Email (OPERATIONAL)

Impact: Customers cannot access portal. API requests failing intermittently.

Root Cause (Preliminary): Database cluster failover triggered by unexpected load spike. Primary node unresponsive.

Actions Taken:
- Database team engaged (14:25 UTC)
- Traffic rerouted to secondary cluster
- Customer support briefed
- Status page updated

Estimated Resolution: 2 hours (by 16:30 UTC)

Next Update: 15:30 UTC or upon resolution

Escalation: VP Engineering notified. CTO briefed.`,
  },
  {
    id: "health-crisis",
    name: "Health / Safety Advisory",
    description: "Public health or workplace safety communications. Requires clear, accessible language for diverse audiences.",
    icon: "🏥",
    category: "health",
    defaultConfig: {
      audiences: ["General Public", "Employees", "Media"],
      tone: "Simple",
      language: "English",
      detail: "Standard",
      objectives: ["Inform", "Educate"],
    },
    defaultOutputs: ["advisory", "linkedin", "infographic"],
    formatInstructions: {
      advisory: "Use plain language. Include what people should do, symptoms to watch for, and where to get help.",
      infographic: "Key facts, symptoms, prevention steps, emergency contacts. Visual hierarchy for quick scanning.",
    },
    sampleSource: `WORKPLACE HEALTH ADVISORY — HEAT WAVE RESPONSE

Effective: August 22-25, 2024
Severity: HIGH
Affected Areas: All outdoor work sites, warehouses without climate control

Situation:
National Weather Service has issued an excessive heat warning with temperatures expected to reach 105°F (40°C) for 4 consecutive days.

Required Measures:
1. Outdoor work limited to before 10 AM and after 6 PM
2. Mandatory 15-minute cooling breaks every hour
3. Water stations at all outdoor work areas
4. Heat illness training refresher required for all field staff
5. Emergency response kits updated and distributed

Symptoms to Watch For:
- Heat exhaustion: heavy sweating, weakness, nausea, dizziness
- Heat stroke: high body temperature, confusion, loss of consciousness (CALL 911)

Emergency Contacts:
- Workplace Safety Hotline: 1-800-555-SAFE
- On-site first aid: Building managers
- Emergency: 911`,
  },
  {
    id: "research-brief",
    name: "Research / Report Briefing",
    description: "Transform research papers, reports, or findings into executive briefs, summaries, and presentation decks.",
    icon: "📊",
    category: "corporate",
    defaultConfig: {
      audiences: ["Executives", "Technical Team"],
      tone: "Professional",
      language: "English",
      detail: "Detailed",
      objectives: ["Inform", "Summarize"],
    },
    defaultOutputs: ["executive", "presentation", "linkedin"],
    formatInstructions: {
      executive: "Lead with key findings and their business implications. Include methodology summary and confidence levels.",
      presentation: "Research-driven slides: Methodology → Key Findings → Implications → Recommendations → Next Steps.",
    },
    sampleSource: `QUARTERLY CYBERSECURITY THREAT LANDSCAPE REPORT — Q3 2024

Key Findings:
1. Ransomware attacks increased 38% compared to Q2 2024
2. Supply chain attacks now account for 22% of all incidents (up from 15%)
3. AI-generated phishing emails have 3x higher click rates than traditional phishing
4. Average time to detect a breach: 194 days (industry average)
5. Cloud misconfigurations remain the #1 attack vector (31% of incidents)

Top Threats:
- LockBit 4.0 ransomware variant (new encryption method)
- Qakbot resurgence via Microsoft Teams phishing
- Zero-day in Ivanti VPN (CVE-2024-38077)
- credential stuffing attacks on SSO platforms

Recommendations:
1. Implement AI-based email filtering to counter AI phishing
2. Conduct supply chain security audit within 30 days
3. Deploy cloud security posture management (CSPM)
4. Reduce mean time to detect through 24/7 SOC monitoring
5. Update incident response plan for ransomware scenarios

Budget Impact: Recommended additional investment of $2.4M in security infrastructure for Q4.`,
  },
];

/**
 * Get template by ID
 */
export function getTemplate(id: string): CrisisTemplate | undefined {
  return crisisTemplates.find((t) => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: CrisisTemplate["category"]): CrisisTemplate[] {
  return crisisTemplates.filter((t) => t.category === category);
}

/**
 * Get all categories
 */
export function getCategories(): { id: string; label: string; count: number }[] {
  const categories = [
    { id: "security", label: "Security" },
    { id: "policy", label: "Policy" },
    { id: "incident", label: "Incident" },
    { id: "health", label: "Health & Safety" },
    { id: "corporate", label: "Corporate" },
  ];

  return categories.map((c) => ({
    ...c,
    count: crisisTemplates.filter((t) => t.category === c.id).length,
  }));
}
