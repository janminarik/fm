import { Faker, en } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { HashService } from "@repo/fm-shared";

import { cleanupDatabase } from "./db.util";
import { DataFactory } from "./factories";

async function main(prisma: PrismaClient) {
  console.log("Starting database seeding process...");

  const adSpaceCount = await prisma.adSpace.count();

  if (adSpaceCount > 0) {
    console.log("The database is not empty. Seeding is not required.");
    return;
  } else {
    console.log("The database is empty. Starting seeding process...");

    const count = 100;
    const customFaker = new Faker({ locale: [en] });
    const testDataFactory = new DataFactory(customFaker, "en");

    await cleanupDatabase(prisma);

    //create test user:
    const user = await testDataFactory.getDefaultUser();

    const hashService = new HashService();

    await prisma.user.create({
      data: {
        ...user,
        passwordHash: await hashService.hash(user.passwordHash),
      },
    });

    for (let i = 0; i < count; i++) {
      const adSpace = testDataFactory.createAdSpaceWithRelationData();

      await prisma.adSpace.create({
        data: adSpace,
      });
    }
  }
  console.log("Seeding process completed successfully");
}

const prisma = new PrismaClient();

main(prisma)
  .catch((e) => {
    console.error("An error occurred during the seeding process:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
  });
