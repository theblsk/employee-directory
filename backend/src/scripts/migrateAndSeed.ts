import { migrateAndSeedIfEmpty } from "../db/init";
import { existsSync } from "node:fs";
import { databaseFile } from "../db/client";

async function run(): Promise<void> {
  try {
    if (!existsSync(databaseFile)) {
      await migrateAndSeedIfEmpty();
    } else {
      console.log(`Database exists at ${databaseFile}. Skipping migration/seed.`);
    }
    console.log("Migration and seed completed.");
  } catch (error) {
    const err = error as unknown as Record<string, unknown>;
    const detailed = {
      name: (err as any)?.name,
      message: (err as any)?.message,
      stack: (err as any)?.stack,
      cause: (err as any)?.cause,
      errorString: String(error),
    };
    console.error("Migration/seed failed with detailed error:", detailed);
    process.exit(1);
  }
}

run();


