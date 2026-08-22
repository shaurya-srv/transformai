/**
 * Generates a real video by rendering scenes on a Canvas and recording via MediaRecorder.
 * Outputs a downloadable .webm video file.
 */

interface VideoScene {
  title: string;
  visual: string;
  narration: string;
  onScreenText: string;
  duration: number; // ms
}

/**
 * Parse video package text into structured scenes
 */
function parseVideoText(text: string): {
  title: string;
  scenes: VideoScene[];
} {
  const lines = text.split("\n").filter((l) => l.trim());
  let title = "Security Alert";
  const scenes: VideoScene[] = [];

  let currentScene: Partial<VideoScene> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("VIDEO TITLE")) continue;
    if (trimmed.startsWith("DURATION:")) continue;
    if (trimmed.startsWith("FORMAT:")) continue;
    if (trimmed.startsWith("STYLE:")) continue;

    if (trimmed.startsWith("SCENE")) {
      if (currentScene?.title) {
        scenes.push({
          title: currentScene.title || "",
          visual: currentScene.visual || "",
          narration: currentScene.narration || "",
          onScreenText: currentScene.onScreenText || "",
          duration: 3000,
        });
      }
      currentScene = { title: trimmed.replace(/^SCENE \d+ —\s*/, "").replace(/\(.*\)/, "").trim() };
      continue;
    }

    if (!currentScene) {
      if (trimmed && !trimmed.startsWith("━") && !title.includes(trimmed)) {
        title = trimmed;
      }
      continue;
    }

    if (trimmed.startsWith("Visual:")) {
      currentScene.visual = trimmed.replace("Visual:", "").trim();
    } else if (trimmed.startsWith("Narration:")) {
      currentScene.narration = trimmed.replace("Narration:", "").replace(/[""]/g, "").trim();
    } else if (trimmed.startsWith("On-screen text:")) {
      currentScene.onScreenText = trimmed.replace("On-screen text:", "").trim();
    } else if (trimmed.startsWith("On-screen:")) {
      currentScene.onScreenText = trimmed.replace("On-screen:", "").trim();
    } else if (trimmed.startsWith("BACKGROUND:")) {
      // skip
    }
  }

  if (currentScene?.title) {
    scenes.push({
      title: currentScene.title || "",
      visual: currentScene.visual || "",
      narration: currentScene.narration || "",
      onScreenText: currentScene.onScreenText || "",
      duration: 3000,
    });
  }

  return { title, scenes };
}

/**
 * Render a single scene frame to canvas
 */
function renderScene(
  ctx: CanvasRenderingContext2D,
  scene: VideoScene,
  sceneIndex: number,
  totalScenes: number,
  width: number,
  height: number,
  progress: number // 0-1 within this scene
): void {
  // Background
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(0, 0, width, height);

  // Top accent
  ctx.fillStyle = "#4F46E5";
  ctx.fillRect(0, 0, width, 4);

  // Scene indicator
  ctx.fillStyle = "rgba(79, 70, 229, 0.2)";
  ctx.fillRect(40, height - 80, width - 80, 3);
  ctx.fillStyle = "#4F46E5";
  ctx.fillRect(40, height - 80, ((width - 80) / totalScenes) * (sceneIndex + progress), 3);

  // Scene counter
  ctx.fillStyle = "#64748B";
  ctx.font = "16px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`SCENE ${sceneIndex + 1} / ${totalScenes}`, 50, height - 50);

  // Title - animated entrance
  const titleAlpha = Math.min(1, progress * 3);
  ctx.globalAlpha = titleAlpha;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 44px Arial, sans-serif";
  ctx.textAlign = "center";
  wrapText(ctx, scene.title.toUpperCase(), width / 2, 140, width - 160, 56);
  ctx.globalAlpha = 1;

  // Divider
  ctx.fillStyle = "#4F46E5";
  const dividerWidth = 100 * Math.min(1, progress * 2);
  ctx.fillRect(width / 2 - dividerWidth / 2, 180, dividerWidth, 3);

  // On-screen text / key points
  if (scene.onScreenText) {
    const textAlpha = Math.min(1, Math.max(0, (progress - 0.2) * 3));
    ctx.globalAlpha = textAlpha;
    ctx.fillStyle = "#CBD5E1";
    ctx.font = "22px Arial, sans-serif";
    ctx.textAlign = "center";

    const textLines = scene.onScreenText.split(/[.,]/).filter((l) => l.trim());
    let textY = 260;
    for (const line of textLines.slice(0, 5)) {
      wrapText(ctx, line.trim(), width / 2, textY, width - 200, 32);
      textY += 45;
    }
    ctx.globalAlpha = 1;
  }

  // Visual description (subtle)
  if (scene.visual) {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#475569";
    ctx.font = "14px Arial, sans-serif";
    ctx.textAlign = "center";
    wrapText(ctx, `Visual: ${scene.visual}`, width / 2, height - 120, width - 200, 20);
    ctx.globalAlpha = 1;
  }
}

/**
 * Wrap text helper
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

/**
 * Generate video and trigger download
 * Uses MediaRecorder to capture canvas animation as WebM
 */
export async function generateVideo(
  title: string,
  content: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const { title: videoTitle, scenes } = parseVideoText(content);

  if (scenes.length === 0) {
    throw new Error("No scenes found in video content");
  }

  const width = 1280;
  const height = 720;
  const fps = 30;
  const sceneDurationMs = 3000; // 3 seconds per scene
  const totalDurationMs = scenes.length * sceneDurationMs;

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Set up MediaRecorder
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp9",
    videoBitsPerSecond: 5000000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(videoTitle || title).replace(/[^a-zA-Z0-9]/g, "_")}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    };

    mediaRecorder.onerror = reject;
    mediaRecorder.start();

    // Animation loop
    const startTime = performance.now();
    let currentSceneIndex = 0;

    function animate(now: number) {
      const elapsed = now - startTime;
      const overallProgress = Math.min(1, elapsed / totalDurationMs);

      currentSceneIndex = Math.min(
        scenes.length - 1,
        Math.floor(elapsed / sceneDurationMs)
      );
      const sceneProgress = (elapsed % sceneDurationMs) / sceneDurationMs;

      renderScene(
        ctx,
        scenes[currentSceneIndex],
        currentSceneIndex,
        scenes.length,
        width,
        height,
        sceneProgress
      );

      onProgress?.(overallProgress);

      if (elapsed < totalDurationMs) {
        requestAnimationFrame(animate);
      } else {
        // Final frame
        renderScene(
          ctx,
          scenes[scenes.length - 1],
          scenes.length - 1,
          scenes.length,
          width,
          height,
          1
        );

        // End card
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#4F46E5";
        ctx.fillRect(0, 0, width, 4);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 40px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(videoTitle || title, width / 2, height / 2 - 20);
        ctx.fillStyle = "#94A3B8";
        ctx.font = "20px Arial, sans-serif";
        ctx.fillText("Generated by TransformAI", width / 2, height / 2 + 30);

        setTimeout(() => mediaRecorder.stop(), 200);
      }
    }

    requestAnimationFrame(animate);
  });
}
