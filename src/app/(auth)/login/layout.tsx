import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Login — SparkLearn" };
export default function LoginLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }