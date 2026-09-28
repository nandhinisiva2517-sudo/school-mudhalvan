import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { progressUpdateSchema } from "@/lib/validations";

export async function POST(req: NextRequest, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = (session.user as any).studentId as string;
  const { taskId } = params;

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const body = await req.json();
  const parsed = progressUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { completed, score } = parsed.data;

  const progress = await prisma.progress.upsert({
    where: { studentId_taskId: { studentId, taskId } },
    update: { completed, score, completedAt: completed ? new Date() : null },
    create: { studentId, taskId, completed, score, completedAt: completed ? new Date() : null },
  });

  const allProgress = await prisma.progress.findMany({ where: { studentId } });
  const completedCount = allProgress.filter((p) => p.completed).length;
  const completionPct = allProgress.length ? Math.round((completedCount / allProgress.length) * 100) : 0;

  return NextResponse.json({ progress, completionPct });
}