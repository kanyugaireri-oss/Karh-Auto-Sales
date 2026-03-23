export type Car = {
  id: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  offer_price: number;
  status: string;
  mileage: string;
  transmission: string;
  fuel_type: string;
  body_type: string;
  description: string;
  location: string;
  is_featured?: boolean;
  image_urls: string[];
  created_at: string;
  updated_at?: string;
};

export type CarInput = Omit<Car, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
