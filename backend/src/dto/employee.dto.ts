export interface CreateEmployeeRequestDto {
  name: string;
  email: string;
  password?: string;
}

export interface CreateEmployeeResponseDto {
  id: number;
  name: string;
  email: string;
  role: "EMPLOYEE";
  tempPassword: string;
}
