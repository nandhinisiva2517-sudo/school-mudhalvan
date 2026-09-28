export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { requireRole, getStaffFromSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { generateUniqueAffiliateCode } from "@/lib/affiliate-code";

export async function GET(req: NextRequest) {
  const { error, session } = await requireRole("STAFF");
  if (error) return error;
  const staff = await getStaffFromSession();
  if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });
  return NextResponse.json({ affiliateCode: staff.affiliateCode });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireRole("STAFF");
  if (error) return error;
  const staff = await getStaffFromSession();
  if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });

  const newCode = await generateUniqueAffiliateCode();
  await prisma.staff.update({ where: { id: staff.id }, data: { affiliateCode: newCode } });
  await prisma.auditLog.create({ data: { staffId: staff.id, action: "REGENERATE_AFFILIATE_CODE" } });

  return NextResponse.json({ affiliateCode: newCode });
}
