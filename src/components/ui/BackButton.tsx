"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function BackButton() {
  const router = useRouter();
  
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-spark-ink-muted hover:text-spark-primary transition-colors py-2 px-3 rounded-lg hover:bg-black/5"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Back
    </motion.button>
  );
}
