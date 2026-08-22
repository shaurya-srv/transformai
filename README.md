# TransformAI

### "One Source. Every Communication."

TransformAI is an AI-powered content transformation engine that converts organizational information into multiple audience-specific, format-specific communication deliverables through a single, intelligent workflow.

---

## Problem

Organizations receive vast amounts of information — reports, research, advisories, threat intelligence, policy documents — but lack efficient ways to transform that information into the right communication for the right audience, in the right format, at the right time.

The same cybersecurity report may need to become:
- An executive summary for leadership
- A security advisory for employees
- A LinkedIn post for public communication
- A presentation for a meeting
- A video script for a campaign

Today, this is done manually — slowly, inconsistently, and repetitively.

## Solution

TransformAI automates the entire transformation workflow:

```
Source Content → AI Understanding → Structured Context → Configuration → Multi-Output Generation → Validation → Human Review → Export
```

Upload once, configure audience and tone, select output formats, and let AI generate all deliverables from a single, consistent source context.

---

## Key Features

- **Multi-Format Output** — Generate LinkedIn posts, executive summaries, advisories, presentations, video packages, and infographics from one source
- **Audience-Aware Transformation** — Outputs adapt to target audiences (executives, employees, general public, technical teams)
- **Configurable Tone & Language** — Professional, formal, conversational, urgent, or simple — in English or Hindi
- **Structured Context Engine** — AI extracts a shared context (topic, facts, entities, risks) ensuring consistency across all outputs
- **Human-in-the-Loop** — Edit, regenerate, approve, and export. The AI assists; the human decides
- **Validation Layer** — Source grounding, factual consistency, and format validation checks
- **Real AI + Mock Fallback** — Works with OpenAI API for real transformations; falls back to realistic mock outputs for demos

---

## Real-World Use Cases

### CrowdStrike Global IT Outage (July 2024)
A faulty update caused widespread system outages. The same technical information needed to be communicated differently to IT teams, executives, employees, customers, and the public — all while maintaining consistency.

### Colonial Pipeline Cyberattack (2021)
A ransomware attack required rapid communication across technical, operational, government, customer, and public channels — each requiring different tone, detail, and format.

### COVID-19 Communication
Governments needed to rapidly communicate changing guidelines, restrictions, and health information across websites, press releases, social media, posters, and videos — in multiple languages.

TransformAI addresses all three scenarios through **Audience-Aware + Objective-Aware + Multi-Format transformation**.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              React Frontend                 │
│  (Dashboard, Wizard, Results, Config)       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              Backend API                    │
│  (Next.js API Routes)                      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Input Processor                   │
│  (Text, URL, Document extraction)           │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Context Engine (AI)                │
│  (Structured context extraction)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│       Structured Source Context             │
│  { topic, facts, entities, risks, ... }    │
└──────┬───────────┼───────────┬──────────────┘
       │           │           │
┌──────▼──┐ ┌──────▼──┐ ┌──────▼──┐
│LinkedIn │ │ Advisory│ │  PPT    │
│ Post    │ │         │ │ Slides  │
└──────┬──┘ └──────┬──┘ └──────┬──┘
       │           │           │
┌──────▼───────────▼───────────▼──────────────┐
│          Validation Layer                   │
│  (Source grounding, consistency, format)    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Human Review                      │
│  (Edit, Regenerate, Approve, Export)        │
└─────────────────────────────────────────────┘
```

---

## Workflow

```
1. SOURCE      → Paste text, upload document, or enter URL
2. ANALYZE     → AI extracts structured context (topic, facts, entities, risks)
3. CONFIGURE   → Select audience, tone, language, detail level, objective
4. SELECT      → Choose output formats (LinkedIn, Advisory, Summary, Slides, Video...)
5. TRANSFORM   → AI generates all selected outputs from shared context
6. VALIDATE    → System checks source grounding, consistency, format
7. REVIEW      → Human reviews, edits, regenerates as needed
8. EXPORT      → Copy, download, or approve deliverables
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS, Lucide React icons |
| AI | OpenAI API (gpt-4o-mini) with mock fallback |
| State | React hooks (useState, useCallback) |
| Styling | Enterprise design system (slate/indigo palette) |

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

```bash
git clone https://github.com/your-team/transformai.git
cd transformai
npm install
```

### Environment Variables

Create `.env.local`:

```env
# Optional — for real AI transformations
OPENAI_API_KEY=your-openai-api-key

# Without this key, the app uses realistic mock outputs
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## Demo

### Quick Demo Flow (2 minutes)

1. **Dashboard** — View stats and recent transformations
2. **New Transformation** — Click "New Transformation" or "Get Started"
3. **Source Input** — Click "Load Sample Advisory" to load a cybersecurity advisory
4. **AI Analysis** — Watch the 9-step analysis pipeline animate
5. **Configure** — Select Executives + Employees, Professional tone, Inform + Alert objectives
6. **Select Outputs** — Check LinkedIn, Executive Summary, Advisory, Presentation, Video (5 deliverables)
7. **Transform** — Click "Transform" and watch the generation
8. **Review Results** — Browse through each output tab, copy, download, or regenerate

### Demo Scenario

**Input:** Critical VPN Vulnerability Advisory (CVE-2024-38816)
**Configuration:** Executives + Employees, Professional, Inform + Alert, English, Standard detail
**Outputs:** LinkedIn Post, Executive Summary, Advisory, Presentation, Video Package

The demo proves: **One source → Multiple useful outputs → Consistent messaging**

---

## Screenshots

> Screenshots to be added after demo recording

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard
│   ├── globals.css         # Tailwind theme + animations
│   ├── transform/page.tsx  # 5-step transformation wizard
│   ├── results/page.tsx    # Results viewer
│   └── api/
│       ├── analyze/route.js   # AI context extraction
│       └── transform/route.js # Multi-output generation
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── StepIndicator.tsx    # Wizard progress bar
│   ├── SourceInput.tsx      # Text/URL/Document input
│   ├── AiPipeline.tsx       # Animated AI processing
│   ├── ConfigPanel.tsx      # Audience/tone/language controls
│   ├── OutputSelector.tsx   # Multi-select output formats
│   ├── ResultsView.tsx      # Tabbed output display + actions
│   ├── ValidationBadges.tsx # Quality check indicators
│   └── Toast.tsx            # Notification system
├── hooks/
│   └── useTransform.ts      # Workflow state management
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── ai.ts                # AI engine (OpenAI + mock fallback)
│   └── mockData.ts          # Demo data & mock outputs
```

---

## Team

| Member | Role | Responsibilities |
|--------|------|-----------------|
| Hardik | Frontend Developer | Dashboard, UI, Responsive Design, Integration |
| Shourya | Backend Developer | API, AI Integration, Context Engine, Output Generation |
| Gehna | Product / Presentation | Problem Research, Demo Narrative, Judge Explanation |
| Anushka | Research / Presentation | Case Studies, Architecture Docs, Pitch, Q&A |

---

## Future Scope

- **Document Upload** — PDF/DOCX parsing and extraction
- **URL Fetching** — Auto-extract content from news articles and web pages
- **Image/OCR** — Extract text from images and screenshots
- **Real-time Monitoring** — Auto-detect new information sources
- **Multi-language** — Hindi, Hinglish, and other Indian languages
- **Export Formats** — PDF, PPTX, DOCX download
- **Approval Workflows** — Multi-stage review for government/enterprise
- **Role-based Access** — Team management and permissions
- **API Integrations** — Connect to organizational knowledge bases
- **Analytics Dashboard** — Track transformation metrics and usage patterns

---

## License

MIT

---

> **"Understand once. Transform everywhere."**
