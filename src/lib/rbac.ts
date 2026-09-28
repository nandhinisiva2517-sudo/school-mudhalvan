import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { NextResponse } from "next/server";

export async function requireRole(role: "STAFF" | "STUDENT") {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }
  if (session.user.role !== role) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

export async function getStudentFromSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.studentId) return null;
  return prisma.student.findUnique({
    where: { id: session.user.studentId },
    include: { school: true, user: { select: { name: true, email: true } } },
  });
}

export async function getStaffFromSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.staffId) return null;
  return prisma.staff.findUnique({
    where: { id: session.user.staffId },
    include: { user: { select: { name: true, email: true } } },
  });
}
