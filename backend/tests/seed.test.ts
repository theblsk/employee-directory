import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { existsSync, unlinkSync } from "node:fs";
import { DEPARTMENTS } from "../src/constants";

// Use a dedicated SQLite file for tests
const TEST_DB_PATH = "./employee-directory.test.sqlite";
process.env.DB_PATH = TEST_DB_PATH;

let migrateAndSeedIfEmpty: typeof import("../src/db/init")["migrateAndSeedIfEmpty"]; 
let db: typeof import("../src/db/client")["db"]; 
let sqlite: typeof import("../src/db/client")["sqlite"]; 
let employees: typeof import("../src/db/schema")["employees"]; 
let departments: typeof import("../src/db/schema")["departments"]; 

beforeAll(async () => {
  // Import after setting DB_PATH so client uses the test file
  ({ migrateAndSeedIfEmpty } = await import("../src/db/init"));
  ({ db, sqlite } = await import("../src/db/client"));
  ({ employees, departments } = await import("../src/db/schema"));
});

afterAll(async () => {
  // Close connection and remove test DB file
  try {
    sqlite.close();
  } catch {}
  if (existsSync(TEST_DB_PATH)) {
    unlinkSync(TEST_DB_PATH);
  }
});

describe("migrateAndSeedIfEmpty", () => {
  test("seeds departments and employees when empty", async () => {
    await migrateAndSeedIfEmpty();

    const deptRows = await db.select().from(departments);
    const empRows = await db.select().from(employees);

    // Departments should match constants
    expect(deptRows.length).toBe(DEPARTMENTS.length);
    const deptNames = new Set(deptRows.map((d) => d.name));
    for (const name of DEPARTMENTS) expect(deptNames.has(name)).toBe(true);

    // Employees should be seeded with unique IDs
    expect(empRows.length).toBeGreaterThan(0);
    const ids = empRows.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("does not reseed when data already exists", async () => {
    const before = await db.select().from(employees);
    await migrateAndSeedIfEmpty();
    const after = await db.select().from(employees);

    // Compare ID sets before and after
    const beforeIds = before.map((e) => e.id).sort();
    const afterIds = after.map((e) => e.id).sort();
    expect(afterIds).toEqual(beforeIds);
  });
});


