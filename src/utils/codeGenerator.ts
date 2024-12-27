import { customAlphabet } from "nanoid";
import SubmissionModel from "../models/Submission";

const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

export async function generateShareCode(): Promise<string> {
  let code: string;
  let isUnique = false;

  while (!isUnique) {
    code = nanoid();
    const existing = await SubmissionModel.findOne({ shareCode: code });
    if (!existing) {
      isUnique = true;
      return code;
    }
  }

  throw new Error("Failed to generate unique code");
}
