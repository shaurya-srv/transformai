import { NextResponse } from "next/server";
import {
  generateOutputs,
  type SourceContext,
  type TransformationConfig,
} from "@/lib/ai";
import { getAuthenticatedClient } from "@/lib/supabase-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { context, config, outputTypes, projectId, sourceId } = body;

    if (!context || !config || !outputTypes) {
      return NextResponse.json(
        { error: "Context, config, and outputTypes are required" },
        { status: 400 }
      );
    }

    // Generate outputs from context
    const outputs = await generateOutputs(
      context as SourceContext,
      config as TransformationConfig,
      outputTypes as string[]
    );

    // Save to database if project ID provided
    let transformationId: string | null = null;
    const savedOutputs: { id: string; format: string }[] = [];

    if (projectId && sourceId) {
      const supabase = await getAuthenticatedClient();

      // Create transformation record
      const { data: transformation, error: txError } = await supabase
        .from("transformations")
        .insert({
          project_id: projectId,
          source_id: sourceId,
          config: config,
          context: context,
        })
        .select("id")
        .single();

      if (!txError && transformation) {
        transformationId = transformation.id;

        // Save each output
        for (const output of outputs) {
          const { data: outputRecord, error: outError } = await supabase
            .from("outputs")
            .insert({
              transformation_id: transformationId,
              format: output.format,
              title: output.title,
              content: output.content,
              validated: output.validated,
            })
            .select("id, format")
            .single();

          if (!outError && outputRecord) {
            savedOutputs.push(outputRecord);
          }
        }

        // Update project status to completed
        await supabase
          .from("projects")
          .update({ status: "completed", updated_at: new Date().toISOString() })
          .eq("id", projectId);
      }
    }

    return NextResponse.json({
      outputs,
      transformationId,
      savedOutputs,
    });
  } catch (error) {
    console.error("Transform error:", error);
    return NextResponse.json(
      { error: "Failed to generate outputs" },
      { status: 500 }
    );
  }
}
