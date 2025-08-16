import express from "express";
import cors from "cors";
import { migrateAndSeedIfEmpty } from "./src/db/init";
import { db } from "./src/db/client";
import { employees, departments } from "./src/db/schema";
import { eq } from "drizzle-orm";
import apiRouter from "./src/routes";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());

// Configure CORS using comma-separated env var ALLOWED_ORIGINS
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use("/api", apiRouter);

app.get("/", async (_req, res) => {
    const rows = await db
        .select({
            id: employees.id,
            name: employees.name,
            title: employees.title,
            email: employees.email,
            location: employees.location,
            avatar: employees.avatar,
            department: departments.name,
        })
        .from(employees)
        .leftJoin(departments, eq(departments.id, employees.departmentId));
	res.json(rows);
});

app.listen(port, async () => {
    await migrateAndSeedIfEmpty();
	console.log(`Server listening on http://localhost:${port}`);
});