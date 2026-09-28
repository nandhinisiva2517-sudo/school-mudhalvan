"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

type Student = {
  id: string; name: string; email: string; standard: string; completionPct: number; lastActive: string | null;
};

type Props = {
  affiliateCode: string;
  totalStudents: number;
  classCompletionPct: number;
  students: Student[];
};

export function StaffAggregateTable({ affiliateCode, totalStudents, classCompletionPct, students }: Props) {
  const [sort, setSort] = useState<"name" | "completion" | "standard">("completion");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [showCode, setShowCode] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [currentCode, setCurrentCode] = useState(affiliateCode);

  const sorted = [...students].sort((a, b) => {
    let cmp = 0;
    if (sort === "name") cmp = a.name.localeCompare(b.name);
    else if (sort === "completion") cmp = a.completionPct - b.completionPct;
    else cmp = a.standard.localeCompare(b.standard);
    return order === "asc" ? cmp : -cmp;
  });

  async function handleRegenerate() {
    if (!confirm("Regenerate your affiliate code? The old code stops working immediately.")) return;
    setRegenerating(true);
    const res = await fetch("/api/staff/affiliate-code", { method: "POST" });
    const json = await res.json();
    if (res.ok) setCurrentCode(json.affiliateCode);
    setRegenerating(false);
  }

  const chartData = sorted.slice(0, 20).map((s) => ({ name: s.name.split(" ")[0], pct: s.completionPct }));

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Students", value: totalStudents, color: "var(--spark-primary)" },
          { label: "Class Completion", value: `${classCompletionPct}%`, color: "var(--spark-success)" },
          { label: "Affiliate Code", value: showCode ? currentCode : "••••••••", color: "var(--spark-tech)" },
          { label: "Active Now", value: students.filter(s => s.lastActive && new Date(s.lastActive) > new Date(Date.now() - 86400000)).length, color: "var(--spark-secondary)" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="spark-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-spark-ink-muted mb-1">{stat.label}</p>
            <p className="font-baloo text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
              {stat.label === "Affiliate Code" && (
                <button onClick={() => setShowCode(!showCode)} className="ml-2 text-xs font-normal text-spark-ink-muted">
                  {showCode ? "hide" : "show"}
                </button>
              )}
            </p>
            {stat.label === "Affiliate Code" && showCode && (
              <button onClick={handleRegenerate} disabled={regenerating} className="mt-2 text-xs underline" style={{ color: "var(--spark-secondary)" }}>
                {regenerating ? "Regenerating…" : "Regenerate"}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="spark-card mb-8">
        <h3 className="font-baloo text-lg font-bold mb-4">Completion by Student (Top 20)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.pct >= 80 ? "var(--spark-success)" : entry.pct >= 50 ? "var(--spark-primary)" : "var(--spark-secondary)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="spark-card overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-baloo text-lg font-bold">All Students</h3>
          <div className="flex gap-2 text-sm">
            {(["name", "completion", "standard"] as const).map((col) => (
              <button key={col} onClick={() => { if (sort === col) setOrder(o => o === "asc" ? "desc" : "asc"); else { setSort(col); setOrder("desc"); } }}
                className="px-3 py-1 rounded-full capitalize transition-colors"
                style={sort === col ? { background: "var(--spark-primary)", color: "#fff" } : { background: "var(--spark-bg)", color: "var(--spark-ink-muted)" }}>
                {col} {sort === col ? (order === "asc" ? "↑" : "↓") : ""}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-spark-border">
              <th className="text-left pb-3 text-spark-ink-muted font-semibold">Name</th>
              <th className="text-left pb-3 text-spark-ink-muted font-semibold">Standard</th>
              <th className="text-left pb-3 text-spark-ink-muted font-semibold">Completion</th>
              <th className="text-left pb-3 text-spark-ink-muted font-semibold">Last Active</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className="border-b border-spark-border last:border-0 hover:bg-spark-bg transition-colors">
                <td className="py-3 font-medium text-spark-ink">{s.name}</td>
                <td className="py-3 text-spark-ink-muted">{s.standard.replace("S", "Std ")}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.completionPct}%`, background: s.completionPct >= 80 ? "var(--spark-success)" : s.completionPct >= 50 ? "var(--spark-primary)" : "var(--spark-secondary)" }} />
                    </div>
                    <span className="font-semibold">{s.completionPct}%</span>
                  </div>
                </td>
                <td className="py-3 text-spark-ink-muted text-xs">{s.lastActive ? new Date(s.lastActive).toLocaleDateString("en-IN") : "Never"}</td>
                <td className="py-3">
                  <a href={`/staff/students/${s.id}`} className="text-xs font-semibold" style={{ color: "var(--spark-primary)" }}>View →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}