import type {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
} from "../dto/auth.dto";
import { request } from "./client";

export const login = (payload: LoginRequestDto) =>
  request<AuthResponseDto>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const register = (payload: RegisterRequestDto) =>
  request<AuthResponseDto>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
