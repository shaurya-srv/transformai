// ── Random Demo Sources ──────────────────────────────────────────────────
export const randomDemoSources: Array<{
  title: string;
  source: string;
  outputs: string[];
  tone: string;
  audiences: string[];
  objectives: string[];
  style: string;
}> = [
  {
    title: "Healthcare Data Breach",
    source: `DATA BREACH NOTIFICATION — CONFIDENTIAL PATIENT INFORMATION

Organization: Metro Health Systems
Date of Breach: August 10, 2024
Date Discovered: August 18, 2024

SUMMARY
Metro Health Systems has experienced a data breach affecting approximately 85,000 patients. The breach involved unauthorized access to electronic health records through a compromised third-party vendor API.

AFFECTED DATA
- Patient names, dates of birth, and Social Security numbers
- Medical record numbers and diagnosis codes
- Insurance information and treatment histories
- Prescription records for approximately 12,000 patients

WHAT HAPPENED
An unauthorized actor gained access to a third-party API integration used for claims processing. The API vulnerability allowed access to patient records without proper authentication tokens. The access occurred between August 10-17, 2024.

WHAT WE ARE DOING
- Engaged cybersecurity forensics firm CrowdStrike
- Notified HHS Office for Civil Rights
- Secured the vulnerable API endpoint
- Implementing enhanced API authentication requirements
- Offering 24 months of free credit monitoring to affected patients

AFFECTED INDIVIDUALS SHOULD
- Monitor insurance statements for unauthorized claims
- Place fraud alerts with credit bureaus
- Report suspicious medical bills to our breach hotline
- Visit metrohealth.com/breach for updates

Contact: breach-response@metrohealth.com | 1-800-555-0199`,
    outputs: ["advisory", "linkedin", "executive"],
    tone: "Urgent",
    audiences: ["General", "Executive"],
    objectives: ["Alert", "Inform"],
    style: "Corporate",
  },
  {
    title: "AI Policy Announcement",
    source: `POLICY ANNOUNCEMENT — ARTIFICIAL INTELLIGENCE GOVERNANCE FRAMEWORK

Effective Date: September 1, 2024
Issued by: Office of the Chief Technology Officer
Applies to: All departments and divisions

OVERVIEW
The organization is adopting a comprehensive AI Governance Framework to ensure responsible, transparent, and ethical use of artificial intelligence technologies across all business operations.

KEY POLICY PROVISIONS

1. AI USE CASE REGISTER
All departments must register AI use cases in the central AI Registry before deployment. This includes machine learning models, natural language processing tools, computer vision systems, and automated decision-making systems.

2. RISK CLASSIFICATION
AI systems are classified into three tiers:
- Tier 1 (Low Risk): Internal tools with no direct impact on individuals
- Tier 2 (Medium Risk): Systems that influence business decisions
- Tier 3 (High Risk): Systems affecting employee rights, customer outcomes, or regulatory compliance

3. MANDATORY REQUIREMENTS
- All Tier 2 and Tier 3 AI systems require bias audits quarterly
- Human-in-the-loop approval required for automated decisions affecting individuals
- AI-generated content must be clearly labeled
- Model training data must be documented and traceable
- Annual AI ethics training for all employees

4. GOVERNANCE COMMITTEE
An AI Ethics Review Board will oversee implementation, comprising representatives from Legal, IT, HR, Data Science, and external ethics advisors.

5. ENFORCEMENT
Non-compliance may result in system suspension, disciplinary action, and regulatory reporting where required.

For questions, contact ai-governance@organization.com`,
    outputs: ["linkedin", "executive", "presentation"],
    tone: "Professional",
    audiences: ["Executive", "General"],
    objectives: ["Inform", "Educate"],
    style: "Formal",
  },
  {
    title: "Product Launch — Smart Water Grid",
    source: `PRODUCT LAUNCH ANNOUNCEMENT

Product: AquaSense Smart Water Grid Platform
Launch Date: September 15, 2024
Company: HydroTech Solutions

OVERVIEW
HydroTech Solutions today announced the launch of AquaSense, an AI-powered smart water grid management platform designed to reduce water waste by up to 40% in urban distribution networks.

KEY FEATURES
- Real-time leak detection using IoT sensors and ML algorithms
- Predictive maintenance for water infrastructure
- Dynamic pressure optimization to reduce pipe stress
- Consumer-facing dashboard for water usage insights
- Integration with existing SCADA systems
- Automated regulatory compliance reporting

MARKET OPPORTUNITY
- Global smart water market projected to reach $31.2B by 2028
- 40% of urban water systems lose 20-30% of treated water to leaks
- Municipalities face increasing regulatory pressure to reduce waste
- Current solutions are fragmented and lack AI integration

EARLY ADOPTERS
Three pilot programs have demonstrated results:
- City of Portland: 34% reduction in non-revenue water loss
- Singapore Public Utilities Board: 28% reduction in pipe bursts
- Thames Water (UK): 22% improvement in pressure management

PRICING
- SaaS platform starting at $15,000/month for municipalities
- Enterprise licensing available for water utilities
- Free pilot program for qualifying organizations

QUOTES
"Water is the next critical infrastructure frontier. AquaSense brings AI-powered intelligence to a sector that hasn't changed in decades." — Dr. Sarah Chen, CEO of HydroTech Solutions

MEDIA CONTACT
press@hydrotech.com | +1 (555) 234-5678`,
    outputs: ["linkedin", "video", "executive"],
    tone: "Conversational",
    audiences: ["General", "Media"],
    objectives: ["Persuade", "Engage"],
    style: "Editorial",
  },
  {
    title: "Incident Response — Cloud Outage",
    source: `INCIDENT REPORT — CLOUD SERVICE OUTAGE

Incident ID: INC-2024-0819-001
Severity: SEV-1 (Critical)
Status: Resolved
Date: August 19, 2024
Duration: 4 hours 23 minutes

IMPACT SUMMARY
A critical outage affected the primary cloud computing platform serving 2,400 enterprise customers across North America. Services were unavailable from 02:15 AM to 06:38 AM EDT.

AFFECTED SERVICES
- Virtual machine instances (us-east-1 region)
- Object storage API endpoints
- Database read replicas
- CDN edge nodes in 12 cities
- Developer console and API management portal

ROOT CAUSE
A routine certificate rotation script contained a logic error that revoked active TLS certificates before new ones were deployed. This created a cascading failure across internal service mesh communication.

TIMELINE
- 02:15 AM: Automated certificate rotation initiated
- 02:17 AM: Service mesh health checks begin failing
- 02:22 AM: Alerting system triggers SEV-1 escalation
- 02:30 AM: Incident response team engaged
- 03:00 AM: Root cause identified
- 03:45 AM: Emergency rollback initiated
- 05:30 AM: Certificate chain restored
- 06:38 AM: All services confirmed operational

REMEDIATION
- Certificate rotation script patched and tested
- Canary deployment process implemented for future rotations
- Additional pre-flight checks added to deployment pipeline
- Post-mortem scheduled for August 26, 2024

CUSTOMER IMPACT
- 2,400 enterprise customers affected
- 847 support tickets generated
- SLA credits will be automatically applied
- Dedicated support channel opened for affected customers

Contact: incident-response@cloudops.com`,
    outputs: ["advisory", "executive", "presentation"],
    tone: "Professional",
    audiences: ["Executive", "Technical"],
    objectives: ["Inform", "Alert"],
    style: "Corporate",
  },
  {
    title: "Climate Research Report",
    source: `RESEARCH BRIEFING — CLIMATE ADAPTATION INFRASTRUCTURE

Published: August 2024
Institution: Global Climate Resilience Institute
Report ID: GCRI-2024-08

EXECUTIVE OVERVIEW
This report examines the infrastructure investment gap for climate adaptation in coastal cities worldwide. Analysis of 150 coastal metropolitan areas reveals that current adaptation spending covers only 23% of estimated needs through 2040.

KEY FINDINGS

1. INVESTMENT GAP
- Total estimated adaptation need: $3.2 trillion through 2040
- Current committed funding: $740 billion (23%)
- Annual shortfall: approximately $150 billion per year

2. HIGHEST-RISK REGIONS
- Southeast Asia: $890B needed, $180B committed
- Sub-Saharan Africa: $520B needed, $95B committed
- Caribbean Islands: $180B needed, $42B committed
- Mediterranean Europe: $310B needed, $110B committed

3. CRITICAL INFRASTRUCTURE NEEDS
- Flood defense systems: 34% of total need
- Water supply resilience: 22%
- Coastal transportation: 18%
- Energy grid hardening: 15%
- Communication networks: 11%

4. ECONOMIC CONSEQUENCES OF INACTION
- For every $1 not invested in adaptation, $7 in damages expected by 2040
- GDP impact in high-risk regions: 2-6% reduction by 2040
- Displacement risk: 180 million people by 2040

5. RECOMMENDATIONS
- Establish international climate adaptation fund ($500B target)
- Mandate climate risk disclosure for infrastructure projects
- Accelerate nature-based solutions (mangroves, wetlands)
- Develop parametric insurance for rapid disaster response
- Create public-private partnerships for coastal resilience

METHODOLOGY
Analysis of World Bank, IPCC AR6, OECD infrastructure databases, and 47 peer-reviewed studies. Economic modeling conducted using integrated assessment framework (DICE-Regional).

Contact: research@gcri.org`,
    outputs: ["executive", "infographic", "presentation"],
    tone: "Authoritative",
    audiences: ["Executive", "Technical"],
    objectives: ["Inform", "Educate"],
    style: "Corporate",
  },
];

