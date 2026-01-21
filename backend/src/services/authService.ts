import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { AuthResponseDto, LoginRequestDto, RegisterRequestDto } from "../dto/auth.dto";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { findUserByEmail, createUser } from "../models/userModel";
import { normalizeRole } from "../utils/normalize";
import { requireEmail, requireRole, requireString } from "../utils/validators";

const buildAuthResponse = (
  user: { id: number; name: string; email: string; role: string }
): AuthResponseDto => {
  const role = normalizeRole(user.role);
  const token = jwt.sign(
    { id: user.id, role, email: user.email },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
  return { token, user: { ...user, role } };
};

export const register = async (
  payload: RegisterRequestDto
): Promise<AuthResponseDto> => {
  const name = requireString(payload.name, "name");
  const email = requireEmail(payload.email);
  const password = requireString(payload.password, "password");
  const role = payload.role ? requireRole(payload.role) : "EMPLOYEE";

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, hashed, role);

  return buildAuthResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

export const login = async (
  payload: LoginRequestDto
): Promise<AuthResponseDto> => {
  const email = requireEmail(payload.email);
  const password = requireString(payload.password, "password");

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  return buildAuthResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};
