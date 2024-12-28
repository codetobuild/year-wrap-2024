import SubmissionModel from "../models/Submission";
import { v4 as uuidv4 } from "uuid";

export async function generateShareCode(): Promise<string> {
  let code: string;
  let isUnique = false;
  const maxAttempts = 10; // Prevent infinite loops
  let attempts = 0;

  while (!isUnique && attempts < maxAttempts) {
    // Generate UUID and transform it to match your format
    const uuid = uuidv4();
    code = uuid
      .replace(/-/g, "") // Remove dashes
      .slice(0, 5) // Take first 8 characters
      .toUpperCase() // Convert to uppercase
      .replace(/[0IO]/g, "") // Remove potentially confusing characters
      .replace(/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZ]/g, "9"); // Replace any remaining invalid chars

    // Check if code exists in database
    const existing = await SubmissionModel.findOne({ shareCode: code });
    if (!existing) {
      isUnique = true;
      return code;
    }

    attempts++;
  }

  throw new Error("Failed to generate unique code after maximum attempts");
}
