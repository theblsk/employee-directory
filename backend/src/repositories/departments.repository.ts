import { db } from "../db/client";
import { departments } from "../db/schema";
import { eq, count } from "drizzle-orm";

export type Department = {
  id?: number;
  name: string;
};

export async function listDepartments(offset: number, limit: number) {
  return db.select().from(departments).offset(offset).limit(limit);
}

export async function getDepartmentById(id: number) {
  const rows = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createDepartment(payload: Department) {
  const result = await db.insert(departments).values({ name: payload.name }).returning();
  return result[0];
}

export async function updateDepartment(id: number, payload: Partial<Department>) {
  const result = await db
    .update(departments)
    .set({ name: payload.name as string })
    .where(eq(departments.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteDepartment(id: number) {
  const result = await db.delete(departments).where(eq(departments.id, id)).returning();
  return result[0] ?? null;
}

export async function countDepartments() {
  const rows = await db.select({ value: count() }).from(departments);
  const total = Number(rows[0]?.value ?? 0);
  return total;
}


