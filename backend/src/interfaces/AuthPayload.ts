export interface AuthPayload {
  id: number;
  role: "ADMIN" | "EMPLOYEE";
  email: string;
}
