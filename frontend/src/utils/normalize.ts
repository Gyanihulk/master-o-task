export const normalizeRole = (role: string): "ADMIN" | "EMPLOYEE" => {
  const normalized = role.toUpperCase();
  return normalized === "ADMIN" ? "ADMIN" : "EMPLOYEE";
};
