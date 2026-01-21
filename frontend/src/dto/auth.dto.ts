import type { AuthUser } from "../interfaces/AuthUser";

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "EMPLOYEE";
}

export interface AuthResponseDto {
  token: string;
  user: AuthUser;
}
