/**
 * Renders an infographic specification into a Canvas and exports as PNG.
 * Creates a professional, enterprise-style infographic image.
 */

interface InfographicSection {
  title: string;
  items: string[];
  color: string;
}

/**
 * Parse infographic spec text into structured sections
 */
function parseInfographicText(text: string): {
  headline: string;
  subtitle: string;
  sections: InfographicSection[];
  footer: string;
} {
  const lines = text.split("\n").filter((l) => l.trim());

  let headline = "";
  let subtitle = "";
  const sections: InfographicSection[] = [];
  let footer = "";

  let currentSection: InfographicSection | null = null;

  const sectionColors = ["#DC2626", "#EA580C", "#16A34A", "#2563EB", "#7C3AED"];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("HEADLINE")) continue;
    if (trimmed.startsWith("SUBTITLE")) continue;
    if (trimmed.startsWith("SECTION")) {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: "", items: [], color: "" };
      continue;
    }
    if (trimmed.startsWith("FOOTER")) {
      if (currentSection) sections.push(currentSection);
      currentSection = null;
      continue;
    }
    if (trimmed.startsWith("DESIGN NOTES:")) continue;

    if (!headline && !trimmed.startsWith("━") && trimmed && !trimmed.startsWith("Key")) {
      headline = trimmed.replace(/[""]/g, "");
    } else if (headline && !subtitle && !trimmed.startsWith("━") && trimmed) {
      subtitle = trimmed;
    } else if (currentSection) {
      if (!currentSection.title && trimmed && !trimmed.startsWith("━") && !trimmed.startsWith("Key") && !trimmed.startsWith("•")) {
        currentSection.title = trimmed.replace(/[""]/g, "");
        currentSection.color = sectionColors[sections.length % sectionColors.length];
      } else if (trimmed.startsWith("•") || trimmed.startsWith("-") || (trimmed.includes(":") && !trimmed.startsWith("━"))) {
        const item = trimmed.replace(/^[•\-]\s*/, "").replace(/^[📌🔒🌐↔️📤🖥️Steps□:]+\s*/, "").trim();
        if (item) currentSection.items.push(item);
      }
    }
  }

  if (currentSection) sections.push(currentSection);

  return { headline: headline || "Security Advisory", subtitle: subtitle || "", sections, footer: footer || "TransformAI" };
}

/**
 * Render the infographic to a Canvas element
 */
function renderToCanvas(
  data: ReturnType<typeof parseInfographicText>,
  width: number = 1080,
  height: number = 1920
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(0, 0, width, height);

  // Top accent bar
  ctx.fillStyle = "#4F46E5";
  ctx.fillRect(0, 0, width, 6);

  // Headline
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 52px Arial, sans-serif";
  ctx.textAlign = "center";
  wrapText(ctx, data.headline.toUpperCase(), width / 2, 80, width - 120, 60);

  // Subtitle
  ctx.fillStyle = "#94A3B8";
  ctx.font = "22px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(data.subtitle, width / 2, 180);

  // Divider
  ctx.fillStyle = "#4F46E5";
  ctx.fillRect(width / 2 - 60, 210, 120, 3);

  // Sections
  let yPos = 260;
  const sectionPadding = 40;

  for (const section of data.sections) {
    if (yPos > height - 200) break;

    // Section background
    const sectionHeight = 60 + section.items.length * 52;
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    roundRect(ctx, 40, yPos, width - 80, sectionHeight, 12);
    ctx.fill();

    // Section accent bar
    ctx.fillStyle = section.color;
    ctx.fillRect(40, yPos, 6, sectionHeight);

    // Section title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(section.title, 70, yPos + 42);

    // Section items
    ctx.font = "20px Arial, sans-serif";
    ctx.fillStyle = "#CBD5E1";
    let itemY = yPos + 80;

    for (const item of section.items) {
      if (itemY > yPos + sectionHeight - 20) break;

      // Bullet dot
      ctx.fillStyle = section.color;
      ctx.beginPath();
      ctx.arc(85, itemY - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Item text
      ctx.fillStyle = "#CBD5E1";
      ctx.textAlign = "left";
      wrapText(ctx, item, 100, itemY, width - 160, 26);

      itemY += 52;
    }

    yPos += sectionHeight + sectionPadding;
  }

  // Footer
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = "16px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${data.footer}  •  ${new Date().toLocaleDateString()}`, width / 2, height - 40);

  // Bottom accent bar
  ctx.fillStyle = "#4F46E5";
  ctx.fillRect(0, height - 6, width, 6);

  return canvas;
}

/**
 * Wrap text on canvas
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
 * Draw a rounded rectangle
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Generate infographic and trigger PNG download
 */
export function generateInfographic(title: string, content: string): void {
  const data = parseInfographicText(content);
  const canvas = renderToCanvas(data);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

/**
 * Generate infographic and return a data URL (for preview)
 */
export function generateInfographicDataUrl(content: string): string {
  const data = parseInfographicText(content);
  const canvas = renderToCanvas(data);
  return canvas.toDataURL("image/png");
}
