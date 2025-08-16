import { db } from "../db/client";
import { employees } from "../db/schema";
import { eq, count } from "drizzle-orm";

export type Employee = {
  id?: number;
  uuid: string;
  name: string;
  title: string;
  email: string;
  location: string;
  avatar?: string | null;
  departmentId: number;
};

export async function listEmployees(offset: number, limit: number) {
  return db.select().from(employees).offset(offset).limit(limit);
}

export async function countEmployees() {
  const rows = await db.select({ value: count() }).from(employees);
  const total = Number(rows[0]?.value ?? 0);
  return total;
}

export async function getEmployeeById(id: number) {
  const rows = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createEmployee(payload: Omit<Employee, "id">) {
  const result = await db.insert(employees).values(payload).returning();
  return result[0];
}

export async function updateEmployee(id: number, payload: Partial<Employee>) {
  const result = await db
    .update(employees)
    .set(payload)
    .where(eq(employees.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteEmployee(id: number) {
  const result = await db.delete(employees).where(eq(employees.id, id)).returning();
  return result[0] ?? null;
}


