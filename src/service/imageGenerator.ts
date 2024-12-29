import {
  Canvas,
  createCanvas,
  //   loadImage,
  CanvasRenderingContext2D,
} from "canvas";
import path from "path";
import fs from "fs/promises";

export default class ImageGeneratorService {
  private readonly CANVAS_WIDTH = 1200;
  private readonly CANVAS_HEIGHT = 1600;
  private readonly IMAGE_QUALITY = 0.9;
  private readonly UPLOADS_DIR = "public/images/wraps";

  private readonly COLORS = {
    background: "#1DB954",
    gradientTop: "#2E1D5B", // Deep purple
    gradientBottom: "#135058", // Deep teal
    primary: "#FFFFFF",
    secondary: "rgba(255,255,255,0.85)",
    accent: "#22D899", // Bright mint green
  };

  private readonly STYLES = {
    title: {
      font: "Circular", // Use a Spotify-like font
      color: "#FFFFFF",
      size: 72,
      lineHeight: 1.2,
    },
    username: {
      font: "Circular",
      color: "#B3B3B3",
      size: 32,
      lineHeight: 1.5,
    },
    eventTitle: {
      font: "Circular",
      color: "#FFFFFF",
      size: 36,
      lineHeight: 1.4,
    },
  };

  constructor() {
    this.ensureUploadsDirectory();
  }

