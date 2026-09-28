import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// /dashboard redirects to the correct role-based dashboard
export default async function DashboardRedirectPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role === "STAFF") redirect("/staff/dashboard");
  redirect("/student/dashboard");
}