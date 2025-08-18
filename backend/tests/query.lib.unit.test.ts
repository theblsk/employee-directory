import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";

describe("query.lib (unit)", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  test("buildWhereClause returns undefined when no filters provided", async () => {
    // Arrange mocks
    await mock.module("drizzle-orm", () => ({
      and: (..._args: any[]) => ({ type: "and", args: _args }),
      or: (..._args: any[]) => ({ type: "or", args: _args }),
      like: (_c: any, _p: any) => ({ type: "like" }),
      eq: (_c: any, _v: any) => ({ type: "eq" }),
    }));

    const lib = await import("../src/lib/query.lib");
    const result = lib.buildWhereClause({});
    expect(result).toBeUndefined();
  });

  test("buildWhereClause with searchTerm composes or(like(...)) across name,email,location,title and wraps in and(...)", async () => {
    const likeCalls: Array<{ col: any; pattern: string }> = [];
    const orArgs: any[] = [];
    const andArgs: any[] = [];
    await mock.module("drizzle-orm", () => ({
      and: (...args: any[]) => {
        andArgs.push(args);
        return { type: "and", args };
      },
      or: (...args: any[]) => {
        orArgs.push(args);
        return { type: "or", args };
      },
      like: (col: any, pattern: string) => {
        likeCalls.push({ col, pattern });
        return { type: "like", col, pattern };
      },
      eq: (_c: any, _v: any) => ({ type: "eq" }),
    }));

    const lib = await import("../src/lib/query.lib");
    const result = lib.buildWhereClause({ searchTerm: "  alice  " });
    expect((result as any)?.type).toBe("and");
    expect(orArgs.length).toBe(1);
    expect(likeCalls.length).toBe(4);
    likeCalls.forEach((c) => expect(c.pattern).toBe("%alice%"));
    expect(andArgs[0].length).toBe(1);
  });

  test("buildWhereClause with title uses eq(employees.title, trimmedTitle)", async () => {
    const eqCalls: Array<{ col: any; value: any }> = [];
    await mock.module("drizzle-orm", () => ({
      and: (...args: any[]) => ({ type: "and", args }),
      or: (...args: any[]) => ({ type: "or", args }),
      like: (_c: any, _p: any) => ({ type: "like" }),
      eq: (col: any, value: any) => {
        eqCalls.push({ col, value });
        return { type: "eq", col, value };
      },
    }));

    const lib = await import("../src/lib/query.lib");
    const result = lib.buildWhereClause({ title: "  Dev  " }); // Dev with whitespace to test trim
    expect((result as any)?.type).toBe("and");
    expect(eqCalls.length).toBe(1);
    expect(eqCalls[0]?.value).toBe("Dev");
  });

  test("buildWhereClause with department uses eq(departments.name, trimmedDepartment)", async () => {
    const eqCalls: Array<{ col: any; value: any }> = [];
    await mock.module("drizzle-orm", () => ({
      and: (...args: any[]) => ({ type: "and", args }),
      or: (...args: any[]) => ({ type: "or", args }),
      like: (_c: any, _p: any) => ({ type: "like" }),
      eq: (col: any, value: any) => {
        eqCalls.push({ col, value });
        return { type: "eq", col, value };
      },
    }));

    const lib = await import("../src/lib/query.lib");
    const result = lib.buildWhereClause({ department: "  HR  " });
    expect((result as any)?.type).toBe("and");
    expect(eqCalls.length).toBe(1);
    expect(eqCalls[0]?.value).toBe("HR");
  });

  test("buildWhereClause combines searchTerm + title + department into and([or(...likes)], eq(title), eq(department))", async () => {
    const likeCalls: any[] = [];
    const eqCalls: any[] = [];
    const orArgs: any[] = [];
    const andArgs: any[] = [];
    await mock.module("drizzle-orm", () => ({
      and: (...args: any[]) => {
        andArgs.push(args);
        return { type: "and", args };
      },
      or: (...args: any[]) => {
        orArgs.push(args);
        return { type: "or", args };
      },
      like: (col: any, pattern: string) => {
        likeCalls.push({ col, pattern });
        return { type: "like", col, pattern };
      },
      eq: (col: any, value: any) => {
        eqCalls.push({ col, value });
        return { type: "eq", col, value };
      },
    }));

    const lib = await import("../src/lib/query.lib");
    const result = lib.buildWhereClause({
      searchTerm: "a",
      title: "Dev",
      department: "HR",
    });
    expect((result as any)?.type).toBe("and");
    expect(orArgs.length).toBe(1);
    expect(likeCalls.length).toBe(4);
    expect(eqCalls.length).toBe(2);
    // and should have received three conditions
    expect(andArgs[0].length).toBe(3);
  });
});
