import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const departments = sqliteTable("departments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const employees = sqliteTable("employees", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  location: text("location").notNull(),
  avatar: text("avatar").notNull(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departments.id),
});


