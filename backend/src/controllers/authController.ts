import type { Request, Response } from "express";

import { login, register } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await register(req.body);
    res.status(201).json(result);
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await login(req.body);
    res.status(200).json(result);
  }
);
