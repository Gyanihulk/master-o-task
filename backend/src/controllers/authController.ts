import type { Request, Response } from "express";

import { login, register } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";
import { logDebug, logInfo } from "../utils/logger";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    logInfo("Auth register request");
    logDebug("Auth register payload", {
      name: req.body?.name,
      email: req.body?.email,
      role: req.body?.role,
    });
    const result = await register(req.body);
    res.status(201).json(result);
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    logInfo("Auth login request");
    logDebug("Auth login payload", {
      email: req.body?.email,
    });
    const result = await login(req.body);
    res.status(200).json(result);
  }
);
