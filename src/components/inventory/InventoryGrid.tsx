import type { Car } from "@/types/car";
import { CarCard } from "../shared/CarCard";

export function InventoryGrid({ cars }: { cars: Car[] }) {
  if (!cars.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-panel p-6 text-slate-300">
        No vehicles found for this search.
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} showFeaturedBadge={Boolean(car.is_featured)} />
      ))}
    </div>
  );
}
