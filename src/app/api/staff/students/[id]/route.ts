export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { requireRole, getStaffFromSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireRole("STAFF");
  if (error) return error;
  const staff = await getStaffFromSession();
  if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      school: true,
      progress: { include: { task: { include: { module: true } } }, orderBy: { completedAt: "desc" } },
    },
  });

  if (!student || student.staffId !== staff.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.auditLog.create({
    data: { staffId: staff.id, action: "VIEW_STUDENT", metadata: params.id },
  });

  return NextResponse.json({ student });
}