"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function DemoModal({ isOpen, onClose }: Props) {
  const [role, setRole] = useState<"STUDENT" | "STAFF" | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDemoLogin(email: string) {
    setLoading(true);
    await signIn("credentials", { email, password: "demo", callbackUrl: "/dashboard" });
    // Note: no need to setLoading(false) on success because it redirects
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-baloo text-2xl font-bold text-spark-ink">
                {role === "STUDENT" ? "Select Grade Category" : "Try Demo"}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">✕</button>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-spark-ink-muted">
                <div className="w-8 h-8 border-4 border-spark-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>Setting up your demo account...</p>
              </div>
            ) : !role ? (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setRole("STUDENT")}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-spark-primary hover:bg-orange-50 transition-colors"
                >
                  <span className="text-4xl mb-3">🎓</span>
                  <span className="font-semibold text-spark-ink">Student Demo</span>
                </button>
                <button 
                  onClick={() => handleDemoLogin("demo-staff@sparklearn.com")}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-spark-primary hover:bg-orange-50 transition-colors"
                >
                  <span className="text-4xl mb-3">👨‍🏫</span>
                  <span className="font-semibold text-spark-ink">Staff Demo</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button onClick={() => setRole(null)} className="text-sm text-spark-ink-muted hover:text-spark-ink mb-2 flex items-center gap-1">
                  ← Back to roles
                </button>
                {[
                  { label: "Std 1 - 3", email: "demo-student-1-3@sparklearn.com" },
                  { label: "Std 4 - 5", email: "demo-student-4-5@sparklearn.com" },
                  { label: "Std 6 - 8", email: "demo-student-6-8@sparklearn.com" },
                  { label: "Std 9 - 10", email: "demo-student-9-10@sparklearn.com" },
                  { label: "Std 11 - 12", email: "demo-student-11-12@sparklearn.com" },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => handleDemoLogin(opt.email)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-spark-primary hover:bg-orange-50 font-medium text-spark-ink transition-colors flex justify-between items-center"
                  >
                    {opt.label}
                    <span className="text-spark-primary">→</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
