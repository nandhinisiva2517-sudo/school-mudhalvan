import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StudentDashboardK3 } from "@/components/dashboards/StudentDashboardK3";
import { StudentDashboardStandard } from "@/components/dashboards/StudentDashboardStandard";
import { BackButton } from "@/components/ui/BackButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Dashboard — SparkLearn" };

const ACTIVITY_ICONS: Record<string, string> = {
  "Let's Draw with AI!": 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="80">🎨</text></svg>',
  "AI Sees What You Draw!": 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="80">👁️</text></svg>',
  "Teaching Computers to See": 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="80">🤖</text></svg>',
  "Train Your Own AI Model!": 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="80">🧠</text></svg>',
  "Sound & Pose Recognition AI": 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="80">🕺</text></svg>',
};

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "STUDENT") redirect("/login");

  const studentId = (session.user as any).studentId as string;
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: { select: { name: true } } },
  });

  if (!student) redirect("/login");

  const modules = await prisma.module.findMany({
    where: { standard: student.standard },
    orderBy: { order: "asc" },
    include: {
      tasks: {
        include: { progress: { where: { studentId } } },
      },
    },
  });

  const allProgress = await prisma.progress.findMany({ where: { studentId } });
  const completedCount = allProgress.filter((p) => p.completed).length;
  const completionPct = allProgress.length ? Math.round((completedCount / allProgress.length) * 100) : 0;

  const std = student.standard;
  const isK3 = ["S1", "S2", "S3"].includes(std);
  const isK5 = ["S4", "S5"].includes(std);
  const isAdvanced = ["S11", "S12"].includes(std);
  const isKindergarten = isK3 || isK5;

  return (
    <div className="w-full">
      <StudentDashboardStandard
        modules={modules as any}
        studentName={student.user.name.split(" ")[0]}
        standard={std}
        initialCompletionPct={completionPct}
        isAdvanced={isAdvanced}
      />
    </div>
  );
}