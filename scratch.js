const { PrismaClient } = require('@prisma/client');
try {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  });
  console.log("Prisma instantiated");
} catch (e) {
  console.error("Prisma error:", e);
}
