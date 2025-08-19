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
console.log("allowedOrigins", allowedOrigins);
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

app.use(errorHandler);

app.listen(port, async () => {
  try {
    await migrateAndSeedIfEmpty();
  } catch (error) {
    const err = error as unknown as Record<string, unknown>;
    const detailed = {
      name: (err as any)?.name,
      message: (err as any)?.message,
      stack: (err as any)?.stack,
      cause: (err as any)?.cause,
      errorString: String(error),
    };
    console.error(
      "Startup migrateAndSeedIfEmpty failed with detailed error:",
      detailed
    );
  }
  console.log(`Server listening on http://localhost:${port}`);
});
