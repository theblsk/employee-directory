import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const departments = sqliteTable("departments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  location: text("location").notNull(),
  avatar: text("avatar"),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departments.id),
});


