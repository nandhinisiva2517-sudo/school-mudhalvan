import xlsx from "xlsx";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seeds must use the direct connection, NOT the pooled pgbouncer URL
// Note: Using DATABASE_URL (transaction pooler) because direct IPv6 connection fails on this network
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function main() {
  // Delete all existing schools
  console.log("Deleting old school data...");
  await prisma.school.deleteMany({});
  console.log("Old data deleted.");

  const xlsxPath = path.resolve(__dirname, "../../../TamilNadu_Schools_District_Wise_List.xlsx");
  console.log(`Loading Excel file from ${xlsxPath}...`);
  
  const workbook = xlsx.readFile(xlsxPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const rows = xlsx.utils.sheet_to_json(sheet) as Record<string, any>[];
  
  const records: { name: string; district: string }[] = [];

  for (const row of rows) {
    const name = row["School Name"] || row["SCHOOL_NAME"] || row["school_name"] || row["name"] || "";
    const district = row["District"] || row["DISTNAME"] || row["district"] || "Unknown";
    
    if (name && name.trim().length > 2) {
      records.push({ name: name.trim(), district: district.trim() });
    }
  }

  // Dedupe by name+district
  const seen = new Set<string>();
  const unique = records.filter((r) => {
    const key = `${r.name.toLowerCase()}|${r.district.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`Seeding ${unique.length} unique schools from Excel...`);

  const BATCH = 2000;
  for (let i = 0; i < unique.length; i += BATCH) {
    const batch = unique.slice(i, i + BATCH);
    await prisma.school.createMany({ data: batch, skipDuplicates: true });
    console.log(`  Inserted batch ${Math.floor(i / BATCH) + 1} (${Math.min(i + BATCH, unique.length)} / ${unique.length})`);
  }

  // Add pg_trgm index (raw SQL) just to be safe
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS school_name_trgm_idx ON "School" USING GIN (name gin_trgm_ops)
  `);

  console.log("School seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
