import { dataUrlToBlob } from "@/lib/image";
import { getSupabaseClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { Car, CarInput } from "@/types/car";

async function uploadImage(
  blobOrFile: Blob | File | null,
  fallbackDataUrl?: string
): Promise<string> {
  if (!blobOrFile && fallbackDataUrl) {
    blobOrFile = dataUrlToBlob(fallbackDataUrl);
  }

  if (!blobOrFile) {
    return fallbackDataUrl || ""; // If it was already a valid URL, just return it
  }

  const client = getSupabaseClient();
  const fileName = `car-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const { error } = await client.storage
    .from("car-images")
    .upload(fileName, blobOrFile, {
      cacheControl: "3600",
      upsert: true,
      contentType: "image/jpeg"
    });
  if (error) {
    throw new Error(error.message);
  }
  const { data } = client.storage.from("car-images").getPublicUrl(fileName);
  return data.publicUrl;
}

async function uploadMultipleImages(
  files: (Blob | File | string)[]
): Promise<string[]> {
  const uploadPromises = files.map(async (item) => {
    // If it's already a full http/https URL from an existing database entry, keep it untouched
    if (typeof item === 'string') {
      if (item.startsWith('http')) {
        return item;
      }
      if (item.startsWith('data:')) {
        return await uploadImage(null, item);
      }
      return "";
    }
    
    // If it's a raw File or Blob (we checked type string above, so here it's an object)
    if (item && typeof item === 'object') {
      return await uploadImage(item as Blob);
    }
    
    return "";
  });

  const results = await Promise.all(uploadPromises);
  return results.filter(url => url !== ""); // Remove any failed empty strings
}

export async function listCars(): Promise<Car[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data as Car[];
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const cars = await listCars();
  return cars.find((car) => car.slug === slug) ?? null;
}

export async function createCar(
  payload: CarInput,
  images: (Blob | File | string)[] = []
): Promise<Car> {
  // Use payload.image_urls if provided directly, otherwise upload the new images 
  let finalUrls = payload.image_urls || [];
  if (images.length > 0) {
    finalUrls = await uploadMultipleImages(images);
  }

  const entry: Partial<Car> = {
    id: payload.id,
    slug: payload.slug || slugify(payload.title),
    title: payload.title,
    make: payload.make,
    model: payload.model,
    year: payload.year,
    price: payload.price,
    offer_price: payload.offer_price,
    status: payload.status,
    mileage: payload.mileage,
    transmission: payload.transmission,
    fuel_type: payload.fuel_type,
    body_type: payload.body_type,
    description: payload.description,
    location: payload.location,
    is_featured: Boolean(payload.is_featured),
    image_urls: finalUrls,
    updated_at: new Date().toISOString()
  };

  const client = getSupabaseClient();
  const { data, error } = await client.from("cars").insert(entry).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return data as Car;
}

export async function updateCar(
  id: string,
  payload: Partial<CarInput>,
  images?: (Blob | File | string)[]
): Promise<Car> {
  const patch = { ...payload } as Partial<Car>;
  
  if (images && images.length > 0) {
    patch.image_urls = await uploadMultipleImages(images);
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from("cars")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data as Car;
}

export async function deleteCar(id: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from("cars").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}