// Sample source content for demo (first item)
export const sampleSource = randomDemoSources[0].source;

// Legacy alias for backwards compatibility
const legacySampleSource = `CRITICAL SECURITY ADVISORY — ACTIVE EXPLOITATION DETECTED

Title: Critical Vulnerability in Enterprise VPN Infrastructure (CVE-2024-38816)
Severity: CRITICAL (CVSS 9.8)
Date: July 15, 2024
Affected Product: SecureConnect VPN Gateway versions 4.2.0 through 4.5.3
Vendor: NovaTech Systems

SUMMARY
NovaTech Systems has identified a critical remote code execution vulnerability in its SecureConnect VPN Gateway product. The vulnerability, tracked as CVE-2024-38816, allows unauthenticated attackers to execute arbitrary code on affected systems through a specially crafted authentication request.

TECHNICAL DETAILS
The vulnerability exists in the authentication handler of the VPN Gateway's web management interface. An attacker can exploit this flaw by sending a crafted HTTP POST request to the /api/auth endpoint with a malformed JSON payload containing a buffer overflow in the username field.

Affected versions: 4.2.0, 4.2.1, 4.3.0, 4.3.1, 4.3.2, 4.4.0, 4.4.1, 4.5.0, 4.5.1, 4.5.2, 4.5.3
Fixed version: 4.5.4 (released July 14, 2024)

INDICATORS OF COMPROMISE
- Unusual authentication requests from external IPs to /api/auth endpoint
- Unexpected process execution (cmd.exe, /bin/sh) following authentication attempts
- Log entries showing malformed JSON payloads in authentication logs
- Network connections to known C2 infrastructure: 198.51.100.0/24

IMPACT
Successful exploitation grants the attacker full administrative access to the VPN Gateway, enabling:
- Complete network traffic interception
- Unauthorized access to internal resources
- Potential lateral movement across the network
- Data exfiltration capabilities
- Deployment of additional malicious tools

AFFECTED ORGANIZATIONS
Any organization running SecureConnect VPN Gateway versions 4.2.0 through 4.5.3 is potentially vulnerable. This includes government agencies, financial institutions, healthcare providers, and enterprise environments using NovaTech's VPN solution.

RECOMMENDED ACTIONS
1. IMMEDIATE: Update SecureConnect VPN Gateway to version 4.5.4
2. IMMEDIATE: If immediate patching is not possible, disable the web management interface
3. URGENT: Review authentication logs for indicators of compromise
4. URGENT: Block known C2 IP ranges at the perimeter firewall
5. IMPORTANT: Conduct a full security audit of systems accessible via the VPN
6. IMPORTANT: Reset all VPN user credentials as a precaution
7. MONITORING: Implement enhanced monitoring for suspicious authentication activity

TIMELINE
- July 10, 2024: Vulnerability discovered during internal security review
- July 12, 2024: Vendor notified
- July 14, 2024: Patch released (version 4.5.4)
- July 15, 2024: Public disclosure and advisory issued
- July 15, 2024: Active exploitation observed in the wild

REFERENCES
- NovaTech Security Bulletin NSB-2024-0047
- NVD Entry: CVE-2024-38816
- CISA Advisory AA24-197A`;

