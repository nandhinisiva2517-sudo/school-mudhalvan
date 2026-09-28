import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const district = req.nextUrl.searchParams.get("district")?.trim();

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await prisma.$queryRawUnsafe<
      { id: string; name: string; district: string }[]
    >(
      district
        ? `SELECT id, name, district FROM "School" WHERE name ILIKE $1 AND district ILIKE $2 ORDER BY name ASC LIMIT 20`
        : `SELECT id, name, district FROM "School" WHERE name ILIKE $1 ORDER BY name ASC LIMIT 20`,
      `%${q}%`,
      ...(district ? [`%${district}%`] : [])
    );
    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err) {
    console.error("[GET /api/schools/search]", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}