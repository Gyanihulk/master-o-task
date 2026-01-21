import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../config/db";
import type { User } from "../interfaces/User";

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "EMPLOYEE"
): Promise<User> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );

  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, email, password, role FROM users WHERE id = ?",
    [result.insertId]
  );

  return rows[0] as User;
};

export const findUserByEmail = async (
  email: string
): Promise<User | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, email, password, role FROM users WHERE email = ?",
    [email]
  );
  return (rows[0] as User) ?? null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, email, password, role FROM users WHERE id = ?",
    [id]
  );
  return (rows[0] as User) ?? null;
};

export const listUsers = async (): Promise<User[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, email, password, role FROM users ORDER BY name ASC"
  );
  return rows as User[];
};

export const countAdmins = async (): Promise<number> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'"
  );
  return Number((rows[0] as { count: number }).count ?? 0);
};
