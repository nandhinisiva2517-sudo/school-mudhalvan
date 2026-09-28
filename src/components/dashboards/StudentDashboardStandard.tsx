"use client";
import { motion } from "framer-motion";
import { useState } from "react";

import { BackButton } from "@/components/ui/BackButton";

type Task = {
  id: string;
  title: string;
  points: number;
  progress: { completed: boolean; score?: number | null }[];
};

type Module = {
  id: string;
  title: string;
  description: string;
  summary?: string | null;
  youtubeUrl?: string | null;
  quizJson?: string | null;
  contentType: string;
  externalUrl?: string | null;
  tasks: Task[];
};

type Props = {
  modules: Module[];
  studentName: string;
  standard: string;
  initialCompletionPct: number;
  isAdvanced?: boolean;
};

// Inline Quiz Component
function InteractiveQuiz({ quizJson, isAdvanced, accentColor, onQuizComplete }: { quizJson: string, isAdvanced?: boolean, accentColor: string, onQuizComplete?: (score: number) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  let questions = [];
  try {
    questions = JSON.parse(quizJson);
  } catch (e) {
    return null;
  }

  if (!questions || questions.length === 0) return null;

  const q = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setCurrentQ(c => c + 1);
  };

  if (currentQ >= questions.length) {
    return (
      <div className="p-6 rounded-2xl border text-center" style={{ background: isAdvanced ? "#14112B" : "#fff", borderColor: isAdvanced ? "rgba(124,92,252,0.2)" : "var(--spark-border)" }}>
        <h3 className="font-baloo text-xl font-bold mb-2" style={{ color: isAdvanced ? "#FFF9F0" : "var(--spark-ink)" }}>Quiz Completed! 🎉</h3>
        <p className="text-lg font-semibold" style={{ color: accentColor }}>You scored {score} out of {questions.length}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { setCurrentQ(0); setScore(0); setShowResult(false); setSelected(null); }} className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border" style={{ borderColor: isAdvanced ? "rgba(255,255,255,0.1)" : "var(--spark-border)", color: isAdvanced ? "#FFF9F0" : "var(--spark-ink)" }}>
            Retake Quiz
          </button>
          <button onClick={() => onQuizComplete?.(score)} className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md" style={{ background: accentColor, color: "#fff" }}>
            Mark as Done & Claim XP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border" style={{ background: isAdvanced ? "#14112B" : "#fff", borderColor: isAdvanced ? "rgba(124,92,252,0.2)" : "var(--spark-border)" }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-baloo text-lg font-bold" style={{ color: isAdvanced ? "#FFF9F0" : "var(--spark-ink)" }}>Knowledge Check</h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: isAdvanced ? "rgba(255,255,255,0.1)" : "var(--spark-bg)", color: isAdvanced ? "rgba(255,249,240,0.6)" : "var(--spark-ink-muted)" }}>
          Question {currentQ + 1} of {questions.length}
        </span>
      </div>
      <p className="font-medium mb-4" style={{ color: isAdvanced ? "#FFF9F0" : "var(--spark-ink)" }}>{q.q}</p>
      <div className="space-y-2">
        {q.options.map((opt: string, idx: number) => {
          let bg = isAdvanced ? "rgba(255,255,255,0.05)" : "var(--spark-bg)";
          let border = "transparent";
          if (showResult) {
            if (idx === q.answer) {
              bg = isAdvanced ? "rgba(47,184,139,0.15)" : "rgba(47,184,139,0.1)";
              border = "var(--spark-success)";
            } else if (idx === selected) {
              bg = isAdvanced ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)";
              border = "#ef4444";
            }
          } else if (selected === idx) {
            border = accentColor;
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all border"
              style={{ background: bg, borderColor: border, color: isAdvanced ? "rgba(255,249,240,0.8)" : "var(--spark-ink)" }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="mt-4 flex justify-end">
          <button onClick={handleNext} className="px-5 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: accentColor, color: "#fff" }}>
            {currentQ < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}

export function StudentDashboardStandard({ modules: initialModules, studentName, standard, initialCompletionPct, isAdvanced }: Props) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [completionPct, setCompletionPct] = useState(initialCompletionPct);
  const [activeModuleId, setActiveModuleId] = useState(modules[0]?.id ?? "");
  const [loadingTask, setLoadingTask] = useState<string | null>(null);

  const active = modules.find((m) => m.id === activeModuleId);
  const accentColor = isAdvanced ? "var(--spark-tech)" : "var(--spark-success)";

  const handleToggleTask = async (taskId: string, currentStatus: boolean, score?: number) => {
    if (loadingTask === taskId) return;
    setLoadingTask(taskId);
    try {
      const res = await fetch(`/api/progress/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus, score: score ?? null }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update local state
        setModules(prev => prev.map(m => ({
          ...m,
          tasks: m.tasks.map(t => t.id === taskId ? { ...t, progress: [{ completed: !currentStatus, score: score ?? null }] } : t)
        })));
        if (data.completionPct !== undefined) {
          setCompletionPct(data.completionPct);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTask(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: isAdvanced ? "#0F0D1A" : "var(--spark-bg)" }}>
      {/* Header */}
      <div className="px-4 md:px-10 py-4 md:py-6 border-b sticky top-0 z-10" style={{ borderColor: isAdvanced ? "rgba(124,92,252,0.2)" : "var(--spark-border)", background: isAdvanced ? "#14112B" : "#fff" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <BackButton />
            <div>
              <p className="text-xs md:text-sm font-medium mb-0.5 md:mb-1" style={{ color: isAdvanced ? "rgba(255,249,240,0.5)" : "var(--spark-ink-muted)" }}>
                {standard.replace("S", "Standard ")}
              </p>
              <h1 className="font-baloo text-lg md:text-2xl font-bold" style={{ color: isAdvanced ? "#FFF9F0" : "var(--spark-ink)" }}>
                Welcome, {studentName}
              </h1>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1 md:gap-0">
            <div className="flex items-center gap-2 md:mb-1">
              <p className="text-xs md:text-sm hidden sm:block" style={{ color: isAdvanced ? "rgba(255,249,240,0.5)" : "var(--spark-ink-muted)" }}>Overall Progress</p>
              <a href="/api/auth/signout" className="text-[10px] md:text-xs font-medium px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-spark-ink-muted transition-colors" style={{ color: isAdvanced ? "#000" : "" }}>Sign out</a>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-16 md:w-32 h-1.5 md:h-2 rounded-full overflow-hidden" style={{ background: isAdvanced ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: accentColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <span className="font-semibold text-xs md:text-sm" style={{ color: accentColor }}>{completionPct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Left nav */}
        <nav className="w-full md:w-64 shrink-0 overflow-x-auto pb-2 md:pb-0 hide-scrollbar md:sticky md:top-28">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 md:mb-3 px-1 md:px-0" style={{ color: isAdvanced ? "rgba(255,249,240,0.4)" : "var(--spark-ink-muted)" }}>
            Learning Modules
          </p>
          <ul className="flex md:block space-x-2 md:space-x-0 md:space-y-2 w-max md:w-full">
            {modules.map((mod) => {
              const done = mod.tasks.filter((t) => t.progress[0]?.completed).length;
              const isActive = mod.id === activeModuleId;
              return (
                <li key={mod.id} className="inline-block md:block">
                  <button
                    onClick={() => setActiveModuleId(mod.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all md:whitespace-normal whitespace-nowrap border ${isActive && isAdvanced ? 'tech-glow' : ''} ${isActive && !isAdvanced ? 'animate-pulse-glow' : 'hover:scale-[1.02]'}`}
                    style={isActive
                      ? { background: isAdvanced ? "rgba(124,92,252,0.15)" : "rgba(255,138,61,0.08)", borderColor: isAdvanced ? "rgba(124,92,252,0.3)" : "rgba(255,138,61,0.2)", color: isAdvanced ? "var(--spark-tech-light)" : "var(--spark-primary)", fontWeight: 600 }
                      : { color: isAdvanced ? "rgba(255,249,240,0.6)" : "var(--spark-ink-muted)", background: isAdvanced ? "rgba(255,255,255,0.02)" : "#fff", borderColor: "transparent" }}
                  >
                    <div className="font-medium mb-1">{mod.title}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden" style={{ background: isAdvanced ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}>
                        <div className="h-full rounded-full" style={{ width: `${(done / (mod.tasks.length || 1)) * 100}%`, background: isActive ? accentColor : (isAdvanced ? "rgba(255,255,255,0.3)" : "#ccc") }} />
                      </div>
                      <span className="text-[10px] md:text-xs opacity-70">{done}/{mod.tasks.length}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content pane */}
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 min-w-0 flex flex-col gap-6"
          >
            {/* Header Card */}
            <div className={`rounded-2xl border p-6 md:p-8 transition-all hover:scale-[1.01] ${isAdvanced ? 'hover:shadow-[0_0_30px_rgba(124,92,252,0.15)]' : 'hover:shadow-[0_0_30px_rgba(47,184,139,0.15)]'}`}
              style={{ background: isAdvanced ? "#14112B" : "#fff", borderColor: isAdvanced ? "rgba(124,92,252,0.2)" : "var(--spark-border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wider" style={{ background: isAdvanced ? "rgba(124,92,252,0.2)" : "rgba(255,138,61,0.1)", color: isAdvanced ? "var(--spark-tech-light)" : "var(--spark-primary)" }}>
                  {active.contentType.replace("_", " ")}
                </span>
              </div>
              <h2 className="font-baloo text-2xl md:text-3xl font-bold mb-3" style={{ color: isAdvanced ? "#FFF9F0" : "var(--spark-ink)" }}>{active.title}</h2>
              <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ color: isAdvanced ? "rgba(255,249,240,0.7)" : "var(--spark-ink-muted)" }}>{active.description}</p>
              
              {active.externalUrl && (
                <a href={active.externalUrl} target="_blank" rel="noopener noreferrer" className="spark-btn-primary text-sm py-3 px-6 inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 rounded-xl font-semibold">
                  Launch Activity ↗
                </a>
              )}
            </div>

            {/* YouTube Video */}
            {active.youtubeUrl && (
              <div className={`rounded-2xl overflow-hidden border shadow-sm aspect-video transition-all hover:scale-[1.01] ${isAdvanced ? 'hover:shadow-[0_0_30px_rgba(124,92,252,0.15)]' : 'hover:shadow-[0_0_30px_rgba(47,184,139,0.15)]'}`} style={{ borderColor: isAdvanced ? "rgba(124,92,252,0.2)" : "var(--spark-border)" }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={active.youtubeUrl} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="bg-black"
                ></iframe>
              </div>
            )}

            {/* External Activity Button (For Std 1-5) */}
            {active.externalUrl && (
              <div className="flex justify-center mt-4 mb-2">
                <a 
                  href={active.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl font-baloo text-xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-3"
                  style={{ background: "linear-gradient(135deg, #FF8A3D 0%, #F9627D 100%)", color: "#fff" }}
                >
                  <span>🚀</span> Launch Interactive Activity
                </a>
              </div>
            )}

            {/* Summary Content */}
            {active.summary && (
              <div className="rounded-2xl border p-6 md:p-8" style={{ background: isAdvanced ? "#14112B" : "#fff", borderColor: isAdvanced ? "rgba(124,92,252,0.2)" : "var(--spark-border)" }}>
                <div className="prose prose-sm md:prose-base max-w-none" style={{ color: isAdvanced ? "rgba(255,249,240,0.8)" : "var(--spark-ink)" }}>
                  {active.summary.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <h3 key={i} className="font-baloo text-lg font-bold mt-6 mb-3" style={{ color: isAdvanced ? "#FFF9F0" : "var(--spark-ink)" }}>{line.replace(/\*\*/g, '')}</h3>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4 mb-2">{line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong style="color: inherit">$1</strong>')}</li>;
                    }
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
                  })}
                </div>
              </div>
            )}

            {/* Interactive Quiz */}
            {active.quizJson && (
              <InteractiveQuiz 
                quizJson={active.quizJson} 
                isAdvanced={isAdvanced} 
                accentColor={accentColor}
                onQuizComplete={(score) => {
                  // Find the quiz task (usually contains 'quiz' in title)
                  const quizTask = active.tasks.find(t => t.title.toLowerCase().includes("quiz")) || active.tasks[active.tasks.length - 1];
                  if (quizTask && !quizTask.progress[0]?.completed) {
                    handleToggleTask(quizTask.id, false, score);
                  }
                }}
              />
            )}

            {/* Tasks / Checklist */}
            <div className="rounded-2xl border p-6 md:p-8" style={{ background: isAdvanced ? "#14112B" : "#fff", borderColor: isAdvanced ? "rgba(124,92,252,0.2)" : "var(--spark-border)" }}>
              <h3 className="font-baloo text-xl font-bold mb-4" style={{ color: isAdvanced ? "#FFF9F0" : "var(--spark-ink)" }}>Final Tests & Tasks</h3>
              <ul className="space-y-3">
                {active.tasks.map((task, idx) => {
                  const prog = task.progress[0];
                  const isCompleted = prog?.completed;
                  const isLoading = loadingTask === task.id;

                  return (
                    <motion.li
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() => handleToggleTask(task.id, !!isCompleted)}
                        disabled={isLoading}
                        className="w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-colors hover:bg-opacity-50 relative overflow-hidden"
                        style={{ 
                          background: isAdvanced ? (isCompleted ? "rgba(124,92,252,0.1)" : "rgba(255,255,255,0.02)") : (isCompleted ? "var(--spark-bg)" : "#fff"), 
                          borderColor: isCompleted ? accentColor : (isAdvanced ? "rgba(124,92,252,0.15)" : "var(--spark-border)"),
                          cursor: isLoading ? "wait" : "pointer",
                          opacity: isLoading ? 0.7 : 1
                        }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm transition-colors"
                          style={isCompleted
                            ? { background: accentColor, color: "#fff" }
                            : { background: isAdvanced ? "rgba(124,92,252,0.1)" : "var(--spark-bg)", color: isAdvanced ? "rgba(255,249,240,0.4)" : "var(--spark-ink-muted)", border: `1px solid ${isAdvanced ? "rgba(124,92,252,0.3)" : "var(--spark-border)"}` }}>
                          {isCompleted ? "✓" : idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm md:text-base leading-snug transition-colors" style={{ color: isAdvanced ? (isCompleted ? "rgba(255,249,240,0.6)" : "#FFF9F0") : (isCompleted ? "var(--spark-ink-muted)" : "var(--spark-ink)"), textDecoration: isCompleted ? "line-through" : "none" }}>{task.title}</p>
                          <p className="text-xs mt-1" style={{ color: isAdvanced ? "rgba(255,249,240,0.4)" : "var(--spark-ink-muted)" }}>{task.points} XP</p>
                        </div>
                        {prog?.score != null && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: isAdvanced ? "rgba(124,92,252,0.15)" : "rgba(47,184,139,0.1)", color: accentColor }}>
                            Score: {prog.score}
                          </span>
                        )}
                        {!isCompleted && !isLoading && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full opacity-0 hover:opacity-100 absolute right-4 transition-opacity" style={{ background: accentColor, color: "#fff" }}>
                            Mark Done
                          </span>
                        )}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}