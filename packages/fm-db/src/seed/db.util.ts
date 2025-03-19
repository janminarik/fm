import { PrismaClient } from "@prisma/client";

export const cleanupDatabase = async (prisma: PrismaClient) => {
  console.log("Starting the database cleanup process...");

  //TODO: config
  const skipTables = ["_prisma_migrations", "User"];

  const tableNames = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

  for (const { tablename } of tableNames) {
    if (!skipTables.includes(tablename)) {
      await prisma.$executeRawUnsafe(
        `TRUNCATE "${tablename}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
  console.log("The cleanup process has been completed successfully.");
};
