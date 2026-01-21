export interface CreateTaskRequestDto {
  title: string;
  description?: string;
  assigned_to?: number | null;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  due_date?: string | null;
}

export interface UpdateTaskRequestDto {
  title?: string;
  description?: string | null;
  assigned_to?: number | null;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  due_date?: string | null;
}

export interface TaskResponseDto {
  id: number;
  title: string;
  description: string | null;
  assigned_to: number | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  due_date: string | null;
}

export interface TaskWithAssigneeResponseDto extends TaskResponseDto {
  assigned_to_name: string | null;
  assigned_to_email: string | null;
}
