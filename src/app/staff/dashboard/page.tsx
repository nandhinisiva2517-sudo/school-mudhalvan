import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StaffDashboardClient } from "@/components/dashboards/StaffDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Staff Dashboard — SparkLearn" };

export default async function StaffDashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!session?.user || user.role !== "STAFF") redirect("/login");

  const staffId = user.staffId;
  if (!staffId) redirect("/login");

  const staff = await prisma.staff.findUnique({ where: { id: staffId } });
  if (!staff) redirect("/login");

  const students = await prisma.student.findMany({
    where: { staffId },
    include: {
      user: { select: { name: true, email: true } },
      progress: true,
    },
  });

  const studentData = students.map((s) => {
    const completed = s.progress.filter((p) => p.completed).length;
    const total = s.progress.length || 1;
    return {
      id: s.id,
      name: s.user.name ?? "Unknown",
      email: s.user.email ?? "",
      standard: s.standard,
      completionPct: Math.round((completed / total) * 100),
      lastActive: s.progress.reduce<Date | null>((acc, p) => {
        if (p.completedAt && (!acc || p.completedAt > acc)) return p.completedAt;
        return acc;
      }, null)?.toISOString() ?? null,
    };
  });

  const classCompletionPct = studentData.length
    ? Math.round(studentData.reduce((acc, s) => acc + s.completionPct, 0) / studentData.length)
    : 0;

  return (
    <StaffDashboardClient
      staffName={user.name ?? "Teacher"}
      affiliateCode={staff.affiliateCode}
      totalStudents={students.length}
      classCompletionPct={classCompletionPct}
      students={studentData}
    />
  );
}