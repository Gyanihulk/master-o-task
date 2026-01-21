export const normalizeRole = (role: string): "ADMIN" | "EMPLOYEE" => {
  const normalized = role.toUpperCase();
  return normalized === "ADMIN" ? "ADMIN" : "EMPLOYEE";
};

export const normalizeStatus = (
  status: string
): "PENDING" | "IN_PROGRESS" | "COMPLETED" => {
  const normalized = status.toUpperCase();
  if (normalized === "IN_PROGRESS") return "IN_PROGRESS";
  if (normalized === "COMPLETED") return "COMPLETED";
  return "PENDING";
};
