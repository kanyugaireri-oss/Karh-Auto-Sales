import type { AdminSyncItem } from "@/types/adminSync";
import { uid } from "./utils";

const QUEUE_KEY = "karh_admin_sync_queue";

export function getQueue(): AdminSyncItem[] {
  const raw = localStorage.getItem(QUEUE_KEY);
  if (!raw) {
    return [];
  }
  return JSON.parse(raw) as AdminSyncItem[];
}

export function saveQueue(items: AdminSyncItem[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export function enqueue(
  item: Omit<AdminSyncItem, "local_id" | "sync_status" | "retry_count" | "created_at">
) {
  const queue = getQueue();
  const entry: AdminSyncItem = {
    ...item,
    local_id: uid("sync"),
    sync_status: "pending",
    retry_count: 0,
    created_at: new Date().toISOString()
  };
  saveQueue([entry, ...queue]);
  return entry;
}

export function patchQueue(localId: string, patch: Partial<AdminSyncItem>) {
  const queue = getQueue();
  const updated = queue.map((item) =>
    item.local_id === localId ? { ...item, ...patch } : item
  );
  saveQueue(updated);
  return updated;
}

export function removeFromQueue(localId: string) {
  saveQueue(getQueue().filter((item) => item.local_id !== localId));
}
