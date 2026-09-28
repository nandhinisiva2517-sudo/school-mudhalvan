export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { staffRegisterSchema } from "@/lib/validations";
import { generateUniqueAffiliateCode } from "@/lib/affiliate-code";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = staffRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const { name, email, password, institutionName } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: { email: ["Email already in use"] } }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    const affiliateCode = await generateUniqueAffiliateCode();

    const user = await prisma.user.create({
      data: {
        name, email, passwordHash, role: "STAFF",
        staffProfile: { create: { affiliateCode, institutionName } },
      },
      include: { staffProfile: true },
    });

    return NextResponse.json({
      message: "Staff account created",
      affiliateCode: user.staffProfile!.affiliateCode,
    }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/auth/register/staff]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

