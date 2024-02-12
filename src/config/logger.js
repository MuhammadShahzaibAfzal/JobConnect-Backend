import winston, { format } from "winston";
const { combine, timestamp, prettyPrint } = format;

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
  defaultMeta: { service: "jobportalapi" },
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({ dirname: "logs", filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console());
}
