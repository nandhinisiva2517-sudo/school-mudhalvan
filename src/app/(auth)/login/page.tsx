"use client";
import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { DemoModal } from "@/components/ui/DemoModal";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "AccessDenied") {
      setError("No account is linked to this Google email. Please register first.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{background:"rgba(232,68,122,0.10)", color:"var(--spark-secondary)"}}>
          {error}
        </div>
      )}
      

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1.5 text-spark-ink">Email address</label>
          <input id="email" type="email" className="spark-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold mb-1.5 text-spark-ink">Password</label>
          <input id="password" type="password" className="spark-input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>
        <button type="submit" id="login-submit" disabled={loading} className="spark-btn-primary w-full mt-2 disabled:opacity-60">
          {loading ? "Logging in…" : "Log In with Email"}
        </button>
      </form>

      <div className="relative mt-6 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" style={{borderColor: "var(--spark-border)"}}></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-spark-ink-muted">Or try a demo</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button 
          type="button" 
          onClick={() => setShowDemo(true)}
          className="w-full py-2 px-3 rounded-lg border text-sm font-semibold transition-all hover:bg-gray-50 flex items-center justify-center gap-2 text-spark-ink border-gray-200"
        >
          <span className="text-xl">🚀</span>
          Try Demo Options
        </button>
      </div>
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </>
  );
}

import { BackButton } from "@/components/ui/BackButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-spark-bg px-4 py-12 relative">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <BackButton />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl spark-gradient-primary flex items-center justify-center text-white font-bold text-lg">S</div>
            <span className="font-baloo text-2xl font-bold text-spark-ink">SparkLearn</span>
          </Link>
          <h1 className="font-baloo text-3xl font-bold text-spark-ink">Welcome back!</h1>
          <p className="text-spark-ink-muted mt-1">Log in to continue your learning journey.</p>
        </div>

        <div className="spark-card">
          <Suspense fallback={<div className="h-64 flex items-center justify-center text-spark-ink-muted animate-pulse">Loading...</div>}>
            <LoginForm />
          </Suspense>
          <p className="text-center text-sm text-spark-ink-muted mt-6">
            New student?{" "}
            <Link href="/register/student" className="font-semibold" style={{color:"var(--spark-primary)"}}>Register here</Link>
            {" · "}
            <Link href="/register/staff" className="font-semibold" style={{color:"var(--spark-primary)"}}>I am a teacher</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}