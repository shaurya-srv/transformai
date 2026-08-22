import { mockContext, mockOutputs } from "./mockData";

// Structured context type
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

export interface TransformationConfig {
  audiences: string[];
  tone: string;
  language: string;
  detail: string;
  objectives: string[];
}

export interface GeneratedOutput {
  title: string;
  content: string;
  format: string;
  validated: boolean;
}

// Check if OpenAI API key is available
function hasOpenAIKey(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Extract structured context from source content
export async function extractContext(
  content: string
): Promise<SourceContext> {
  if (hasOpenAIKey()) {
    return await extractContextWithAI(content);
  }
  return getMockContext(content);
}

// Generate outputs from context + config
export async function generateOutputs(
  context: SourceContext,
  config: TransformationConfig,
  outputTypes: string[]
): Promise<GeneratedOutput[]> {
  if (hasOpenAIKey()) {
    return await generateOutputsWithAI(context, config, outputTypes);
  }
  return getMockOutputs(outputTypes);
}

// ─── OpenAI Integration ─────────────────────────────────────────────────

async function extractContextWithAI(content: string): Promise<SourceContext> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a content analysis engine. Analyze the provided source content and extract a structured context object. Return ONLY valid JSON with no markdown formatting.

The JSON structure must be:
{
  "topic": "string - main topic",
  "source_type": "string - type of document",
  "summary": "string - 2-3 sentence summary",
  "key_facts": ["string - array of key facts"],
  "entities": ["string - named entities"],
  "dates": ["string - important dates with context"],
  "numbers": {},
  "risks": ["string - identified risks"],
  "recommendations": ["string - recommended actions"],
  "intent": "one of: inform, alert, educate, persuade",
  "confidence": 0.0-1.0
}`,
        },
        {
          role: "user",
          content: `Analyze this source content and extract the structured context:\n\n${content}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  // Ensure all required fields exist with defaults
  return {
    topic: parsed.topic || "Unknown Topic",
    source_type: parsed.source_type || "Document",
    summary: parsed.summary || "",
    key_facts: parsed.key_facts || [],
    entities: parsed.entities || [],
    dates: parsed.dates || [],
    numbers: parsed.numbers || {},
    risks: parsed.risks || [],
    recommendations: parsed.recommendations || [],
    intent: parsed.intent || "inform",
    confidence: parsed.confidence || 0.8,
  };
}

const outputPrompts: Record<string, string> = {
  linkedin: `Generate a professional LinkedIn post (150-300 words). Structure:
- Strong hook opening line
- Professional body with key insights
- Clear takeaways
- Call to action
- 3-5 relevant hashtags
Keep it professional and insightful. Use line breaks for readability.`,

  twitter: `Generate an X/Twitter post (under 280 characters). Make it:
- Concise and impactful
- Include the most critical information
- Add 2-3 relevant hashtags
- Clear single takeaway`,

  executive: `Generate an Executive Summary with these sections:
- OVERVIEW (2-3 sentences)
- KEY FINDINGS (bullet points)
- BUSINESS IMPACT (what it means for the organization)
- RISK ASSESSMENT (severity, likelihood)
- RECOMMENDED ACTIONS (numbered, prioritized)
- DECISION POINTS (what leadership needs to decide)
Use formal, clear language. Executive-level detail.`,

  advisory: `Generate a Security Advisory / Official Advisory with sections:
- Title, ID, Date, Severity, Status
- SITUATION overview
- AFFECTED SYSTEMS
- IMPACT description
- INDICATORS OF COMPROMISE
- RECOMMENDED ACTIONS (prioritized: Priority 1/2/3)
- AFFECTED STAKEHOLDERS
- REFERENCES
Format with clear section headers. Government/enterprise style.`,

  presentation: `Generate a 6-slide presentation. For each slide provide:
- Slide number and title
- 3-5 key bullet points
- Speaker notes (2-3 sentences)

Slides:
1. Situation Overview
2. What Happened?
3. Key Findings
4. Risks
5. Recommended Actions
6. Conclusion & Next Steps`,

  video: `Generate a video package with:
- Video title
- Duration and format specs
- 5 scenes, each with: scene title, visual description, narration text, on-screen text
- Closing CTA
Professional corporate video style, 2-3 minutes total.`,

  infographic: `Generate an infographic specification with:
- Headline and subtitle
- 3-4 sections with key statistics and facts
- Visual hierarchy description
- Design recommendations (colors, layout)
- Key message and call to action`,
};

async function generateOutputsWithAI(
  context: SourceContext,
  config: TransformationConfig,
  outputTypes: string[]
): Promise<GeneratedOutput[]> {
  const results: GeneratedOutput[] = [];

  // Generate each output type
  for (const type of outputTypes) {
    const prompt = outputPrompts[type] || "Generate professional content.";

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a professional communication specialist creating ${type} content. Generate ready-to-use, polished output based on the source context and configuration. Return JSON with "title" and "content" fields.`,
            },
            {
              role: "user",
              content: `Source Context:
Topic: ${context.topic}
Type: ${context.source_type}
Summary: ${context.summary}
Key Facts: ${context.key_facts.join("; ")}
Entities: ${context.entities.join(", ")}
Risks: ${context.risks.join("; ")}
Recommendations: ${context.recommendations.join("; ")}

Configuration:
- Target Audience: ${config.audiences.join(", ")}
- Tone: ${config.tone}
- Language: ${config.language}
- Detail Level: ${config.detail}
- Objective: ${config.objectives.join(", ")}

${prompt}

Return ONLY valid JSON: { "title": "output title", "content": "the full content" }`,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error for ${type}: ${response.status}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    results.push({
      title: parsed.title || type,
      content: parsed.content || "",
      format: type,
      validated: true,
    });
  }

  return results;
}

// ─── Mock Fallback ──────────────────────────────────────────────────────

function getMockContext(content: string): SourceContext {
  // Use the pre-built mock context
  return { ...mockContext };
}

function getMockOutputs(outputTypes: string[]): GeneratedOutput[] {
  return outputTypes
    .filter((type) => mockOutputs[type])
    .map((type) => ({
      title: mockOutputs[type].title,
      content: mockOutputs[type].content,
      format: type,
      validated: true,
    }));
}
