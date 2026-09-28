import { prisma } from "./prisma";

const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // excludes 0/O, 1/I/L

function generate(): string {
  return Array.from({ length: 8 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}

export async function generateUniqueAffiliateCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = generate();
    const existing = await prisma.staff.findUnique({ where: { affiliateCode: code } });
    if (!existing) return code;
  }
  throw new Error("Failed to generate a unique affiliate code after 5 attempts.");
}
