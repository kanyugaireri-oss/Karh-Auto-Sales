import { CarForm } from "@/components/admin/CarForm";
import { listCars } from "@/services/cars";
import type { Car } from "@/types/car";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminCarEditPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Missing car id.");
      return;
    }
    setLoading(true);
    listCars()
      .then((all) => {
        setCar(all.find((item) => item.id === id) || null);
        setError(null);
      })
      .catch((loadError) => {
        setCar(null);
        setError(loadError instanceof Error ? loadError.message : "Failed to load car.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-slate-500">Loading car...</p>;
  }

  if (error) {
    return <p className="text-rose-600">{error}</p>;
  }

  if (!car) {
    return <p className="text-slate-500">Vehicle not found.</p>;
  }

  return <CarForm mode="edit" initial={car} />;
}
