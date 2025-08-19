import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let status = 500;
  let message = "Internal Server Error";
  let stack: string | undefined;

  if (err instanceof Error) {
    message = err.message ?? message;
    stack = err.stack;
    if ("status" in err) {
      const _status = (err as { status?: unknown }).status;
      if (typeof _status === "number") status = _status;
    }
    if ("statusCode" in err) {
      const _statusCode = (err as { statusCode?: unknown }).statusCode;
      if (typeof _statusCode === "number") status = _statusCode;
    }
  } else if (typeof err === "string") {
    message = err;
  }

  logger.error(message, {
    status,
    stack,
  });

  res.status(Number(status)).json({ message });
}