// Structured context extracted from source
export const mockContext = {
  topic: "Critical VPN Vulnerability — Active Exploitation",
  source_type: "Security Advisory",
  summary:
    "A critical remote code execution vulnerability (CVE-2024-38816, CVSS 9.8) has been discovered in NovaTech SecureConnect VPN Gateway versions 4.2.0 through 4.5.3. Active exploitation has been observed in the wild. Patch version 4.5.4 is available.",
  key_facts: [
    "CVE-2024-38816 with CVSS score of 9.8 (Critical)",
    "Affects SecureConnect VPN Gateway versions 4.2.0 through 4.5.3",
    "Unauthenticated remote code execution via /api/auth endpoint",
    "Active exploitation observed since July 15, 2024",
    "Patch available: version 4.5.4 released July 14, 2024",
  ],
  entities: [
    "NovaTech Systems",
    "SecureConnect VPN Gateway",
    "CVE-2024-38816",
    "CISA",
    "NVD",
  ],
  dates: [
    "July 10, 2024 — Vulnerability discovered",
    "July 14, 2024 — Patch released",
    "July 15, 2024 — Public disclosure and active exploitation",
  ],
  numbers: {
    cvss: 9.8,
    affected_versions: 11,
    affected_range: "4.2.0 - 4.5.3",
    fixed_version: "4.5.4",
  },
  risks: [
    "Full administrative access to VPN Gateway",
    "Complete network traffic interception",
    "Unauthorized access to internal resources",
    "Lateral movement across the network",
    "Data exfiltration capabilities",
  ],
  recommendations: [
    "Update to SecureConnect VPN Gateway version 4.5.4 immediately",
    "Disable web management interface if patching is delayed",
    "Review authentication logs for IOCs",
    "Block known C2 IP ranges at perimeter",
    "Conduct full security audit of VPN-accessible systems",
    "Reset all VPN user credentials",
  ],
  intent: "alert",
  confidence: 0.96,
};

