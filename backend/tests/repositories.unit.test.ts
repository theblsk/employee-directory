import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";

// We will mock the drizzle db session methods used by repositories
describe("repositories (unit)", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  test("employees.repository.searchEmployees builds filtered query and returns {items,total}", async () => {
    const limit = async () => [
      { id: 1, uuid: "u1", name: "n", title: "t", email: "e", location: "l", avatar: null, departmentId: 1, department: "HR" },
      { id: 2, uuid: "u2", name: "n", title: "t", email: "e", location: "l", avatar: null, departmentId: 1, department: "HR" },
    ];
    const offset = () => ({ limit });
    const where = () => ({ offset } as any);
    const leftJoin = () => ({ where } as any);
    const from = () => ({ leftJoin } as any);
    const select = () => ({ from } as any);

    const countRows = [{ value: 20 }];
    const countWhere = async () => countRows;
    const countLeftJoin = () => ({ where: countWhere } as any);
    const countFrom = () => ({ leftJoin: countLeftJoin } as any);
    const countSelect = () => ({ from: countFrom } as any);

    await mock.module("../src/db/client", () => ({ db: { select: select as unknown as any } }));
    await mock.module("../src/db/client", () => ({ db: { select: select as unknown as any } }));

    // mock where clause builder to return a passthrough token
    await mock.module("../src/lib/query.lib", () => ({ buildWhereClause: () => ({}), }));

    const repo = await import("../src/repositories/employees.repository");
    // override count path on imported db by patching the module mock
    await mock.module("../src/db/client", () => ({ db: { select: (arg?: any) => (arg ? { from: countFrom } : { from } as any) } }));

    const result = await repo.searchEmployees({ searchTerm: "n" } as any, 5, 10);
    expect(result.items.length).toBe(2);
    expect(result.total).toBe(20);
  });

  test("departments.repository.listDepartments invokes select().from().offset().limit() chain", async () => {
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


