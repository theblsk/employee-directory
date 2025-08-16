import * as repo from "../repositories/departments.repository";

export async function list(page: number, limit: number) {
  const safeLimit = Math.max(1, Math.min(100, limit ?? 10));
  const safePage = Math.max(1, page ?? 1);
  const offset = (safePage - 1) * safeLimit;
  const [items, total] = await Promise.all([
    repo.listDepartments(offset, safeLimit),
    repo.countDepartments(),
  ]);
  return { items, total, page: safePage, limit: safeLimit, pages: Math.ceil(total / safeLimit) };
}

export async function getById(id: number) {
  return repo.getDepartmentById(id);
}

export async function create(payload: repo.Department) {
  return repo.createDepartment(payload);
}

export async function update(id: number, payload: Partial<repo.Department>) {
  return repo.updateDepartment(id, payload);
}

export async function remove(id: number) {
  return repo.deleteDepartment(id);
}


