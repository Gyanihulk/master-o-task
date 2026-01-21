import { cn } from "../utils/cn";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  IN_PROGRESS: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  COMPLETED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
};

export const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
      statusStyles[status] ?? "border-slate-600 text-slate-300"
    )}
  >
    {status.replace("_", " ")}
  </span>
);
