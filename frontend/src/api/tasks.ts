import type { CreateTaskRequestDto, UpdateTaskRequestDto } from "../dto/task.dto";
import type { Task } from "../interfaces/Task";
import { request } from "./client";

export const createTask = (payload: CreateTaskRequestDto) =>
  request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getTasks = () => request<Task[]>("/tasks");

export const getTask = (id: number) => request<Task>(`/tasks/${id}`);

export const updateTask = (id: number, payload: UpdateTaskRequestDto) =>
  request<Task>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const getTasksByUser = (id: number) =>
  request<Task[]>(`/users/${id}/tasks`);
