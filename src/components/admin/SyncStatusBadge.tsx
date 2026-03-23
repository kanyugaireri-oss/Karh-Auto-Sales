import type { SyncStatus } from "@/types/adminSync";

const map: Record<SyncStatus, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  syncing: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  published: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  failed: "bg-rose-500/20 text-rose-300 border-rose-400/30"
};

export function SyncStatusBadge({ status }: { status: SyncStatus }) {
  return (
    <span className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase ${map[status]}`}>
      {status}
    </span>
  );
}
