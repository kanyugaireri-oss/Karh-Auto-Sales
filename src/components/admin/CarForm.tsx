import { compressImage, fileToDataUrl } from "@/lib/image";
import { enqueue } from "@/lib/offlineQueue";
import { createCar, updateCar } from "@/services/cars";
import { slugify } from "@/lib/utils";
import type { Car, CarInput } from "@/types/car";
import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

type CarFormProps = {
  mode: "create" | "edit";
  initial?: Car | null;
};

export function CarForm({ mode, initial }: CarFormProps) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  // existing urls from the database
  const [existingUrls, setExistingUrls] = useState<string[]>(initial?.image_urls || []);
  // new raw files queued for upload
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [form, setForm] = useState<CarInput>({
    id: initial?.id,
    title: initial?.title || "",
    make: initial?.make || "",
    model: initial?.model || "",
    slug: initial?.slug || "",
    year: initial?.year || new Date().getFullYear(),
    mileage: initial?.mileage || "",
    transmission: initial?.transmission || "Automatic",
    fuel_type: initial?.fuel_type || "Petrol",
    body_type: initial?.body_type || "",
    description: initial?.description || "",
    location: initial?.location || "",
    status: initial?.status || "available",
    is_featured: initial?.is_featured || false,
    price: initial?.price || 0,
    offer_price: initial?.offer_price || 0,
    image_urls: initial?.image_urls || []
  });

  const canSubmit = useMemo(
    () =>
      Boolean(
        form.title &&
          form.make &&
          form.model &&
          form.year &&
          form.mileage &&
          form.transmission &&
          form.fuel_type &&
          form.body_type &&
          form.description &&
          form.location &&
          form.price > 0 &&
          (existingUrls.length > 0 || newFiles.length > 0)
      ),
    [form, existingUrls, newFiles]
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!canSubmit) {
      if (existingUrls.length === 0 && newFiles.length === 0) {
        setError("Please add at least one image.");
      }
      return;
    }

    setSaving(true);
    setError(null);

    const payload: CarInput = {
      ...form,
      slug: form.slug || slugify(form.title)
    };

    try {
      if (!navigator.onLine) {
        // Offline now supports multi-image upload queue
        const compressedDataUrls = await Promise.all(
          newFiles.map(async (file) => fileToDataUrl(await compressImage(file)))
        );
        enqueue({
          mode: mode === "create" ? "create" : "update",
          target_id: initial?.id,
          payload,
          image_data_urls: compressedDataUrls
        });
        localStorage.setItem("karh_admin_last_draft", JSON.stringify(payload));
        navigate("/admin/cars?queued=1");
        return;
      }

      // Combine existing string URLs with new compressed File objects
      const compressedNewFiles = await Promise.all(newFiles.map((file) => compressImage(file)));
      const combinedImages: (string | Blob)[] = [...existingUrls, ...compressedNewFiles];

      if (mode === "create") {
        await createCar(payload, combinedImages);
      } else if (initial) {
        await updateCar(initial.id, payload, combinedImages);
      }
      navigate("/admin/cars?published=1");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save car");
    } finally {
      setSaving(false);
    }
  }

  const removeExistingUrl = (index: number) => {
    setExistingUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Pre-generate object URLs to avoid infinite re-renders
  const newFilePreviews = useMemo(() => {
    return newFiles.map(file => URL.createObjectURL(file));
  }, [newFiles]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-slate-200 bg-[#f8f8fc] p-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {mode === "create" ? "Add New Car" : "Edit Car"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">Update inventory details and publish instantly.</p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <label className="field">
          <span className="text-slate-900 font-medium">
            Car Title {submitAttempted && !form.title && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Make {submitAttempted && !form.make && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.make}
            onChange={(e) => setForm((prev) => ({ ...prev, make: e.target.value }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Model {submitAttempted && !form.model && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.model}
            onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Year {submitAttempted && !form.year && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            type="number"
            value={form.year}
            onChange={(e) => setForm((prev) => ({ ...prev, year: Number(e.target.value) }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Price (KES) {submitAttempted && form.price <= 0 && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            type="number"
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">Offer Price (KES, optional)</span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            type="number"
            value={form.offer_price}
            onChange={(e) => setForm((prev) => ({ ...prev, offer_price: Number(e.target.value) }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Mileage {submitAttempted && !form.mileage && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.mileage}
            onChange={(e) => setForm((prev) => ({ ...prev, mileage: e.target.value }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Transmission {submitAttempted && !form.transmission && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.transmission}
            onChange={(e) => setForm((prev) => ({ ...prev, transmission: e.target.value }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Fuel Type {submitAttempted && !form.fuel_type && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.fuel_type}
            onChange={(e) => setForm((prev) => ({ ...prev, fuel_type: e.target.value }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Body Type {submitAttempted && !form.body_type && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.body_type}
            onChange={(e) => setForm((prev) => ({ ...prev, body_type: e.target.value }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Location {submitAttempted && !form.location && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
          />
        </label>
        <label className="field">
          <span className="text-slate-900 font-medium">
            Status {submitAttempted && !form.status && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <select
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
        </label>
        <label className="field md:col-span-2">
          <span className="text-slate-900 font-medium">
            Description {submitAttempted && !form.description && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <textarea
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 min-h-[100px]"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </label>
        <label className="field md:col-span-2">
          <span className="text-slate-900 font-medium">Slug (optional)</span>
          <input
            className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          />
          <p className="mt-1 text-xs text-slate-500">
            This is used for the URL (e.g. /cars/your-slug). Leave blank to auto-generate from the title.
          </p>
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
          <input
            type="checkbox"
            checked={Boolean(form.is_featured)}
            onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
          />
          Featured
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label className="field">
          <span className="text-slate-900 font-medium">
            Car Images {submitAttempted && existingUrls.length === 0 && newFiles.length === 0 && <span className="ml-1 text-xs text-rose-500">* Required</span>}
          </span>
          <p className="text-xs text-slate-500 mb-2">Select multiple images at once. The first image shown here will be the main display cover for the car.</p>
          <input
            className="border-slate-200 bg-white text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-[#4f6ff0] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setNewFiles(prev => [...prev, ...Array.from(e.target.files!)]);
              }
              // Reset input so selecting the same file again triggers onChange
              e.target.value = '';
            }}
          />
        </label>
        
        {(existingUrls.length > 0 || newFiles.length > 0) && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {existingUrls.map((url, i) => (
              <div key={`existing-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                <img src={url} alt={`Existing image ${i+1}`} className="h-full w-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeExistingUrl(i)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-rose-500 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
                {i === 0 && <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">COVER</span>}
              </div>
            ))}
            {newFilePreviews.map((preview, j) => (
              <div key={`new-${j}`} className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-[#4f6ff0]/50 p-1">
                <img src={preview} alt={`New upload preview ${j+1}`} className="h-full w-full rounded-md object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeNewFile(j)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-rose-500 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
                {existingUrls.length === 0 && j === 0 && <span className="absolute bottom-2 left-2 rounded bg-[#4f6ff0] px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">NEW COVER</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? <p className="text-sm rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-rose-600 font-medium">{error}</p> : null}

      <button
        disabled={saving}
        type="submit"
        className="w-full rounded-xl bg-[#4f6ff0] px-4 py-3 text-base font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving..." : mode === "create" ? "Add the Car" : "Save Changes"}
      </button>
    </form>
  );
}
