"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BackButton } from "@/components/ui/BackButton";

type Student = {
  id: string;
  name: string;
  email: string;
  standard: string;
  completionPct: number;
  lastActive: string | null;
};

type Props = {
  staffName: string;
  affiliateCode: string;
  totalStudents: number;
  classCompletionPct: number;
  students: Student[];
};

const STANDARD_LABELS: Record<string, string> = {
  S1: "Std 1", S2: "Std 2", S3: "Std 3", S4: "Std 4", S5: "Std 5",
  S6: "Std 6", S7: "Std 7", S8: "Std 8", S9: "Std 9", S10: "Std 10",
  S11: "Std 11", S12: "Std 12",
};

export function StaffDashboardClient({ staffName, affiliateCode, totalStudents, classCompletionPct, students }: Props) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [currentCode, setCurrentCode] = useState(affiliateCode);
  const [search, setSearch] = useState("");
  const [filterStd, setFilterStd] = useState("ALL");
  const [sort, setSort] = useState<"name" | "completion" | "standard">("completion");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState<"overview" | "students">("overview");

  const activeToday = students.filter(
    (s) => s.lastActive && new Date(s.lastActive) > new Date(Date.now() - 86400000)
  ).length;

  async function handleRegenerate() {
    if (!confirm("Regenerate your affiliate code? The old code stops working immediately.")) return;
    setRegenerating(true);
    const res = await fetch("/api/staff/affiliate-code", { method: "POST" });
    const json = await res.json();
    if (res.ok) setCurrentCode(json.affiliateCode);
    setRegenerating(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const standards = ["ALL", ...Array.from(new Set(students.map((s) => s.standard))).sort()];

  const filtered = students
    .filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchStd = filterStd === "ALL" || s.standard === filterStd;
      return matchSearch && matchStd;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sort === "name") cmp = a.name.localeCompare(b.name);
      else if (sort === "completion") cmp = a.completionPct - b.completionPct;
      else cmp = a.standard.localeCompare(b.standard);
      return order === "asc" ? cmp : -cmp;
    });

  const chartData = [...students]
    .sort((a, b) => b.completionPct - a.completionPct)
    .slice(0, 15)
    .map((s) => ({ name: s.name.split(" ")[0], pct: s.completionPct }));

  // Group by standard for overview
  const byStandard = students.reduce<Record<string, { count: number; totalPct: number }>>((acc, s) => {
    if (!acc[s.standard]) acc[s.standard] = { count: 0, totalPct: 0 };
    acc[s.standard].count++;
    acc[s.standard].totalPct += s.completionPct;
    return acc;
  }, {});

  const standardSummary = Object.entries(byStandard)
    .map(([std, { count, totalPct }]) => ({
      std,
      count,
      avgPct: Math.round(totalPct / count),
    }))
    .sort((a, b) => a.std.localeCompare(b.std));

  return (
    <div className="min-h-screen bg-spark-bg">
      {/* Header */}
      <div className="bg-white border-b border-spark-border px-4 md:px-10 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl spark-gradient-primary flex items-center justify-center text-white font-bold text-lg">S</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-baloo text-xl font-bold text-spark-ink hidden sm:block">SparkLearn</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "rgba(124,92,252,0.1)", color: "var(--spark-tech)" }}>Teacher</span>
                </div>
                <p className="text-xs text-spark-ink-muted hidden sm:block">Welcome, {staffName}</p>
              </div>
            </div>
          </div>
          <a href="/api/auth/signout" className="text-xs font-medium text-spark-ink-muted hover:text-spark-ink transition-colors px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200">
            Sign out
          </a>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-8">
        <h1 className="font-baloo text-2xl md:text-3xl font-bold text-spark-ink mb-6">Class Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { label: "Total Students", value: totalStudents, emoji: "👩‍🎓", color: "var(--spark-primary)" },
            { label: "Class Average", value: `${classCompletionPct}%`, emoji: "📈", color: "var(--spark-success)" },
            { label: "Active Today", value: activeToday, emoji: "🔥", color: "var(--spark-secondary)" },
            { label: "Standards", value: standardSummary.length, emoji: "📚", color: "var(--spark-tech)" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="spark-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-spark-ink-muted mb-1">{stat.label}</p>
                  <p className="font-baloo text-2xl md:text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
                <span className="text-2xl">{stat.emoji}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Affiliate Code card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="spark-card mb-6 border-l-4"
          style={{ borderLeftColor: "var(--spark-tech)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-spark-ink-muted mb-1">Your Affiliate Code</p>
              <p className="text-sm text-spark-ink-muted mb-2">Share this code with students so they can join your class when registering.</p>
              <div className="flex items-center gap-2">
                <code className="font-mono text-lg md:text-xl font-bold tracking-widest px-3 py-1.5 rounded-lg" style={{ background: "rgba(124,92,252,0.08)", color: "var(--spark-tech)" }}>
                  {showCode ? currentCode : "••••••••••"}
                </code>
                <button onClick={() => setShowCode(!showCode)} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-spark-ink-muted transition-colors">
                  {showCode ? "Hide" : "Show"}
                </button>
                {showCode && (
                  <button onClick={copyCode} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-spark-ink-muted transition-colors">
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
            >
              {regenerating ? "Regenerating…" : "🔄 Regenerate Code"}
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-spark-border w-fit">
          {(["overview", "students"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
              style={activeTab === tab
                ? { background: "var(--spark-primary)", color: "#fff" }
                : { color: "var(--spark-ink-muted)" }
              }
            >
              {tab === "overview" ? "📊 Overview" : "👥 All Students"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Bar chart */}
            <div className="spark-card">
              <h3 className="font-baloo text-lg font-bold mb-4 text-spark-ink">Top 15 Students — Completion</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.pct >= 80 ? "var(--spark-success)" : entry.pct >= 50 ? "var(--spark-primary)" : "var(--spark-secondary)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-spark-ink-muted text-sm">No student data yet</div>
              )}
            </div>

            {/* By Standard breakdown */}
            <div className="spark-card">
              <h3 className="font-baloo text-lg font-bold mb-4 text-spark-ink">Progress by Standard</h3>
              {standardSummary.length > 0 ? (
                <div className="space-y-3">
                  {standardSummary.map((s) => (
                    <div key={s.std} className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-spark-ink w-16 shrink-0">{STANDARD_LABELS[s.std] ?? s.std}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${s.avgPct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ background: s.avgPct >= 80 ? "var(--spark-success)" : s.avgPct >= 50 ? "var(--spark-primary)" : "var(--spark-secondary)" }}
                        />
                      </div>
                      <span className="text-sm font-bold w-12 text-right" style={{ color: "var(--spark-ink-muted)" }}>{s.avgPct}%</span>
                      <span className="text-xs text-spark-ink-muted w-20 text-right">{s.count} student{s.count !== 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-spark-ink-muted text-sm">No students registered yet.</div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "students" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="spark-input flex-1"
              />
              <select
                value={filterStd}
                onChange={(e) => setFilterStd(e.target.value)}
                className="spark-input w-full sm:w-40"
              >
                {standards.map((s) => (
                  <option key={s} value={s}>{s === "ALL" ? "All Standards" : STANDARD_LABELS[s] ?? s}</option>
                ))}
              </select>
            </div>

            {/* Sort buttons */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {(["name", "completion", "standard"] as const).map((col) => (
                <button
                  key={col}
                  onClick={() => { if (sort === col) setOrder((o) => o === "asc" ? "desc" : "asc"); else { setSort(col); setOrder("desc"); } }}
                  className="px-3 py-1 rounded-full text-xs capitalize transition-colors"
                  style={sort === col ? { background: "var(--spark-primary)", color: "#fff" } : { background: "#fff", color: "var(--spark-ink-muted)", border: "1px solid var(--spark-border)" }}
                >
                  {col} {sort === col ? (order === "asc" ? "↑" : "↓") : ""}
                </button>
              ))}
              <span className="text-xs text-spark-ink-muted self-center ml-auto">{filtered.length} student{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table */}
            <div className="spark-card overflow-x-auto">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-spark-ink-muted">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="font-medium">No students found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filter</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-spark-border">
                      <th className="text-left pb-3 text-spark-ink-muted font-semibold">Name</th>
                      <th className="text-left pb-3 text-spark-ink-muted font-semibold">Standard</th>
                      <th className="text-left pb-3 text-spark-ink-muted font-semibold">Completion</th>
                      <th className="text-left pb-3 text-spark-ink-muted font-semibold hidden sm:table-cell">Last Active</th>
                      <th className="pb-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-spark-border last:border-0 hover:bg-spark-bg transition-colors"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                              style={{ background: "var(--spark-primary)" }}>
                              {s.name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-spark-ink leading-tight">{s.name}</p>
                              <p className="text-[10px] text-spark-ink-muted">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-spark-ink-muted">{STANDARD_LABELS[s.standard] ?? s.standard}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${s.completionPct}%`,
                                  background: s.completionPct >= 80 ? "var(--spark-success)" : s.completionPct >= 50 ? "var(--spark-primary)" : "var(--spark-secondary)"
                                }}
                              />
                            </div>
                            <span className="font-semibold text-spark-ink">{s.completionPct}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-spark-ink-muted text-xs hidden sm:table-cell">
                          {s.lastActive ? new Date(s.lastActive).toLocaleDateString("en-IN") : "Never"}
                        </td>
                        <td className="py-3">
                          <a href={`/staff/students/${s.id}`} className="text-xs font-semibold hover:underline" style={{ color: "var(--spark-primary)" }}>
                            View →
                          </a>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
