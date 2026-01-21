import { AppError } from "./AppError";

export const requireString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(`${field} is required`, 400);
  }
  return value.trim();
};

export const requireEmail = (value: unknown): string => {
  const email = requireString(value, "email");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new AppError("email is invalid", 400);
  }
  return email.toLowerCase();
};

export const optionalString = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new AppError("value must be a string", 400);
  }
  return value.trim();
};

export const optionalNumber = (value: unknown): number | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new AppError("value must be a number", 400);
  }
  return num;
};

export const requireRole = (value: unknown): "ADMIN" | "EMPLOYEE" => {
  if (value !== "ADMIN" && value !== "EMPLOYEE") {
    throw new AppError("role must be ADMIN or EMPLOYEE", 400);
  }
  return value;
};

export const requireStatus = (
  value: unknown
): "PENDING" | "IN_PROGRESS" | "COMPLETED" => {
  if (value !== "PENDING" && value !== "IN_PROGRESS" && value !== "COMPLETED") {
    throw new AppError(
      "status must be PENDING, IN_PROGRESS, or COMPLETED",
      400
    );
  }
  return value;
};
