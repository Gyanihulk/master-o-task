import { useEffect, useMemo, useState } from "react";

import { createTask, getTasks, updateTask } from "../api/tasks";
import { createEmployee, getUsers } from "../api/users";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import type { CreateTaskRequestDto, UpdateTaskRequestDto } from "../dto/task.dto";
import type { Task } from "../interfaces/Task";
import type { User } from "../interfaces/User";

const statusOptions: Array<Task["status"]> = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
];

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"tasks" | "employees">("tasks");
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const [createdEmployee, setCreatedEmployee] = useState<{
    name: string;
    email: string;
    tempPassword: string;
  } | null>(null);

  const [createForm, setCreateForm] = useState<CreateTaskRequestDto>({
    title: "",
    description: "",
    assigned_to: null,
    status: "PENDING",
    due_date: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateTaskRequestDto>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, tasksData] = await Promise.all([getUsers(), getTasks()]);
      setUsers(usersData.filter((person) => person.role === "EMPLOYEE"));
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") return tasks;
    return tasks.filter((task) => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const handleCreateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await createTask({
        title: createForm.title,
        description: createForm.description || undefined,
        assigned_to: createForm.assigned_to ? Number(createForm.assigned_to) : null,
        status: createForm.status,
        due_date: createForm.due_date || null,
      });
      setCreateForm({
        title: "",
        description: "",
        assigned_to: null,
        status: "PENDING",
        due_date: "",
      });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Task creation failed");
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description ?? "",
      assigned_to: task.assigned_to,
      status: task.status,
      due_date: task.due_date ?? "",
    });
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingId) return;
    setError(null);
    try {
      await updateTask(editingId, {
        title: editForm.title,
        description: editForm.description ?? null,
        assigned_to:
          editForm.assigned_to === undefined
            ? undefined
            : editForm.assigned_to
            ? Number(editForm.assigned_to)
            : null,
        status: editForm.status,
        due_date: editForm.due_date ?? null,
      });
      setEditingId(null);
      setEditForm({});
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
  });

  const handleCreateEmployee = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmployeeError(null);
    setCreatedEmployee(null);
    try {
      const data = await createEmployee(employeeForm);
      setEmployeeForm({ name: "", email: "" });
      setCreatedEmployee({
        name: data.name,
        email: data.email,
        tempPassword: data.tempPassword,
      });
      await fetchData();
    } catch (err) {
      setEmployeeError(
        err instanceof Error ? err.message : "Employee creation failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
              Admin Dashboard
            </p>
            <h1 className="font-display mt-2 text-2xl text-white">
              Hello {user?.name ?? "Admin"}
            </h1>
          </div>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap gap-3">
          <Button
            variant={activeTab === "tasks" ? "primary" : "ghost"}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </Button>
          <Button
            variant={activeTab === "employees" ? "primary" : "ghost"}
            onClick={() => setActiveTab("employees")}
          >
            Employees
          </Button>
        </div>

        <div className="mt-6 space-y-6">
          {activeTab === "tasks" && (
            <>
              <Card
                title="All tasks"
                description="Track statuses and assignments."
                action={
                  <div className="flex flex-wrap items-center gap-3">
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
                    <Button
                      variant="outline"
                      onClick={() => setShowTaskForm((prev) => !prev)}
                    >
                      {showTaskForm ? "Hide form" : "Create task"}
                    </Button>
                  </div>
                }
              >
                {loading ? (
                  <p className="text-sm text-slate-400">Loading tasks...</p>
                ) : error ? (
                  <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                    {error}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs uppercase tracking-widest text-slate-400">
                        <tr>
                          <th className="pb-3">Title</th>
                          <th className="pb-3">Assigned to</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Due</th>
                          <th className="pb-3">Edit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredTasks.map((task) => (
                          <tr key={task.id} className="text-slate-200">
                            <td className="py-3">
                              <div className="font-medium text-slate-100">
                                {task.title}
                              </div>
                              <div className="text-xs text-slate-400">
                                {task.description || "No description"}
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="text-sm text-slate-100">
                                {task.assigned_to_name ?? "Unassigned"}
                              </div>
                              <div className="text-xs text-slate-500">
                                {task.assigned_to_email ?? ""}
                              </div>
                            </td>
                            <td className="py-3">
                              <StatusBadge status={task.status} />
                            </td>
                            <td className="py-3 text-sm text-slate-300">
                              {task.due_date ? task.due_date : "—"}
                            </td>
                            <td className="py-3">
                              <Button
                                variant="ghost"
                                onClick={() => startEdit(task)}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              {showTaskForm && (
                <Card
                  title="Create a new task"
                  description="Assign tasks to employees and set deadlines."
                >
                  <form className="space-y-4" onSubmit={handleCreateSubmit}>
                    <Input
                      label="Title"
                      value={createForm.title}
                      onChange={(event) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                      placeholder="Customer onboarding follow-up"
                      required
                    />
                    <Input
                      label="Description"
                      value={createForm.description ?? ""}
                      onChange={(event) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Clarify deliverables and timeline"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm text-slate-200">
                        <span className="text-xs uppercase tracking-wide">
                          Assign to
                        </span>
                        <select
                          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                          value={createForm.assigned_to ?? ""}
                          onChange={(event) =>
                            setCreateForm((prev) => ({
                              ...prev,
                              assigned_to: event.target.value
                                ? Number(event.target.value)
                                : null,
                            }))
                          }
                        >
                          <option value="">Unassigned</option>
                          {users.map((person) => (
                            <option key={person.id} value={person.id}>
                              {person.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-2 text-sm text-slate-200">
                        <span className="text-xs uppercase tracking-wide">
                          Status
                        </span>
                        <select
                          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                          value={createForm.status}
                          onChange={(event) =>
                            setCreateForm((prev) => ({
                              ...prev,
                              status: event.target.value as Task["status"],
                            }))
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
                    <Input
                      label="Due date"
                      type="date"
                      value={createForm.due_date ?? ""}
                      onChange={(event) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          due_date: event.target.value,
                        }))
                      }
                    />
                    <Button type="submit">Create task</Button>
                  </form>
                </Card>
              )}

              {editingId && (
                <Card
                  title="Edit task"
                  description="Update task details or reassign."
                  action={
                    <Button variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  }
                >
                  <form className="space-y-4" onSubmit={handleEditSubmit}>
                    <Input
                      label="Title"
                      value={editForm.title ?? ""}
                      onChange={(event) =>
                        setEditForm((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Description"
                      value={editForm.description ?? ""}
                      onChange={(event) =>
                        setEditForm((prev) => ({
                          ...prev,
                          description: event.target.value,
                        }))
                      }
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm text-slate-200">
                        <span className="text-xs uppercase tracking-wide">
                          Assign to
                        </span>
                        <select
                          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                          value={editForm.assigned_to ?? ""}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              assigned_to: event.target.value
                                ? Number(event.target.value)
                                : null,
                            }))
                          }
                        >
                          <option value="">Unassigned</option>
                          {users.map((person) => (
                            <option key={person.id} value={person.id}>
                              {person.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-2 text-sm text-slate-200">
                        <span className="text-xs uppercase tracking-wide">
                          Status
                        </span>
                        <select
                          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                          value={editForm.status ?? "PENDING"}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              status: event.target.value as Task["status"],
                            }))
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
                    <Input
                      label="Due date"
                      type="date"
                      value={editForm.due_date ?? ""}
                      onChange={(event) =>
                        setEditForm((prev) => ({
                          ...prev,
                          due_date: event.target.value,
                        }))
                      }
                    />
                    <Button type="submit">Save changes</Button>
                  </form>
                </Card>
              )}
            </>
          )}

          {activeTab === "employees" && (
            <>
              <Card
                title="Employees"
                description="Track and onboard employees."
                action={
                  <Button
                    variant="outline"
                    onClick={() => setShowEmployeeForm((prev) => !prev)}
                  >
                    {showEmployeeForm ? "Hide form" : "Create employee"}
                  </Button>
                }
              >
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/60 text-xs uppercase tracking-widest text-slate-400">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {users.map((person) => (
                        <tr key={person.id}>
                          <td className="px-4 py-3 text-slate-100">
                            {person.name}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {person.email}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td
                            className="px-4 py-4 text-sm text-slate-400"
                            colSpan={2}
                          >
                            No employees yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {showEmployeeForm && (
                <Card title="Create employee" description="Generate a login.">
                  <form className="space-y-3" onSubmit={handleCreateEmployee}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        label="Employee name"
                        value={employeeForm.name}
                        onChange={(event) =>
                          setEmployeeForm((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        required
                      />
                      <Input
                        label="Employee email"
                        type="email"
                        value={employeeForm.email}
                        onChange={(event) =>
                          setEmployeeForm((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    {employeeError && (
                      <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                        {employeeError}
                      </p>
                    )}
                    {createdEmployee && (
                      <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                        Created {createdEmployee.name}. Temp password:{" "}
                        <span className="font-semibold">
                          {createdEmployee.tempPassword}
                        </span>
                      </p>
                    )}
                    <Button type="submit">
                      Create employee + generate password
                    </Button>
                    <p className="text-xs text-slate-400">
                      Passwords are generated automatically when creating an
                      employee.
                    </p>
                  </form>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
