import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";

describe("services (unit)", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  test("employees.service.list returns pagination envelope using repo", async () => {
    const items = [
      { id: 1, uuid: "u1", name: "n", title: "t", email: "e", location: "l", avatar: null, departmentId: 1 },
      { id: 2, uuid: "u2", name: "n", title: "t", email: "e", location: "l", avatar: null, departmentId: 1 },
    ];
    await mock.module("../src/repositories/employees.repository", () => ({
      listEmployees: async () => items,
      countEmployees: async () => 20,
      getEmployeeById: async () => null,
      createEmployee: async () => null,
      updateEmployee: async () => null,
      deleteEmployee: async () => null,
    }));

    const service = await import("../src/services/employees.service");
    const result = await service.list(2, 2);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(2);
    expect(result.total).toBe(20);
    expect(result.pages).toBe(10);
    expect(result.items).toEqual(items);
  });

  test("departments.service.list returns pagination envelope using repo", async () => {
    const items = [{ id: 1, name: "a" }];
    await mock.module("../src/repositories/departments.repository", () => ({
      listDepartments: async () => items,
      countDepartments: async () => 1,
      getDepartmentById: async () => null,
      createDepartment: async () => null,
      updateDepartment: async () => null,
      deleteDepartment: async () => null,
    }));

    const service = await import("../src/services/departments.service");
    const result = await service.list(1, 3);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(3);
    expect(result.total).toBe(1);
    expect(result.pages).toBe(1);
    expect(result.items).toEqual(items);
  });
});


