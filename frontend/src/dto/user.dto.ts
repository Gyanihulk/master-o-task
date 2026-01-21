export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
}
