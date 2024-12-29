import {
  Canvas,
  createCanvas,
  //   loadImage,
  CanvasRenderingContext2D,
} from "canvas";
import path from "path";
import fs from "fs/promises";
import { ISubmission } from "../types";

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

  private setupCanvas(): { canvas: Canvas; ctx: CanvasRenderingContext2D } {
    const canvas = createCanvas(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    const ctx = canvas.getContext("2d");

    // Create main gradient background
    const mainGradient = ctx.createLinearGradient(
      0,
      0,
      this.CANVAS_WIDTH,
      this.CANVAS_HEIGHT
    );
    mainGradient.addColorStop(0, "#2E1D5B"); // Deep purple
    mainGradient.addColorStop(0.5, "#1E4D5C"); // Mid teal
    mainGradient.addColorStop(1, "#135058"); // Deep teal

    ctx.fillStyle = mainGradient;
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    // Lighter overlay gradient for better text readability
    const overlayGradient = ctx.createLinearGradient(
      0,
      0,
      0,
      this.CANVAS_HEIGHT
    );
    overlayGradient.addColorStop(0, "rgba(0,0,0,0.3)");
    overlayGradient.addColorStop(0.5, "rgba(0,0,0,0.1)");
    overlayGradient.addColorStop(1, "rgba(0,0,0,0.4)");

    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    this.drawDecorations(ctx);

    return { canvas, ctx };
  }

  private drawDecorations(ctx: CanvasRenderingContext2D): void {
    // Draw subtle circles with brighter opacity
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * this.CANVAS_WIDTH;
      const y = Math.random() * this.CANVAS_HEIGHT;
      const radius = Math.random() * 100 + 50;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.08)"; // Increased opacity
      ctx.fill();
    }

    // Add diagonal lines with increased visibility
    ctx.strokeStyle = "rgba(255,255,255,0.15)"; // Increased opacity
    ctx.lineWidth = 1;
    for (let i = 0; i < this.CANVAS_WIDTH; i += 80) {
      // Decreased spacing
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 100, this.CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Lighter vignette effect
    const vignetteGradient = ctx.createRadialGradient(
      this.CANVAS_WIDTH / 2,
      this.CANVAS_HEIGHT / 2,
      0,
      this.CANVAS_WIDTH / 2,
      this.CANVAS_HEIGHT / 2,
      this.CANVAS_WIDTH
    );
    vignetteGradient.addColorStop(0, "rgba(0,0,0,0)");
    vignetteGradient.addColorStop(1, "rgba(0,0,0,0.2)"); // Reduced opacity

    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  }

  //   private async drawBackground(ctx: CanvasRenderingContext2D): Promise<void> {
  //     try {
  //       // Load and draw background pattern
  //       const bgPattern = await loadImage(
  //         path.join(__dirname, "../../assets/paw_pattern.png")
  //       );
  //       const pattern = ctx.createPattern(bgPattern, "repeat");

  //       if (pattern) {
  //         ctx.fillStyle = pattern;
  //         ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  //       }

  //       // Add gradient overlay
  //       const gradient = ctx.createLinearGradient(0, 0, 0, this.CANVAS_HEIGHT);
  //       gradient.addColorStop(0, "rgba(0,0,0,0.7)");
  //       gradient.addColorStop(1, "rgba(0,0,0,0.9)");
  //       ctx.fillStyle = gradient;
  //       ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  //     } catch (error) {
  //       console.error("Error drawing background:", error);
  //       throw error;
  //     }
  //   }

  //   private drawText(
  //     ctx: CanvasRenderingContext2D,
  //     submission: ISubmission
  //   ): void {
  //     // Draw title
  //     ctx.font = "bold 60px Arial";
  //     ctx.fillStyle = "black";
  //     ctx.textAlign = "center";
  //     ctx.fillText("2024 Wrap", this.CANVAS_WIDTH / 2, 100);

  //     // Draw username
  //     ctx.font = "40px Arial";
  //     ctx.fillStyle = "black";
  //     ctx.fillText(
  //       "Wrapper by " + submission.temporaryUsername,
  //       this.CANVAS_WIDTH / 2,
  //       160
  //     );

  //     // Prepare events list
  //     const events = [
  //       //   ...submission.selectedEvents.map((e) => e.eventId.title),
  //       ...submission.customEvents.map((e) => e.title),
  //     ];

  //     // Draw events
  //     ctx.font = "40px Arial";
  //     ctx.fillStyle = "black";
  //     ctx.textAlign = "left";
  //     let yPosition = 250;

  //     events.forEach((event, index) => {
  //       // Add event number
  //       const eventText = `${index + 1}. ${event}`;

  //       // Check if text is too long and needs wrapping
  //       if (ctx.measureText(eventText).width > this.CANVAS_WIDTH - 100) {
  //         const words = eventText.split(" ");
  //         let line = "";

  //         words.forEach((word) => {
  //           const testLine = line + word + " ";
  //           if (ctx.measureText(testLine).width > this.CANVAS_WIDTH - 100) {
  //             ctx.fillText(line, this.CANVAS_WIDTH / 2, yPosition);
  //             line = word + " ";
  //             yPosition += 40;
  //           } else {
  //             line = testLine;
  //           }
  //         });

  //         if (line) {
  //           ctx.fillText(line, this.CANVAS_WIDTH / 2, yPosition);
  //         }
  //       } else {
  //         ctx.fillText(eventText, this.CANVAS_WIDTH / 2, yPosition);
  //       }

  //       yPosition += 50;
  //     });
  //   }

  private drawText(
    ctx: CanvasRenderingContext2D,
    submission: ISubmission
  ): void {
    // Draw header section
    const padding = 60;
    let yPos = 120;

    // Year text with special styling
    ctx.font = `bold ${this.STYLES.title.size}px ${this.STYLES.title.font}`;
    ctx.fillStyle = this.COLORS.primary;
    ctx.textAlign = "center";
    ctx.fillText("2024", this.CANVAS_WIDTH / 2, yPos);

    // Wrap text with accent color
    yPos += 80;
    ctx.fillStyle = this.COLORS.accent;
    ctx.font = `bold ${this.STYLES.title.size * 0.8}px ${
      this.STYLES.title.font
    }`;
    ctx.fillText("WRAP", this.CANVAS_WIDTH / 2, yPos);

    // Username with subtle styling
    yPos += 80;
    ctx.font = `${this.STYLES.username.size}px ${this.STYLES.username.font}`;
    ctx.fillStyle = this.COLORS.secondary;
    ctx.fillText(
      `Created by ${submission.temporaryUsername}`,
      this.CANVAS_WIDTH / 2,
      yPos
    );

    // Draw events with enhanced styling
    const events = [...submission.customEvents.map((e) => e.title)];
    yPos += 100;

    // Add "Your Top Moments" header
    ctx.font = `bold ${this.STYLES.eventTitle.size}px ${this.STYLES.eventTitle.font}`;
    ctx.fillStyle = this.COLORS.primary;
    ctx.fillText("Your Top Moments", this.CANVAS_WIDTH / 2, yPos);
    yPos += 80;

    // Draw events with numbering and proper spacing
    events.forEach((event, index) => {
      const eventNumber = (index + 1).toString().padStart(2, "0");

      // Draw number with accent color
      ctx.font = `bold ${this.STYLES.eventTitle.size * 0.8}px ${
        this.STYLES.eventTitle.font
      }`;
      ctx.fillStyle = this.COLORS.accent;
      ctx.textAlign = "left";
      ctx.fillText(eventNumber, padding, yPos);

      // Draw event text
      ctx.fillStyle = this.COLORS.primary;
      const maxWidth = this.CANVAS_WIDTH - padding * 3;
      const text = this.wrapText(
        ctx,
        event,
        padding + 60,
        yPos,
        maxWidth,
        this.STYLES.eventTitle.lineHeight
      );

      // Update yPos based on wrapped text
      yPos +=
        text.lines.length *
          this.STYLES.eventTitle.size *
          this.STYLES.eventTitle.lineHeight +
        40;
    });

    // Add bottom decorative elements
    this.drawBottomBranding(ctx);
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


  private drawBottomBranding(ctx: CanvasRenderingContext2D) {
    const bottomY = this.CANVAS_HEIGHT - 80;
    ctx.font = `${this.STYLES.username.size * 0.8}px ${
      this.STYLES.username.font
    }`;
    ctx.fillStyle = this.COLORS.secondary;
    ctx.textAlign = "center";
    ctx.fillText("yearwrap.io", this.CANVAS_WIDTH / 2, bottomY);
  }

  public async generateImage(submission: ISubmission): Promise<string> {
    try {
      const { canvas, ctx } = this.setupCanvas();

      // Draw background and content
      //   await this.drawBackground(ctx);
      this.drawText(ctx, submission);

      // Save image
      const fileName = `wrap-${submission.shareCode}.jpg`;
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
