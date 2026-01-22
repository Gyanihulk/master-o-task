import type { Request, Response } from "express";

import {
  createNewTask,
  getAllTasks,
  getTaskDetail,
  getTaskRecord,
  getTasksForUser,
  updateExistingTask,
} from "../services/taskService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { logDebug, logInfo } from "../utils/logger";

export const createTask = asyncHandler(
  async (req: Request, res: Response) => {
    logInfo("Task create request");
    logDebug("Task create payload", req.body);
    const task = await createNewTask(req.body);
    res.status(201).json(task);
  }
);

export const listTasks = asyncHandler(
  async (req: Request, res: Response) => {
    logInfo("Task list request");
    logDebug("Task list payload", { role: req.user?.role, userId: req.user?.id });
    if (req.user?.role === "EMPLOYEE") {
      const tasks = await getTasksForUser(req.user.id);
      res.status(200).json(tasks);
      return;
    }
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  }
);

export const getTaskById = asyncHandler(
  async (req: Request, res: Response) => {
    const taskId = Number(req.params.id);
    if (Number.isNaN(taskId)) {
      throw new AppError("Invalid task id", 400);
    }
    logInfo("Task detail request");
    logDebug("Task detail payload", { taskId });
    const task = await getTaskDetail(taskId);
    res.status(200).json(task);
  }
);

export const updateTask = asyncHandler(
  async (req: Request, res: Response) => {
    const taskId = Number(req.params.id);
    if (Number.isNaN(taskId)) {
      throw new AppError("Invalid task id", 400);
    }
    logInfo("Task update request");
    logDebug("Task update payload", { taskId, body: req.body });
    if (req.user?.role === "EMPLOYEE") {
      const existing = await getTaskRecord(taskId);
      if (existing.assigned_to !== req.user.id) {
        throw new AppError("Forbidden", 403);
      }
      const { status } = req.body ?? {};
      if (!status || Object.keys(req.body ?? {}).length !== 1) {
        throw new AppError("Employees can only update status", 403);
      }
      const task = await updateExistingTask(taskId, { status });
      res.status(200).json(task);
      return;
    }

    const task = await updateExistingTask(taskId, req.body);
    res.status(200).json(task);
  }
);
