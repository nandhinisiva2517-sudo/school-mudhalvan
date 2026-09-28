import { NextRequest, NextResponse } from "next/server";
import { requireRole, getStaffFromSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { error } = await requireRole("STAFF");
  if (error) return error;
  const staff = await getStaffFromSession();
  if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });

  const students = await prisma.student.findMany({
    where: { staffId: staff.id },
    include: {
      user: { select: { name: true, email: true } },
      progress: true,
    },
  });

  const totalModuleTasks = await prisma.task.count({
    where: { module: { standard: { in: students.map((s) => s.standard) } } },
  });

  const studentData = students.map((s) => {
    const completed = s.progress.filter((p) => p.completed).length;
    const total = s.progress.length || 1;
    return {
      id: s.id,
      name: s.user.name,
      email: s.user.email,
      standard: s.standard,
      completionPct: Math.round((completed / total) * 100),
      lastActive: s.progress.reduce<Date | null>((acc, p) => {
        if (p.completedAt && (!acc || p.completedAt > acc)) return p.completedAt;
        return acc;
      }, null),
    };
  });

  const classCompletionPct = studentData.length
    ? Math.round(studentData.reduce((acc, s) => acc + s.completionPct, 0) / studentData.length)
    : 0;

  return NextResponse.json({
    affiliateCode: staff.affiliateCode,
    totalStudents: students.length,
    classCompletionPct,
    students: studentData,
  });
}