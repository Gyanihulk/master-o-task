import type { User } from "../interfaces/User";
import { request } from "./client";

export const getUsers = () => request<User[]>("/users");

export const createEmployee = (payload: { name: string; email: string }) =>
  request<{
    id: number;
    name: string;
    email: string;
    role: "EMPLOYEE";
    tempPassword: string;
  }>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
