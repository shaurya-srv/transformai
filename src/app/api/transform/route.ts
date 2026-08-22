import { NextResponse } from "next/server";
import { generateOutputs, type SourceContext, type TransformationConfig } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { context, config, outputTypes } = body;

    if (!context || !config || !outputTypes) {
      return NextResponse.json(
        { error: "Context, config, and outputTypes are required" },
        { status: 400 }
      );
    }

    const outputs = await generateOutputs(
      context as SourceContext,
      config as TransformationConfig,
      outputTypes as string[]
    );

    return NextResponse.json({ outputs });
  } catch (error) {
    console.error("Transform error:", error);
    return NextResponse.json(
      { error: "Failed to generate outputs" },
      { status: 500 }
    );
  }
}