  private async ensureUploadsDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.UPLOADS_DIR, { recursive: true });
    } catch (error) {
      console.error("Failed to create uploads directory:", error);
      throw error;
    }
  }

  private setupCanvas(eventList: string[]): {
    canvas: Canvas;
    ctx: CanvasRenderingContext2D;
  } {
    const eventsPerColumn = Math.ceil(Math.min(eventList.length, 30) / 2);
    const estimatedLinesPerEvent = 2;
    const lineHeight = this.STYLES.eventTitle.size * 1.2;
    const headerHeight = 300;
    // const footerHeight = 100;

    const canvasHeight = Math.max(
      this.CANVAS_HEIGHT,
      headerHeight +
        eventsPerColumn * estimatedLinesPerEvent * lineHeight +
        eventsPerColumn * 25
    );

    const canvas = createCanvas(this.CANVAS_WIDTH, canvasHeight);
    const ctx = canvas.getContext("2d");

    // Create main gradient background with dynamic height
    const mainGradient = ctx.createLinearGradient(
      0,
      0,
      this.CANVAS_WIDTH,
      canvasHeight
    );
    mainGradient.addColorStop(0, "#2E1D5B");
    mainGradient.addColorStop(0.5, "#1E4D5C");
    mainGradient.addColorStop(1, "#135058");

    ctx.fillStyle = mainGradient;
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, canvasHeight);

    // Lighter overlay gradient adjusted for dynamic height
    const overlayGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    overlayGradient.addColorStop(0, "rgba(0,0,0,0.3)");
    overlayGradient.addColorStop(0.5, "rgba(0,0,0,0.1)");
    overlayGradient.addColorStop(1, "rgba(0,0,0,0.4)");

    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, canvasHeight);

    // Pass canvasHeight to drawDecorations
    this.drawDecorations(ctx, canvasHeight);

    return { canvas, ctx };
  }

  private drawDecorations(
    ctx: CanvasRenderingContext2D,
    canvasHeight: number
  ): void {
    // Calculate number of circles based on canvas height
    const numberOfCircles = Math.floor(canvasHeight / 160); // Adjust circle density

    // Draw circles
    for (let i = 0; i < numberOfCircles; i++) {
      const x = Math.random() * this.CANVAS_WIDTH;
      const y = Math.random() * canvasHeight;
      const radius = Math.random() * 100 + 50;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fill();
    }

    // Adjust diagonal lines for dynamic height
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    const lineSpacing = 80;
    const numberOfLines = Math.ceil(this.CANVAS_WIDTH / lineSpacing);

    for (let i = 0; i < numberOfLines; i++) {
      const x = i * lineSpacing;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 100, canvasHeight);
      ctx.stroke();
    }

    // Adjust vignette effect for dynamic height
    const maxDimension = Math.max(this.CANVAS_WIDTH, canvasHeight);
    const vignetteGradient = ctx.createRadialGradient(
      this.CANVAS_WIDTH / 2,
      canvasHeight / 2,
      0,
      this.CANVAS_WIDTH / 2,
      canvasHeight / 2,
      maxDimension
    );
    vignetteGradient.addColorStop(0, "rgba(0,0,0,0)");
    vignetteGradient.addColorStop(1, "rgba(0,0,0,0.2)");

    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, canvasHeight);
  }
  private drawText(
    ctx: CanvasRenderingContext2D,
    eventList: string[],
    temporaryUsername: string
  ) {
    // Limit to top 30 events if more
    const limitedEvents = eventList.slice(0, 30);

    // Calculate columns
    const midPoint = Math.ceil(limitedEvents.length / 2);
    const leftColumnEvents = limitedEvents.slice(0, midPoint);
    const rightColumnEvents = limitedEvents.slice(midPoint);

    // Header section - moved up
    let yPos = 120;

    // Year text
    ctx.font = `bold ${this.STYLES.title.size}px ${this.STYLES.title.font}`;
    ctx.fillStyle = this.COLORS.primary;
    ctx.textAlign = "center";
    ctx.fillText("2024", this.CANVAS_WIDTH / 2, yPos);

    // Wrap text
    yPos += 60; // Reduced spacing
    ctx.fillStyle = this.COLORS.accent;
    ctx.font = `bold ${this.STYLES.title.size * 0.8}px ${
      this.STYLES.title.font
    }`;
    ctx.fillText("WRAP", this.CANVAS_WIDTH / 2, yPos);

    // Username
    yPos += 60; // Reduced spacing
    ctx.font = `${this.STYLES.username.size}px ${this.STYLES.username.font}`;
    ctx.fillStyle = this.COLORS.secondary;
    ctx.fillText(
      `Created by ${temporaryUsername}`,
      this.CANVAS_WIDTH / 2,
      yPos
    );

    // Top Moments header
    yPos += 80;
    ctx.font = `bold ${this.STYLES.eventTitle.size}px ${this.STYLES.eventTitle.font}`;
    ctx.fillStyle = this.COLORS.primary;
    ctx.fillText("Your Top 2024 Moments", this.CANVAS_WIDTH / 2, yPos);

    // Start events list
    yPos += 60;
    const padding = 40; // Reduced padding
    const columnWidth = (this.CANVAS_WIDTH - padding * 3) / 2;

    // Draw left column
    let leftYPos = yPos;
    ctx.textAlign = "left";
    leftColumnEvents.forEach((event, index) => {
      // Event number
      ctx.font = `bold ${this.STYLES.eventTitle.size * 0.7}px ${
        this.STYLES.eventTitle.font
      }`;
      ctx.fillStyle = this.COLORS.accent;
      ctx.fillText((index + 1).toString().padStart(2, "0"), padding, leftYPos);

      // Event text
      ctx.fillStyle = this.COLORS.primary;
      ctx.font = `regular ${this.STYLES.eventTitle.size * 0.8}px ${
        this.STYLES.eventTitle.font
      }`;
      const text = this.wrapText(
        ctx,
        event,
        padding + 50,
        leftYPos,
        columnWidth - 60,
        1.2
      );
      leftYPos += text.lines.length * (this.STYLES.eventTitle.size * 1.2) + 25; // Reduced spacing
    });

    // Draw right column
    let rightYPos = yPos;
    rightColumnEvents.forEach((event, index) => {
      // Event number
      ctx.font = `bold ${this.STYLES.eventTitle.size * 0.7}px ${
        this.STYLES.eventTitle.font
      }`;
      ctx.fillStyle = this.COLORS.accent;
      ctx.fillText(
        (index + midPoint + 1).toString().padStart(2, "0"),
        padding + columnWidth + padding,
        rightYPos
      );

      // Event text
      ctx.fillStyle = this.COLORS.primary;
      ctx.font = `regular ${this.STYLES.eventTitle.size * 0.8}px ${
        this.STYLES.eventTitle.font
      }`;
      const text = this.wrapText(
        ctx,
        event,
        padding + columnWidth + padding + 50,
        rightYPos,
        columnWidth - 60,
        1.2
      );
      rightYPos += text.lines.length * (this.STYLES.eventTitle.size * 1.2) + 25; // Reduced spacing
    });

    // Bottom branding - use the maximum Y position from either column
    const finalYPos = Math.max(leftYPos, rightYPos);
    this.drawBottomBranding(ctx, finalYPos + 40);
  }

  // Updated bottom branding method
  private drawBottomBranding(ctx: CanvasRenderingContext2D, yPos: number) {
    ctx.font = `${this.STYLES.username.size * 0.8}px ${
      this.STYLES.username.font
    }`;
    ctx.fillStyle = this.COLORS.secondary;
    ctx.textAlign = "center";
    ctx.fillText(process.env.FRONTEND_URL!, this.CANVAS_WIDTH / 2, yPos);
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;

      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    // Draw the wrapped text
    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        x,
        y + index * this.STYLES.eventTitle.size * lineHeight
      );
    });

    return { lines };
  }

  public async generateImage(
    eventList: string[],
    shareCode: string,
    temporaryUsername: string
  ): Promise<string> {
    try {
      const { canvas, ctx } = this.setupCanvas(eventList);

      // Draw background and content
      //   await this.drawBackground(ctx);
      this.drawText(ctx, eventList, temporaryUsername);

      // Save image
      const fileName = `wrap-${shareCode}.jpg`;
      const filePath = path.join(this.UPLOADS_DIR, fileName);

      const buffer = canvas.toBuffer("image/jpeg", {
        quality: this.IMAGE_QUALITY,
      });

      await fs.writeFile(filePath, buffer);

      return `images/wraps/${fileName}`;
    } catch (error) {
      console.error("Failed to generate image:", error);
      throw error;
    }
  }
}
