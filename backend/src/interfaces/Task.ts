export interface Task {
  id: number;
  title: string;
  description: string | null;
  assigned_to: number | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  due_date: string | null;
}
