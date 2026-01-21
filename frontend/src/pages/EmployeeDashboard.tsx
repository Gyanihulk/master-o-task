import { useEffect, useMemo, useState } from "react";

import { getTasksByUser, updateTask } from "../api/tasks";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import type { Task } from "../interfaces/Task";

const statusOptions: Array<Task["status"]> = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
];

export const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTasksByUser(user.id);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") return tasks;
    return tasks.filter((task) => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const handleStatusChange = async (taskId: number, status: Task["status"]) => {
    setError(null);
    try {
      await updateTask(taskId, { status });
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
              Employee Dashboard
            </p>
            <h1 className="font-display mt-2 text-2xl text-white">
              Welcome {user?.name ?? "Employee"}
            </h1>
          </div>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Card
          title="Your tasks"
          description="Update progress as you move through each task."
          action={
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
              Filter
              <select
                className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-100"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>
          }
        >
          {loading ? (
            <p className="text-sm text-slate-400">Loading tasks...</p>
          ) : error ? (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-display text-lg text-slate-100">
                      {task.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {task.description || "No description"}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                      <StatusBadge status={task.status} />
                      <span>Due: {task.due_date ?? "—"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs uppercase tracking-widest text-slate-400">
                      Update status
                      <select
                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(
                            task.id,
                            event.target.value as Task["status"]
                          )
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};
