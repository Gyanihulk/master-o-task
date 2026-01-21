export interface TaskWithAssignee {
  id: number;
  title: string;
  description: string | null;
  assigned_to: number | null;
  assigned_to_name: string | null;
  assigned_to_email: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  due_date: string | null;
}
