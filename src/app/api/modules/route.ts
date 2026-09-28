import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = (session.user as any).studentId as string;
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const modules = await prisma.module.findMany({
    where: { standard: student.standard },
    orderBy: { order: "asc" },
    include: {
      tasks: {
        include: {
          progress: { where: { studentId } },
        },
      },
    },
  });

  return NextResponse.json({ modules });
}