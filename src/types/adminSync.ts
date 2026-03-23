import type { CarInput } from "./car";

export type SyncStatus = "pending" | "syncing" | "published" | "failed";

export type AdminSyncItem = {
  local_id: string;
  mode: "create" | "update";
  target_id?: string;
  payload: CarInput;
  image_data_urls?: string[];
  sync_status: SyncStatus;
  retry_count: number;
  last_error?: string;
  created_at: string;
};
