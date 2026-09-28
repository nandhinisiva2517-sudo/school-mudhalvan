import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const standard = (session.user as any).standard as string;
  if (!["S11", "S12"].includes(standard)) {
    return NextResponse.json({ error: "This feature is only available for Std 11-12" }, { status: 403 });
  }

  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== "string" || prompt.length > 2000) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  // Google Generative AI has been removed from this project.
  return NextResponse.json({ response: "AI functionality has been disabled as Google Cloud / Firebase dependencies were removed." });
}