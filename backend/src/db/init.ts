import { db, sqlite } from "./client";
import { departments, employees } from "./schema";
import { DEPARTMENTS } from "../constants";
import { seedEmployeesFromRandomUser } from "../lib/seedData";

export async function migrateAndSeedIfEmpty() {
  // Create tables if they do not exist (Bun sqlite DDL via exec)
  sqlite.exec(
    `CREATE TABLE IF NOT EXISTS departments (
      id integer primary key autoincrement,
      name text not null unique
    );`
  );
  sqlite.exec(
    `CREATE TABLE IF NOT EXISTS employees (
      id integer primary key autoincrement,
      uuid text not null unique,
      name text not null,
      title text not null,
      email text not null,
      location text not null,
      avatar text,
      department_id integer not null references departments(id)
    );`
  );

  // Seed departments if empty
  const existingDepartments = await db.select().from(departments).limit(1);
  if (existingDepartments.length === 0) {
    await db.insert(departments).values(DEPARTMENTS.map((name) => ({ name })));
  }

  // Seed employees if empty
  const existingEmployees = await db.select().from(employees).limit(1);
  if (existingEmployees.length > 0) return;

  const departmentRows = await db.select().from(departments);
  const employeesData = await seedEmployeesFromRandomUser(50);

  const deptIds: number[] = departmentRows.map((d) => d.id as number);
  if (deptIds.length === 0) {
    throw new Error("No departments found after initialization");
  }
  const deptByIndex = (index: number): number => deptIds[index % deptIds.length] as number;

  await db.insert(employees).values(
    employeesData.map((e, i) => ({
      uuid: String(e.uuid),
      name: String(e.name),
      title: String(e.title),
      email: String(e.email),
      location: String(e.location),
      avatar: String(e.avatar),
      departmentId: deptByIndex(i),
    }))
  );
}


