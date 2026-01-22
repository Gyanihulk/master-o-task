import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/AppError";
import { logDebug, logInfo } from "../utils/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logInfo("Unhandled error");
  logDebug("Unhandled error detail", {
    message: err.message,
    stack: err.stack,
  });
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError ? err.message : "Internal server error";
  res.status(statusCode).json({ message });
};
