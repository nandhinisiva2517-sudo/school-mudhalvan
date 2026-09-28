import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getStaffFromSession } from "@/lib/rbac";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Student Detail — SparkLearn" };

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "STAFF") redirect("/login");

  const staff = await getStaffFromSession();
  if (!staff) redirect("/login");

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      school: true,
      progress: { include: { task: { include: { module: true } } }, orderBy: { completedAt: "desc" } },
    },
  });

  if (!student || student.staffId !== staff.id) notFound();

  const completed = student.progress.filter((p) => p.completed).length;
  const pct = student.progress.length ? Math.round((completed / student.progress.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-spark-bg">
      <header className="bg-white border-b border-spark-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <a href="/staff/dashboard" className="text-sm text-spark-ink-muted hover:text-spark-ink">← Back to Dashboard</a>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="spark-card mb-6">
          <h1 className="font-baloo text-2xl font-bold mb-1">{student.user.name}</h1>
          <p className="text-sm text-spark-ink-muted">{student.user.email} · {student.standard.replace("S", "Std ")} · {student.school.name}</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-40 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--spark-success)" }} />
            </div>
            <span className="font-semibold text-sm" style={{ color: "var(--spark-success)" }}>{pct}% complete</span>
          </div>
        </div>

        <div className="spark-card">
          <h2 className="font-baloo text-lg font-bold mb-4">Task History</h2>
          {student.progress.length === 0 ? (
            <p className="text-spark-ink-muted text-sm">No activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {student.progress.map((p) => (
                <li key={p.id} className="flex items-center gap-3 text-sm py-2 border-b border-spark-border last:border-0">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: p.completed ? "var(--spark-success)" : "var(--spark-bg)", color: p.completed ? "#fff" : "var(--spark-ink-muted)", border: "1.5px solid", borderColor: p.completed ? "var(--spark-success)" : "var(--spark-border)" }}>
                    {p.completed ? "✓" : "–"}
                  </span>
                  <span className="flex-1 text-spark-ink">{p.task.title}</span>
                  <span className="text-spark-ink-muted text-xs">{p.task.module.title}</span>
                  {p.score != null && <span className="font-semibold" style={{ color: "var(--spark-primary)" }}>{p.score}pts</span>}
                  <span className="text-spark-ink-muted text-xs">{p.completedAt ? new Date(p.completedAt).toLocaleDateString("en-IN") : ""}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}