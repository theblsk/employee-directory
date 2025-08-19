import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

const databaseFile = process.env.DB_PATH ?? "./employee-directory.sqlite";

export const sqlite = new Database(databaseFile);

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;


