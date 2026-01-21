export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "EMPLOYEE";
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "EMPLOYEE";
  };
}
