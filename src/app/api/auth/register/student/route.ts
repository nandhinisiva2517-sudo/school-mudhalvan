import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { studentRegisterSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = studentRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const { name, email, password, standard, schoolId, affiliateCode, guardianEmail } = parsed.data;

    const staff = await prisma.staff.findUnique({ where: { affiliateCode } });
    if (!staff) {
      return NextResponse.json({ error: { affiliateCode: ["Invalid code"] } }, { status: 400 });
    }

    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      return NextResponse.json({ error: { schoolId: ["School not found"] } }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: { email: ["Email already in use"] } }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    await prisma.user.create({
      data: {
        name, email, passwordHash, role: "STUDENT",
        studentProfile: {
          create: { standard, schoolId, staffId: staff.id, guardianEmail: guardianEmail || null },
        },
      },
    });

    return NextResponse.json({ message: "Student account created. Please log in." }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/auth/register/student]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
