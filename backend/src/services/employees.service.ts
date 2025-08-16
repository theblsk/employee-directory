import * as repo from "../repositories/employees.repository";

export async function list(page: number, limit: number) {
  const safeLimit = Math.max(1, Math.min(100, limit || 10));
  const safePage = Math.max(1, page || 1);
  const offset = (safePage - 1) * safeLimit;
  const [items, total] = await Promise.all([
    repo.listEmployees(offset, safeLimit),
    repo.countEmployees(),
  ]);
  return { items, total, page: safePage, limit: safeLimit, pages: Math.ceil(total / safeLimit) };
}

export async function getById(id: number) {
  return repo.getEmployeeById(id);
}

export async function create(payload: Omit<repo.Employee, "id">) {
  return repo.createEmployee(payload);
}

export async function update(id: number, payload: Partial<repo.Employee>) {
  return repo.updateEmployee(id, payload);
}

export async function remove(id: number) {
  return repo.deleteEmployee(id);
}


