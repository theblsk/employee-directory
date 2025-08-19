import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors, splat, json, colorize } = format;

const environment = process.env.NODE_ENV ?? "development";

const logFormat = printf((info) => {
  const { level, message, timestamp, stack, ...meta } = info;
  if (stack) {
    return `${timestamp} ${level}: ${message} | stack=${stack}`;
  }
  const metaString = meta && Object.keys(meta).length ? ` | meta=${JSON.stringify(meta)}` : "";
  return `${timestamp} ${level}: ${message}${metaString}`;
});

export const logger = createLogger({
  level: environment === "production" ? "info" : environment === "test" ? "warn" : "debug",
  format: combine(
    errors({ stack: true }),
    splat(),
    timestamp(),
    environment === "production" ? json() : combine(colorize(), logFormat)
  ),
  transports: [new transports.Console()],
});

export type Logger = typeof logger;


