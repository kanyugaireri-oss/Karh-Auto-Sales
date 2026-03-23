import { SyncStatusBadge } from "@/components/admin/SyncStatusBadge";
import { getQueue } from "@/lib/offlineQueue";
import { processSyncQueue } from "@/lib/sync";
import { deleteCar, listCars } from "@/services/cars";
import type { Car } from "@/types/car";
import type { AdminSyncItem } from "@/types/adminSync";
import { ArrowUpDown, PenLine, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAdminStore } from "@/store/adminSearch";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [queue, setQueue] = useState<AdminSyncItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const { searchQuery: search } = useAdminStore();
  const [sortBy, setSortBy] = useState<"title" | "year" | "price">("title");
  const [page, setPage] = useState(1);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const wasQueued = params.get("queued");
  const wasPublished = params.get("published");
  const isOnline = typeof navigator === "undefined" ? true : navigator.onLine;

  async function load() {
    setLoading(true);
    try {
      const [allCars] = await Promise.all([listCars()]);
      setCars(allCars);
      setQueue(getQueue());
      setError(null);
    } catch (loadError) {
      setCars([]);
      setQueue(getQueue());
      setError(loadError instanceof Error ? loadError.message : "Failed to load cars.");
    } finally {
      setLoading(false);
    }
  }

  async function syncNow() {
    setSyncing(true);
    await processSyncQueue();
    await load();
    setSyncing(false);
  }

  const filteredCars = useMemo(() => {
    const q = search.trim().toLowerCase();
    const next = cars.filter((car) => {
      if (!q) return true;
      return [car.title, car.fuel_type, car.transmission, String(car.year)].join(" ").toLowerCase().includes(q);
    });

    return next.sort((a, b) => {
      if (sortBy === "price") return b.price - a.price;
      if (sortBy === "year") return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
  }, [cars, search, sortBy]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCars = filteredCars.slice(startIndex, startIndex + pageSize);

  const pageButtons = useMemo(() => {
    const items: Array<number | "..."> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) items.push(i);
      return items;
    }
    items.push(1);
    if (currentPage > 3) items.push("...");
    const low = Math.max(2, currentPage - 1);
    const high = Math.min(totalPages - 1, currentPage + 1);
    for (let i = low; i <= high; i += 1) items.push(i);
    if (currentPage < totalPages - 2) items.push("...");
    items.push(totalPages);
    return items;
  }, [currentPage, totalPages]);

  useEffect(() => {
    load();
    const onlineListener = () => {
      processSyncQueue().then(load);
    };
    window.addEventListener("online", onlineListener);
    return () => window.removeEventListener("online", onlineListener);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);


  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Products</h3>
          <p className="text-sm text-slate-500">Manage your live inventory and publishing queue.</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={syncNow}
            disabled={syncing || !isOnline}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
          >
            <RefreshCcw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync"}
          </button>
          <Link
            to="/admin/cars/new"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#4f6ff0] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(79,111,240,0.3)] sm:flex-none"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {wasQueued ? (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Car queued offline. It will auto-publish when online.
        </p>
      ) : null}
      {wasPublished ? (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Car published successfully.
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-[#f8f8fc] p-3">
        <div>
          <p className="text-sm text-slate-700">
            Sync Queue: <strong>{queue.length}</strong>
          </p>
          {!isOnline ? (
            <p className="text-xs text-amber-600">Offline mode: submissions are queued.</p>
          ) : null}
        </div>
        <p className="text-xs text-slate-500">Queued tasks auto-sync when the device reconnects.</p>
      </div>

      {queue.length ? (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-[#f8f8fc] p-3">
          {queue.map((item) => (
            <div key={item.local_id} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{item.payload.title}</span>
              <SyncStatusBadge status={item.sync_status} />
            </div>
          ))}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-end gap-2 border-b border-slate-200 p-3">
          <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <ArrowUpDown size={14} />
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "title" | "year" | "price")}
              className="bg-transparent text-sm text-slate-700 outline-none"
            >
              <option value="title">Title</option>
              <option value="year">Year</option>
              <option value="price">Price</option>
            </select>
          </label>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {paginatedCars.map((car) => (
            <article key={`mobile-${car.id}`} className="p-4">
              <div className="flex items-center gap-3">
                <img src={car.image_urls?.[0]} alt={car.title} className="h-16 w-24 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{car.title}</p>
                  <p className="text-xs text-slate-500">
                    {car.year} • {car.transmission} • {car.mileage}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    KES {new Intl.NumberFormat().format(car.price)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                    car.is_featured ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                  ].join(" ")}
                >
                  {car.is_featured ? "Active" : "Draft"}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/cars/${car.id}/edit`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                    aria-label={`Edit ${car.title}`}
                  >
                    <PenLine size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteCar(car.id);
                      await load();
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                    aria-label={`Delete ${car.title}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f4f5fb] text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCars.map((car) => (
                <tr key={car.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={car.image_urls?.[0]} alt={car.title} className="h-10 w-14 rounded object-cover" />
                      <div>
                        <p className="font-medium text-slate-900">{car.title}</p>
                        <p className="text-xs text-slate-500">{car.mileage}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{car.transmission}</td>
                  <td className="px-4 py-3 text-slate-600">{car.year}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {car.offer_price > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-400 line-through decoration-double decoration-2 -mb-0.5">KES {new Intl.NumberFormat().format(car.price)}</span>
                        <span>KES {new Intl.NumberFormat().format(car.offer_price)}</span>
                      </div>
                    ) : (
                      <span>KES {new Intl.NumberFormat().format(car.price)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        car.is_featured
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      ].join(" ")}
                    >
                      {car.is_featured ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/cars/${car.id}/edit`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                        aria-label={`Edit ${car.title}`}
                      >
                        <PenLine size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteCar(car.id);
                          await load();
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                        aria-label={`Delete ${car.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filteredCars.length ? (
          <p className="border-t border-slate-100 px-4 py-5 text-sm text-slate-500">No cars found.</p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <p>
            Showing {filteredCars.length ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, filteredCars.length)} of{" "}
            {filteredCars.length} entries
          </p>
          <div className="flex items-center gap-1.5 text-sm">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 disabled:opacity-50"
            >
              Prev
            </button>
            {pageButtons.map((item, index) =>
              item === "..." ? (
                <span key={`ellipsis-${index}`} className="px-1 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPage(item)}
                  className={[
                    "rounded-md border px-2.5 py-1 text-xs",
                    item === currentPage
                      ? "border-[#4f6ff0] bg-[#4f6ff0] text-white"
                      : "border-slate-200 text-slate-600"
                  ].join(" ")}
                >
                  {item}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
