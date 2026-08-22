import { NextResponse } from "next/server";
import { extractContext } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Source content is required" },
        { status: 400 }
      );
    }

    const context = await extractContext(content.trim());
    return NextResponse.json({ context });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze source content" },
      { status: 500 }
    );
  }
}
