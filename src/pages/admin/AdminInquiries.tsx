import { listInquiries, updateInquiryStatus } from "@/services/inquiries";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

const statuses: InquiryStatus[] = ["new", "contacted", "closed"];

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await listInquiries();
      // Sort: 'new' always on top, then by newest date
      const sorted = [...data].sort((a, b) => {
        if (a.status === "new" && b.status !== "new") return -1;
        if (a.status !== "new" && b.status === "new") return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setItems(sorted);
      setError(null);
    } catch (loadError) {
      setItems([]);
      setError(loadError instanceof Error ? loadError.message : "Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string) {
    try {
      const client = getSupabaseClient();
      await client.from("inquiries").delete().eq("id", id);
      await load();
    } catch (err: any) {
      alert("Failed to delete inquiry.");
    }
  }

  useEffect(() => {
    load();
    
    // Listen for new inquiries while on the page
    const client = getSupabaseClient();
    const channels = client.channel('admin-inquiries-page')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inquiries' },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channels);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4f6ff0] border-r-transparent"></div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Inquiries</h3>
        <p className="mt-1 text-sm text-slate-500">Manage customer messages and leads.</p>
      </div>
      {error ? (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4">
        {items.map((inq) => {
          const isNew = inq.status === "new";
          return (
            <InquiryCard 
              key={inq.id} 
              inquiry={inq} 
              isNew={isNew} 
              onStatusChange={async (newStatus) => {
                setItems(current => current.map(item => 
                  item.id === inq.id ? { ...item, status: newStatus } : item
                ).sort((a, b) => {
                  if (a.status === "new" && b.status !== "new") return -1;
                  if (a.status !== "new" && b.status === "new") return 1;
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }));
                await updateInquiryStatus(inq.id, newStatus);
              }}
              onDelete={() => deleteItem(inq.id)}
            />
          );
        })}
      </div>
      {!items.length ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-slate-500 font-medium">No inquiries yet.</p>
          <p className="text-sm text-slate-400 mt-1">When customers contact you, they will appear here.</p>
        </div>
      ) : null}
    </section>
  );
}

function InquiryCard({ 
  inquiry, 
  isNew, 
  onStatusChange, 
  onDelete 
}: { 
  inquiry: Inquiry, 
  isNew: boolean, 
  onStatusChange: (s: InquiryStatus) => Promise<void>,
  onDelete: () => Promise<void>
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <article 
      className={`relative rounded-2xl border p-5 transition-all ${
        isNew 
          ? "border-[#4f6ff0]/30 bg-[#f8f9ff] shadow-sm"
          : "border-slate-200 bg-white opacity-80"
      }`}
    >
      {isNew && (
        <span className="absolute top-5 right-5 flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></span>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1 pr-6 flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-400">
            {new Date(inquiry.created_at).toLocaleString()}
            <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">
              {inquiry.source.replace("_", " ")}
            </span>
          </p>
          <p className="font-semibold text-slate-900 text-lg">{inquiry.phone}</p>
          <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed bg-white/50 p-3 rounded-xl border border-slate-100/50">
            {inquiry.message}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0 pt-2 sm:pt-0">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium hidden sm:inline">Status:</span>
              <select
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium outline-none transition-colors ${
                  isNew 
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : inquiry.status === 'contacted'
                      ? "border-amber-200 bg-amber-50 text-amber-700" 
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
                value={inquiry.status}
                onChange={(e) => onStatusChange(e.target.value as InquiryStatus)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            {!showConfirm && (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                title="Delete Inquiry"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          {showConfirm && (
            <div className="flex items-center animate-in fade-in slide-in-from-right-4 gap-2 bg-rose-50 border border-rose-200 rounded-lg p-1.5">
              <span className="text-xs font-semibold text-rose-600 px-2">Delete?</span>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  await onDelete();
                }}
                className="px-3 py-1 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-md transition disabled:opacity-50"
              >
                {isDeleting ? "..." : "Confirm"}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
