import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";

// We will mock the drizzle db session methods used by repositories
describe("repositories (unit)", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  test("employees.repository listEmployees calls select().from().offset().limit() chain", async () => {
    const limit = async () => [
      { id: 1, uuid: "u1", name: "n", title: "t", email: "e", location: "l", avatar: null, departmentId: 1 },
      { id: 2, uuid: "u2", name: "n", title: "t", email: "e", location: "l", avatar: null, departmentId: 1 },
    ];
    const offset = () => ({ limit });
    const from = () => ({ offset } as any);
    const select = () => ({ from } as any);
    await mock.module("../src/db/client", () => ({ db: { select: select as unknown as any } }));

    const repo = await import("../src/repositories/employees.repository");
    const result = await repo.listEmployees(5, 10);
    expect(result).toEqual([
      { id: 1, uuid: "u1", name: "n", title: "t", email: "e", location: "l", avatar: null, departmentId: 1 },
      { id: 2, uuid: "u2", name: "n", title: "t", email: "e", location: "l", avatar: null, departmentId: 1 },
    ]);
  });

  test("departments.repository listDepartments calls select().from().offset().limit() chain", async () => {
    const limit = async () => [{ id: 1, name: "a" }];
    const offset = () => ({ limit });
    const from = () => ({ offset } as any);
    const select = () => ({ from } as any);
    await mock.module("../src/db/client", () => ({ db: { select: select as unknown as any } }));

    const repo = await import("../src/repositories/departments.repository");
    const result = await repo.listDepartments(0, 1);
    // basic shape assertion
    expect(result).toEqual([{ id: 1, name: "a" }]);
  });
});