// Mock outputs for each format
export const mockOutputs: Record<string, { title: string; content: string }> =
  {
    linkedin: {
      title: "LinkedIn Post",
      content: `🚨 Critical Security Alert: VPN Vulnerability Under Active Attack

A severe remote code execution vulnerability (CVE-2024-38816, CVSS 9.8) has been found in NovaTech's SecureConnect VPN Gateway — and it's already being exploited in the wild.

Here's what every organization needs to know:

📌 The vulnerability affects versions 4.2.0 through 4.5.3 of SecureConnect VPN Gateway.

📌 Attackers can execute arbitrary code without authentication through the web management interface.

📌 Active exploitation has been confirmed as of July 15, 2024.

What makes this critical is the attack vector — no credentials required. An attacker can gain full administrative access, intercept network traffic, and move laterally across your infrastructure.

Immediate actions:
✅ Update to version 4.5.4 (patched July 14)
✅ Disable the web management interface if you can't patch immediately
✅ Review authentication logs for IOCs
✅ Block C2 IP ranges at your perimeter firewall

This is a reminder that perimeter security devices are high-value targets. VPN gateways sit at the edge of your network — a compromise here can cascade across your entire environment.

Don't wait. Patch now.

#CyberSecurity #VPN #InfoSec #CVE2024 #NetworkSecurity #VulnerabilityManagement #ZeroTrust`,
    },

    twitter: {
      title: "X/Twitter Post",
      content: `🚨 CRITICAL: Remote code execution vulnerability found in NovaTech SecureConnect VPN Gateway (CVE-2024-38816, CVSS 9.8).

Already being actively exploited. No auth required.

→ Update to v4.5.4 NOW
→ If you can't patch, disable web mgmt interface
→ Check logs for IOCs

#CyberSecurity #CVE2024`,
    },

    executive: {
      title: "Executive Summary",
      content: `EXECUTIVE SUMMARY
Critical VPN Security Vulnerability — Immediate Action Required

────────────────────────────────────────

OVERVIEW

A critical security vulnerability (CVE-2024-38816) has been identified in the NovaTech SecureConnect VPN Gateway, a product widely used across our network infrastructure. The vulnerability carries a CVSS severity score of 9.8 out of 10 — the highest practical risk level.

Active exploitation has been confirmed as of July 15, 2024, meaning threat actors are currently targeting organizations using the affected software.

────────────────────────────────────────

KEY FINDINGS

• The vulnerability allows unauthenticated attackers to execute arbitrary code on VPN Gateway devices
• All versions from 4.2.0 through 4.5.3 are affected (11 versions total)
• A patch (version 4.5.4) was released on July 14, 2024 — one day before public disclosure
• Attackers can gain complete administrative control of the VPN device

────────────────────────────────────────

BUSINESS IMPACT

If exploited, this vulnerability could result in:

• Complete compromise of VPN gateway infrastructure
• Unauthorized access to internal network resources
• Potential exposure of sensitive organizational data
• Disruption of remote access capabilities for employees and partners
• Regulatory and compliance implications (data breach notification requirements)

────────────────────────────────────────

RISK ASSESSMENT

Severity: CRITICAL
Exploitability: Active exploitation confirmed in the wild
Attack Complexity: Low (no authentication required)
Business Impact: High — VPN infrastructure is a critical access point

────────────────────────────────────────

RECOMMENDED ACTIONS

1. IMMEDIATE (within 24 hours): Update all SecureConnect VPN Gateways to version 4.5.4
2. IMMEDIATE: If patching is delayed, disable the web management interface as a temporary measure
3. URGENT (within 48 hours): Conduct log review for indicators of compromise
4. IMPORTANT (within 1 week): Perform a comprehensive security audit of all systems accessible via the VPN
5. IMPORTANT: Reset VPN user credentials as a precautionary measure

────────────────────────────────────────

DECISION POINTS

• Do we have SecureConnect VPN Gateways in our environment? (IT Security to confirm)
• What is our patch deployment timeline? (Infrastructure team to assess)
• Do we need to activate our incident response plan? (CISO recommendation: Yes, as a precaution)

────────────────────────────────────────

Prepared by: Security Operations Center
Classification: Internal — Confidential
Date: July 15, 2024`,
    },

    advisory: {
      title: "Security Advisory",
      content: `╔══════════════════════════════════════════════════╗
║           SECURITY ADVISORY                     ║
║    CRITICAL — IMMEDIATE ACTION REQUIRED          ║
╚══════════════════════════════════════════════════╝

ADVISORY ID: SA-2024-0047
DATE: July 15, 2024
SEVERITY: CRITICAL (CVSS 9.8)
STATUS: Active exploitation confirmed

────────────────────────────────────────

TITLE
Critical Remote Code Execution Vulnerability in NovaTech SecureConnect VPN Gateway (CVE-2024-38816)

────────────────────────────────────────

SITUATION
A critical vulnerability has been discovered in NovaTech SecureConnect VPN Gateway that allows unauthenticated remote code execution. Threat actors are actively exploiting this vulnerability in targeted attacks against organizations worldwide.

────────────────────────────────────────

AFFECTED SYSTEMS
• Product: NovaTech SecureConnect VPN Gateway
• Versions: 4.2.0, 4.2.1, 4.3.0, 4.3.1, 4.3.2, 4.4.0, 4.4.1, 4.5.0, 4.5.1, 4.5.2, 4.5.3
• Fixed Version: 4.5.4
• Component: Web management interface authentication handler

────────────────────────────────────────

IMPACT
An attacker exploiting this vulnerability can:
• Execute arbitrary code with system-level privileges
• Gain full administrative access to the VPN gateway
• Intercept and manipulate network traffic
• Access internal network resources
• Move laterally across the network
• Exfiltrate sensitive data

────────────────────────────────────────

INDICATORS OF COMPROMISE
• Unusual POST requests to /api/auth endpoint from external IP addresses
• Unexpected process spawning (cmd.exe, /bin/sh) after authentication attempts
• Malformed JSON payloads in authentication logs
• Outbound connections to IP range 198.51.100.0/24

────────────────────────────────────────

RECOMMENDED ACTIONS

PRIORITY 1 — IMMEDIATE (within 24 hours):
□ Update SecureConnect VPN Gateway to version 4.5.4
□ If immediate patching is not feasible, disable the web management interface
□ Block IP range 198.51.100.0/24 at perimeter firewalls

PRIORITY 2 — URGENT (within 48 hours):
□ Review VPN Gateway authentication logs for IOCs
□ Conduct network traffic analysis for signs of compromise
□ Brief executive leadership on incident status

PRIORITY 3 — IMPORTANT (within 1 week):
□ Perform comprehensive security audit of VPN-accessible systems
□ Reset all VPN user credentials
□ Update incident response documentation
□ Conduct awareness briefing for IT staff

────────────────────────────────────────

AFFECTED STAKEHOLDERS
• IT Security Operations
• Network Infrastructure Team
• System Administrators
• Remote Access Users
• Executive Leadership
• Third-party Partners with VPN access

────────────────────────────────────────

REFERENCES
• NovaTech Security Bulletin: NSB-2024-0047
• NVD: CVE-2024-38816
• CISA Advisory: AA24-197A

────────────────────────────────────────

POINT OF CONTACT
Security Operations Center
Email: soc@organization.gov
Phone: [SOC Hotline]

This advisory will be updated as new information becomes available.

Classification: Internal — Restricted`,
    },

    presentation: {
      title: "Presentation",
      content: `SLIDE 1 — SITUATION OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: Critical VPN Vulnerability — Immediate Response Required

• Date: July 15, 2024
• Severity: CRITICAL (CVSS 9.8)
• Status: Active exploitation in the wild
• Source: NovaTech Security Bulletin NSB-2024-0047

Speaker Notes:
"This briefing addresses a critical security vulnerability that requires immediate organizational response. Active exploitation has been confirmed, making this a time-sensitive priority."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SLIDE 2 — WHAT HAPPENED?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: Vulnerability Details — CVE-2024-38816

Key Points:
• Remote code execution flaw in SecureConnect VPN Gateway
• Affects versions 4.2.0 through 4.5.3 (11 versions)
• Exploitable without authentication
• Attack vector: Crafted HTTP request to /api/auth endpoint
• Patch released: July 14, 2024 (v4.5.4)

Speaker Notes:
"The vulnerability exists in the authentication handler of the VPN Gateway's web management interface. No credentials are required to exploit it — an attacker simply needs network access to the management port."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SLIDE 3 — KEY FINDINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: Impact Assessment

• CVSS Score: 9.8/10 (Critical)
• Attack Complexity: Low
• Privileges Required: None
• User Interaction: None
• Confidentiality Impact: High
• Integrity Impact: High
• Availability Impact: High
• Exploit Status: Actively exploited since July 15

Speaker Notes:
"With a CVSS of 9.8 and active exploitation confirmed, this represents one of the most severe vulnerabilities we've seen in perimeter infrastructure this year. The attack requires no authentication and no user interaction."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SLIDE 4 — RISKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: Business Risk Assessment

If exploited, attackers can:
• Gain full administrative control of VPN gateway
• Intercept all network traffic traversing the VPN
• Access internal resources as a trusted user
• Move laterally across the network
• Exfiltrate sensitive data undetected
• Deploy additional malicious tools

Organizational Impact:
• Data breach potential
• Business continuity disruption
• Regulatory compliance exposure
• Reputational damage

Speaker Notes:
"The VPN gateway is a crown jewel target. Compromise here means the attacker sits at the front door of our entire network with full visibility and access."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SLIDE 5 — RECOMMENDED ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: Response Plan

Immediate (24 hours):
• Deploy patch v4.5.4 to all VPN gateways
• Disable web management interface as temporary measure
• Block C2 IP ranges at perimeter

Urgent (48 hours):
• Review authentication logs for IOCs
• Conduct network traffic analysis
• Brief executive leadership

Within 1 week:
• Full security audit of VPN-accessible systems
• Reset all VPN credentials
• Update incident response documentation

Speaker Notes:
"Our top priority is patching. If we can't deploy the patch immediately, disabling the web management interface eliminates the attack surface. We then need to determine whether any compromise has already occurred."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SLIDE 6 — CONCLUSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: Summary & Next Steps

Key Takeaways:
• Critical vulnerability with active exploitation — time is of the essence
• Patch v4.5.4 resolves the issue — update immediately
• Assume breach until proven otherwise — investigate logs
• Coordinate response across IT, Security, and Leadership

Decision Required:
1. Confirm all VPN gateway versions in our environment
2. Approve emergency patching window
3. Activate incident response procedures
4. Schedule 48-hour status review

"One Source. Every Communication."

Speaker Notes:
"This is a call to action. We have the information, we have the patch, and we know the risks. What we need now is swift, coordinated execution. Let's protect our infrastructure."`,
    },

    infographic: {
      title: "Infographic Specification",
      content: `INFOGRAPHIC — CVE-2024-38816 VPN Vulnerability

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HEADLINE
"CRITICAL: VPN Vulnerability Under Active Attack"

SUBTITLE
CVE-2024-38816 | CVSS 9.8 | NovaTech SecureConnect VPN Gateway

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1: THE THREAT (Top — Red accent)

Key Visual: Shield with warning icon

Stats to display:
• CVSS Score: 9.8 / 10
• Versions Affected: 11 (4.2.0 → 4.5.3)
• Auth Required: NO
• Active Exploitation: YES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 2: WHAT'S AT RISK (Middle — Orange accent)

Key Visual: Network diagram with threat indicators

Risk icons + labels:
🔒 Full admin access to VPN gateway
🌐 Network traffic interception
🔓 Internal resource access
↔️ Lateral network movement
📤 Data exfiltration
🖥️ Malware deployment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 3: TAKE ACTION (Bottom — Green accent)

Key Visual: Checklist / action items

Step 1: UPDATE to v4.5.4 (icon: download arrow)
Step 2: DISABLE web management (icon: power off)
Step 3: REVIEW logs for IOCs (icon: search)
Step 4: BLOCK C2 IPs (icon: shield)
Step 5: AUDIT VPN systems (icon: clipboard)
Step 6: RESET credentials (icon: key)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOOTER
Sources: NovaTech NSB-2024-0047 | NVD CVE-2024-38816 | CISA AA24-197A
Date: July 15, 2024

DESIGN NOTES:
• Color scheme: Red (#DC2626) for threat, Orange (#EA580C) for risk, Green (#16A34A) for actions
• Layout: Vertical flow, top to bottom
• Typography: Bold headlines, clean sans-serif
• Style: Enterprise/government operations feel
• Dimensions: 1080 x 1920 (social-friendly vertical)`,
    },

    video: {
      title: "Video Package",
      content: `VIDEO PACKAGE — CVE-2024-38816 VPN Vulnerability Alert

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VIDEO TITLE
"Critical VPN Vulnerability Alert — What You Need to Know"

DURATION: 2:30
FORMAT: 16:9 (1920x1080)
STYLE: Corporate security briefing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENE 1 — HOOK (0:00 – 0:15)

Visual: Dark screen with red alert graphic, text "CRITICAL SECURITY ALERT" appearing with impact
Background: Subtle digital grid animation

Narration:
"A critical vulnerability in widely-used VPN software is under active attack right now. If your organization uses NovaTech SecureConnect, you need to act immediately."

On-screen text: CVE-2024-38816 | CVSS 9.8 | CRITICAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENE 2 — THE VULNERABILITY (0:15 – 0:45)

Visual: Clean infographic showing affected software versions, attack vector diagram
Animation: Version numbers highlighting, connection lines showing attack path

Narration:
"Here's what happened. Security researchers discovered a remote code execution vulnerability in NovaTech's SecureConnect VPN Gateway. The flaw affects versions 4.2.0 through 4.5.3. What makes this particularly dangerous? An attacker needs zero authentication. They simply send a crafted request to the management interface and they're in."

On-screen: Version range, "No Authentication Required" callout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENE 3 — THE RISK (0:45 – 1:15)

Visual: Network compromise diagram showing attacker gaining access, lateral movement
Animation: Red flow paths through network topology

Narration:
"Once inside, the attacker has full administrative control. They can intercept your network traffic, access internal systems, move laterally across your infrastructure, and exfiltrate sensitive data. This isn't theoretical — active exploitation has been confirmed as of July 15th."

On-screen: Risk impact icons appearing one by one

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENE 4 — TAKE ACTION (1:15 – 2:00)

Visual: Clean numbered action list with checkmarks appearing
Animation: Steps revealing sequentially

Narration:
"Here's what you need to do right now. First, update all SecureConnect VPN Gateways to version 4.5.4. If you can't patch immediately, disable the web management interface. Next, review your authentication logs for signs of compromise. Block the known command-and-control IP ranges at your perimeter. And finally, conduct a full security audit of systems accessible through the VPN."

On-screen: 5 action items with icons, appearing in sequence

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENE 5 — CLOSING (2:00 – 2:30)

Visual: TransformAI branded closing screen
Animation: Fade to clean white/indigo background

Narration:
"Don't wait until it's too late. Patch now, investigate, and secure your infrastructure. For more security advisories and AI-powered communication tools, visit TransformAI. One source, every communication."

On-screen: 
"Patch Now. Investigate. Secure."
TransformAI logo
"One Source. Every Communication."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUBTITLE FILE: Available as .srt format
MUSIC: Corporate ambient, low-key, builds urgency in scene 3-4
GRAPHICS: Clean, enterprise style. Red for threats, green for solutions.`,
    },
  };

// Mock history data
export const mockHistory = [
  {
    id: "1",
    title: "Critical VPN Vulnerability Advisory",
    outputs: 5,
    date: "Today, 2:30 PM",
    status: "completed",
  },
  {
    id: "2",
    title: "Q3 Security Policy Update",
    outputs: 3,
    date: "Yesterday, 10:15 AM",
    status: "completed",
  },
  {
    id: "3",
    title: "Global Incident Response Report",
    outputs: 4,
    date: "Aug 20, 3:45 PM",
    status: "completed",
  },
  {
    id: "4",
    title: "Cloud Migration Research Paper",
    outputs: 3,
    date: "Aug 18, 11:00 AM",
    status: "completed",
  },
  {
    id: "5",
    title: "Workplace Safety Announcement",
    outputs: 2,
    date: "Aug 15, 9:30 AM",
    status: "completed",
  },
];
