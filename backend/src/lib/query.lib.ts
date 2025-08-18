import { and, or, like, eq } from "drizzle-orm";
import { employees, departments } from "../db/schema";

export type EmployeeSearchFilters = {
  searchTerm?: string;
  title?: string;
  department?: string;
};
// Better naming can be used, kept like this for demo purposes
export function buildWhereClause({ searchTerm, title, department }: EmployeeSearchFilters) {
  const conditions = [];
  if (searchTerm && searchTerm.trim().length > 0) {
    const pattern = `%${searchTerm.trim()}%`;
    conditions.push(
      or(
        like(employees.name, pattern),
        like(employees.email, pattern),
        like(employees.location, pattern),
        like(employees.title, pattern)
      )
    );
  }
  if (title && title.trim().length > 0) {
    conditions.push(eq(employees.title, title.trim()));
  }
  if (department && department.trim().length > 0) {
    conditions.push(eq(departments.name, department.trim()));
  }
  if (conditions.length === 0) return undefined;
  return and(...conditions);
}


