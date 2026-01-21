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
