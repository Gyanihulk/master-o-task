import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../config/db";
import type { Task } from "../interfaces/Task";
import type { TaskWithAssignee } from "../interfaces/TaskWithAssignee";

export const createTask = async (
  title: string,
  description: string | null,
  assignedTo: number | null,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED",
  dueDate: string | null
): Promise<Task> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO tasks (title, description, assigned_to, status, due_date) VALUES (?, ?, ?, ?, ?)",
    [title, description, assignedTo, status, dueDate]
  );

  return (await getTaskById(result.insertId)) as Task;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, title, description, assigned_to, status, due_date FROM tasks WHERE id = ?",
    [id]
  );
  return (rows[0] as Task) ?? null;
};

export const getTaskDetailById = async (
  id: number
): Promise<TaskWithAssignee | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT t.id, t.title, t.description, t.assigned_to, t.status, t.due_date,
            u.name AS assigned_to_name, u.email AS assigned_to_email
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.id = ?`,
    [id]
  );
  return (rows[0] as TaskWithAssignee) ?? null;
};

export const listTasksWithAssignee = async (): Promise<TaskWithAssignee[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT t.id, t.title, t.description, t.assigned_to, t.status, t.due_date,
            u.name AS assigned_to_name, u.email AS assigned_to_email
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     ORDER BY t.due_date IS NULL, t.due_date ASC, t.id DESC`
  );
  return rows as TaskWithAssignee[];
};

export const listTasksByUserId = async (userId: number): Promise<Task[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, title, description, assigned_to, status, due_date FROM tasks WHERE assigned_to = ? ORDER BY due_date IS NULL, due_date ASC, id DESC",
    [userId]
  );
  return rows as Task[];
};

export const updateTask = async (
  id: number,
  updates: {
    title?: string;
    description?: string | null;
    assigned_to?: number | null;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    due_date?: string | null;
  }
): Promise<Task | null> => {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    values.push(updates.description);
  }
  if (updates.assigned_to !== undefined) {
    fields.push("assigned_to = ?");
    values.push(updates.assigned_to);
  }
  if (updates.status !== undefined) {
    fields.push("status = ?");
    values.push(updates.status);
  }
  if (updates.due_date !== undefined) {
    fields.push("due_date = ?");
    values.push(updates.due_date);
  }

  if (fields.length === 0) {
    return getTaskById(id);
  }

  await pool.execute(
    `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
    [...values, id]
  );

  return getTaskById(id);
};
