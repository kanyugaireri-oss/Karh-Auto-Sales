import { listCars } from "@/services/cars";
import type { Car } from "@/types/car";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../layout/PageContainer";
import { CarCard } from "../shared/CarCard";
import { SectionHeading } from "../shared/SectionHeading";

export function FeaturedCollection() {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCars()
      .then((all) => {
        setCars(all.slice(0, 3));
        setError(null);
      })
      .catch((err) => {
        setCars([]);
        setError(err instanceof Error ? err.message : "Failed to load featured cars.");
      });
  }, []);

  return (
    <section className="py-16 sm:py-24">
      <PageContainer>
        <SectionHeading
          title="Featured Collection"
          subtitle="Meticulously curated high-performance and luxury vehicles available in Nairobi."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        {error ? <p className="mt-5 text-sm text-rose-300">{error}</p> : null}
        <div className="mt-10 text-center">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-white transition hover:brightness-110"
          >
            View All Cars
            <ArrowRight size={17} />
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
