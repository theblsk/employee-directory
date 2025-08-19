import express from "express";
import cors from "cors";
import { migrateAndSeedIfEmpty } from "./src/db/init";
import apiRouter from "./src/routes";
import { errorHandler } from "./src/middleware/errorHandler";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());

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
  res.send("Hello World");
});

// Global error handler should be the last middleware
app.use(errorHandler);

app.listen(port, async () => {
  await migrateAndSeedIfEmpty();
  console.log(`Server listening on http://localhost:${port}`);
});
