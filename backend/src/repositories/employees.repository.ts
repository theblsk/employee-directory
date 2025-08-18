import { db } from "../db/client";
import { employees, departments } from "../db/schema";
import { eq, count } from "drizzle-orm";
import { buildWhereClause, type EmployeeSearchFilters } from "../lib/query.lib";

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

export type EmployeeWithDepartmentListItem = Employee & { department?: string | null };

export async function searchEmployees(
  filters: EmployeeSearchFilters,
  offset: number,
  limit: number
) {
  const whereExpr = buildWhereClause(filters);
  const base = db
    .select({
      id: employees.id,
      uuid: employees.uuid,
      name: employees.name,
      title: employees.title,
      email: employees.email,
      location: employees.location,
      avatar: employees.avatar,
      departmentId: employees.departmentId,
      department: departments.name,
    })
    .from(employees)
    .leftJoin(departments, eq(departments.id, employees.departmentId));

  const items = await base
    .where(whereExpr)
    .offset(offset)
    .limit(limit);

  const countBase = db
    .select({ value: count() })
    .from(employees)
    .leftJoin(departments, eq(departments.id, employees.departmentId));
  const countRows = await countBase.where(whereExpr);
  const total = Number(countRows[0]?.value ?? 0);

  return { items, total };
}

export async function listByDepartment(
  departmentName: string,
  offset: number,
  limit: number
) {
  return searchEmployees({ department: departmentName }, offset, limit);
}

export async function listByTitle(title: string, offset: number, limit: number) {
  return searchEmployees({ title }, offset, limit);
}


