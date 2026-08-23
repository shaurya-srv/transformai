import { NextResponse } from "next/server";
import { extractContext } from "@/lib/ai";
import { getAuthenticatedClient } from "@/lib/supabase-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, projectId } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Source content is required" },
        { status: 400 }
      );
    }

    // Extract context from source content
    const context = await extractContext(content.trim());

    // Save source to database if project ID provided
    let sourceId: string | null = null;
    if (projectId) {
      const supabase = await getAuthenticatedClient();
      const { data: source, error: sourceError } = await supabase
        .from("sources")
        .insert({
          project_id: projectId,
          content: content.trim(),
          content_type: "text",
          topic: context.topic,
          source_type: context.source_type,
        })
        .select("id")
        .single();

      if (!sourceError && source) {
        sourceId = source.id;
      }
    }

    return NextResponse.json({ context, sourceId });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze source content" },
      { status: 500 }
    );
  }
}
