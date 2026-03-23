import { createCar, updateCar } from "@/services/cars";
import { getQueue, patchQueue, removeFromQueue } from "./offlineQueue";
import { dataUrlToBlob } from "./image";

export async function processSyncQueue() {
  const queue = getQueue();
  for (const item of queue) {
    if (item.sync_status === "published") {
      continue;
    }
    try {
      patchQueue(item.local_id, { sync_status: "syncing", last_error: undefined });
      const imageBlobs = item.image_data_urls 
        ? item.image_data_urls.map(url => dataUrlToBlob(url)) 
        : [];
        
      if (item.mode === "create") {
        await createCar(item.payload, imageBlobs);
      } else if (item.mode === "update" && item.target_id) {
        await updateCar(item.target_id, item.payload, imageBlobs);
      }
      patchQueue(item.local_id, { sync_status: "published" });
      removeFromQueue(item.local_id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync failed";
      patchQueue(item.local_id, {
        sync_status: "failed",
        retry_count: item.retry_count + 1,
        last_error: message
      });
    }
  }
}
