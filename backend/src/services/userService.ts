import bcrypt from "bcrypt";

import type { CreateEmployeeRequestDto, CreateEmployeeResponseDto } from "../dto/employee.dto";
import type { UserResponseDto } from "../dto/user.dto";
import { createUser, findUserByEmail, listUsers } from "../models/userModel";
import { AppError } from "../utils/AppError";
import { normalizeRole } from "../utils/normalize";
import { requireEmail, requireString } from "../utils/validators";
import { generatePassword } from "../utils/password";
import { logDebug, logInfo } from "../utils/logger";

export const getAllUsers = async (): Promise<UserResponseDto[]> => {
  logInfo("User list service");
  const users = await listUsers();
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
  }));
};

export const createEmployee = async (
  payload: CreateEmployeeRequestDto
): Promise<CreateEmployeeResponseDto> => {
  logInfo("Employee create service");
  logDebug("Employee create input", {
    name: payload.name,
    email: payload.email,
  });
  const name = requireString(payload.name, "name");
  const email = requireEmail(payload.email);
  const tempPassword = payload.password ?? generatePassword();

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const hashed = await bcrypt.hash(tempPassword, 10);
  const user = await createUser(name, email, hashed, "EMPLOYEE");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: "EMPLOYEE",
    tempPassword,
  };
};
