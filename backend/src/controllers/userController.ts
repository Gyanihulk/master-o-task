import type { Request, Response } from "express";

import { createEmployee, getAllUsers } from "../services/userService";
import { getTasksForUser } from "../services/taskService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { logDebug, logInfo } from "../utils/logger";

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  logInfo("Users list request");
  const users = await getAllUsers();
  res.status(200).json(users);
});

export const listUserTasks = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      throw new AppError("Invalid user id", 400);
    }
    logInfo("User tasks request");
    logDebug("User tasks payload", { userId });
    if (req.user?.role === "EMPLOYEE" && req.user.id !== userId) {
      throw new AppError("Forbidden", 403);
    }
    const tasks = await getTasksForUser(userId);
    res.status(200).json(tasks);
  }
);

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  logInfo("Employee create request");
  logDebug("Employee create payload", {
    name: req.body?.name,
    email: req.body?.email,
  });
  const employee = await createEmployee(req.body);
  res.status(201).json(employee);
});
