import { migrateAndSeedIfEmpty } from "../db/init";

async function run(): Promise<void> {
  try {
    await migrateAndSeedIfEmpty();
    console.log("Migration and seed completed.");
  } catch (error) {
    console.error("Migration/seed failed:", error);
    process.exit(1);
  }
}

run();


