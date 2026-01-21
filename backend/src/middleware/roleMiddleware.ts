import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/AppError";

export const requireRole =
  (role: "ADMIN" | "EMPLOYEE") =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    if (req.user.role !== role) {
      throw new AppError("Forbidden", 403);
    }
    next();
  };
