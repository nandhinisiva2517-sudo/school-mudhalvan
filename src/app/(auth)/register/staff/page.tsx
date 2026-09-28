"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffRegisterSchema, StaffRegisterInput } from "@/lib/validations";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import { BackButton } from "@/components/ui/BackButton";

export default function StaffRegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StaffRegisterInput>({
    resolver: zodResolver(staffRegisterSchema),
  });

  async function onSubmit(data: StaffRegisterInput) {
    setServerError("");
    const res = await fetch("/api/auth/register/staff", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) { setServerError(Object.values(json.error ?? {}).flat().join(" · ")); return; }
    setAffiliateCode(json.affiliateCode);
  }

  if (affiliateCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spark-bg px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="spark-card max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="font-baloo text-2xl font-bold mb-2">Account Created!</h1>
          <p className="text-spark-ink-muted mb-6">Share this code with your students so they can register:</p>
          <div className="bg-spark-bg rounded-xl p-4 mb-6 font-mono text-2xl tracking-widest font-bold" style={{color:"var(--spark-primary)", letterSpacing:"0.15em"}}>
            {affiliateCode}
          </div>
          <p className="text-xs text-spark-ink-muted mb-6">Keep this safe. You can regenerate it later from your dashboard.</p>
          <Link href="/login" className="spark-btn-primary w-full">Go to Login →</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-spark-bg px-4 py-12 relative">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <BackButton />
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl spark-gradient-primary flex items-center justify-center text-white font-bold text-lg">S</div>
            <span className="font-baloo text-2xl font-bold">SparkLearn</span>
          </Link>
          <h1 className="font-baloo text-3xl font-bold">Register as Teacher / Staff</h1>
          <p className="text-spark-ink-muted mt-1">You will receive an affiliate code to share with students.</p>
        </div>
        <div className="spark-card">
          {serverError && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{background:"rgba(232,68,122,0.10)", color:"var(--spark-secondary)"}}>
              {serverError}
            </div>
          )}


          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1.5">Full Name</label>
              <input id="name" className="spark-input" placeholder="Your full name" {...register("name")} />
              {errors.name && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1.5">Email</label>
              <input id="email" type="email" className="spark-input" placeholder="you@school.edu" {...register("email")} />
              {errors.email && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="institutionName" className="block text-sm font-semibold mb-1.5">Institution (optional)</label>
              <input id="institutionName" className="spark-input" placeholder="Your school or organisation name" {...register("institutionName")} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-1.5">Password</label>
              <input id="password" type="password" className="spark-input" placeholder="Min. 8 characters" {...register("password")} />
              {errors.password && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="spark-btn-primary w-full mt-2 disabled:opacity-60">
              {isSubmitting ? "Creating account…" : "Create Staff Account"}
            </button>
          </form>
          <p className="text-center text-sm text-spark-ink-muted mt-6">
            Already have an account? <Link href="/login" className="font-semibold" style={{color:"var(--spark-primary)"}}>Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}