"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentRegisterSchema, StudentRegisterInput } from "@/lib/validations";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { SchoolAutocomplete } from "@/components/registration/SchoolAutocomplete";

const STANDARDS = [
  { value: "S1", label: "Standard 1" }, { value: "S2", label: "Standard 2" },
  { value: "S3", label: "Standard 3" }, { value: "S4", label: "Standard 4" },
  { value: "S5", label: "Standard 5" }, { value: "S6", label: "Standard 6" },
  { value: "S7", label: "Standard 7" }, { value: "S8", label: "Standard 8" },
  { value: "S9", label: "Standard 9" }, { value: "S10", label: "Standard 10" },
  { value: "S11", label: "Standard 11" }, { value: "S12", label: "Standard 12" },
];

import { BackButton } from "@/components/ui/BackButton";

export default function StudentRegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<StudentRegisterInput>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: { standard: "S1" },
  });

  async function onSubmit(data: StudentRegisterInput) {
    setServerError("");
    const res = await fetch("/api/auth/register/student", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) { setServerError(Object.values(json.error ?? {}).flat().join(" · ")); return; }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spark-bg px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="spark-card max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-baloo text-2xl font-bold mb-2">You are registered!</h1>
          <p className="text-spark-ink-muted">Redirecting you to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-spark-bg px-4 py-12 relative">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <BackButton />
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-lg z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl spark-gradient-primary flex items-center justify-center text-white font-bold text-lg">S</div>
            <span className="font-baloo text-2xl font-bold">SparkLearn</span>
          </Link>
          <h1 className="font-baloo text-3xl font-bold">Student Registration</h1>
          <p className="text-spark-ink-muted mt-1">You will need an affiliate code from your teacher.</p>
        </div>
        <div className="spark-card">
          {serverError && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{background:"rgba(232,68,122,0.10)", color:"var(--spark-secondary)"}}>
              {serverError}
            </div>
          )}


          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="s-name" className="block text-sm font-semibold mb-1.5">Full Name</label>
              <input id="s-name" className="spark-input" placeholder="Your full name" {...register("name")} />
              {errors.name && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="s-email" className="block text-sm font-semibold mb-1.5">Email</label>
              <input id="s-email" type="email" className="spark-input" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="s-standard" className="block text-sm font-semibold mb-1.5">Standard (Class)</label>
              <select id="s-standard" className="spark-input" {...register("standard")}>
                {STANDARDS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {errors.standard && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.standard.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">School</label>
              <Controller
                name="schoolId"
                control={control}
                render={({ field }) => (
                  <SchoolAutocomplete
                    value=""
                    onSelect={(school) => { field.onChange(school.id); setValue("schoolId", school.id); }}
                  />
                )}
              />
              {errors.schoolId && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.schoolId.message}</p>}
            </div>
            <div>
              <label htmlFor="s-code" className="block text-sm font-semibold mb-1.5">Affiliate Code <span className="text-spark-ink-muted font-normal">(from your teacher)</span></label>
              <input id="s-code" className="spark-input font-mono tracking-widest uppercase" maxLength={8} placeholder="XXXXXXXX" {...register("affiliateCode")} />
              {errors.affiliateCode && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.affiliateCode.message}</p>}
            </div>
            <div>
              <label htmlFor="s-guardian" className="block text-sm font-semibold mb-1.5">Guardian Email <span className="text-spark-ink-muted font-normal">(optional, required for consent)</span></label>
              <input id="s-guardian" type="email" className="spark-input" placeholder="parent@example.com" {...register("guardianEmail")} />
              {errors.guardianEmail && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.guardianEmail.message}</p>}
            </div>
            <div>
              <label htmlFor="s-password" className="block text-sm font-semibold mb-1.5">Password</label>
              <input id="s-password" type="password" className="spark-input" placeholder="Min. 8 characters" {...register("password")} />
              {errors.password && <p className="text-xs mt-1" style={{color:"var(--spark-secondary)"}}>{errors.password.message}</p>}
            </div>
            <p className="text-xs text-spark-ink-muted border border-spark-border rounded-lg p-3">
              🔒 As per India's DPDP Act 2023, parental consent is required for students under 18. 
              Your guardian will be contacted at the email above for verification.
            </p>
            <button type="submit" disabled={isSubmitting} className="spark-btn-primary w-full disabled:opacity-60">
              {isSubmitting ? "Registering…" : "Create Student Account"}
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