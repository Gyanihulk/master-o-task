import type {
  CreateTaskRequestDto,
  TaskResponseDto,
  TaskWithAssigneeResponseDto,
  UpdateTaskRequestDto,
} from "../dto/task.dto";
import { AppError } from "../utils/AppError";
import { normalizeStatus } from "../utils/normalize";
import {
  optionalNumber,
  optionalString,
  requireStatus,
  requireString,
} from "../utils/validators";
import {
  createTask,
  getTaskById,
  getTaskDetailById,
  listTasksByUserId,
  listTasksWithAssignee,
  updateTask,
} from "../models/taskModel";
import { findUserById } from "../models/userModel";

export const createNewTask = async (
  payload: CreateTaskRequestDto
): Promise<TaskResponseDto> => {
  const title = requireString(payload.title, "title");
  const description = optionalString(payload.description) ?? null;
  const assignedTo = optionalNumber(payload.assigned_to) ?? null;
  const status = payload.status ? requireStatus(payload.status) : "PENDING";
  const dueDate = optionalString(payload.due_date) ?? null;

  if (assignedTo !== null) {
    const user = await findUserById(assignedTo);
    if (!user) {
      throw new AppError("Assigned user not found", 404);
    }
  }

  const task = await createTask(
    title,
    description,
    assignedTo,
    status,
    dueDate
  );

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    assigned_to: task.assigned_to,
    status: normalizeStatus(task.status),
    due_date: task.due_date,
  };
};

export const getAllTasks = async (): Promise<TaskWithAssigneeResponseDto[]> => {
  const tasks = await listTasksWithAssignee();
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    assigned_to: task.assigned_to,
    status: normalizeStatus(task.status),
    due_date: task.due_date,
    assigned_to_name: task.assigned_to_name,
    assigned_to_email: task.assigned_to_email,
  }));
};

export const getTaskDetail = async (
  id: number
): Promise<TaskWithAssigneeResponseDto> => {
  const task = await getTaskDetailById(id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    assigned_to: task.assigned_to,
    status: normalizeStatus(task.status),
    due_date: task.due_date,
    assigned_to_name: task.assigned_to_name,
    assigned_to_email: task.assigned_to_email,
  };
};

export const updateExistingTask = async (
  id: number,
  payload: UpdateTaskRequestDto
): Promise<TaskResponseDto> => {
  const updates: UpdateTaskRequestDto = {};

  if (payload.title !== undefined) {
    updates.title = requireString(payload.title, "title");
  }
  if (payload.description !== undefined) {
    updates.description = optionalString(payload.description) ?? null;
  }
  if (payload.assigned_to !== undefined) {
    updates.assigned_to = optionalNumber(payload.assigned_to) ?? null;
    if (updates.assigned_to !== null) {
      const user = await findUserById(updates.assigned_to);
      if (!user) {
        throw new AppError("Assigned user not found", 404);
      }
    }
  }
  if (payload.status !== undefined) {
    updates.status = requireStatus(payload.status);
  }
  if (payload.due_date !== undefined) {
    updates.due_date = optionalString(payload.due_date) ?? null;
  }

  const updated = await updateTask(id, updates);
  if (!updated) {
    throw new AppError("Task not found", 404);
  }

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    assigned_to: updated.assigned_to,
    status: normalizeStatus(updated.status),
    due_date: updated.due_date,
  };
};

export const getTasksForUser = async (
  userId: number
): Promise<TaskResponseDto[]> => {
  const tasks = await listTasksByUserId(userId);
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    assigned_to: task.assigned_to,
    status: normalizeStatus(task.status),
    due_date: task.due_date,
  }));
};

export const getTaskRecord = async (id: number) => {
  const task = await getTaskById(id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  return task;
};
