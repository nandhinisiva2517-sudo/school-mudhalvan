const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});
async function main() {
  const result = await prisma.school.findMany({
    where: { name: { contains: 'SEVAMANDIR', mode: 'insensitive' } },
    select: { name: true, district: true }
  });
  console.log('All Sevamandir schools:', result);
}
main().finally(() => prisma.$disconnect());
