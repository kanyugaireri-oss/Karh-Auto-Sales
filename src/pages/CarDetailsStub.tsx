import { PageContainer } from "@/components/layout/PageContainer";
import { SiteShell } from "@/components/layout/SiteShell";
import { getCarBySlug, listCars } from "@/services/cars";
import type { Car } from "@/types/car";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CarCard } from "@/components/shared/CarCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function CarDetailsStubPage() {
  const { slug } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [otherCars, setOtherCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    
    Promise.all([
      getCarBySlug(slug),
      listCars()
    ])
      .then(([currentCar, allCars]) => {
        setCar(currentCar);
        setCurrentImageIndex(0);
        if (currentCar) {
          // Filter out the current car and limit to 6 suggestions
          const suggestions = allCars.filter(c => c.id !== currentCar.id).slice(0, 6);
          setOtherCars(suggestions);
        }
        setError(null);
      })
      .catch((loadError) => {
        setCar(null);
        setError(loadError instanceof Error ? loadError.message : "Failed to load vehicle.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <SiteShell>
      <PageContainer>
        <section className="py-10">
          {loading ? (
            <p className="text-slate-400">Loading vehicle...</p>
          ) : error ? (
            <p className="text-rose-300">{error}</p>
          ) : !car ? (
            <p className="text-slate-400">Vehicle not found.</p>
          ) : (
            <div className="grid gap-4 rounded-xl border border-white/10 bg-panel p-4 md:grid-cols-2">
              <div className="space-y-4 max-w-full overflow-hidden">
                <div className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:aspect-[4/3] h-[30vh] sm:h-auto">
                  <div 
                    id="main-carousel"
                    className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
                    onScroll={(e) => {
                      const el = e.currentTarget;
                      const index = Math.round(el.scrollLeft / el.clientWidth);
                      if (index !== currentImageIndex) setCurrentImageIndex(index);
                    }}
                  >
                    {car.image_urls?.map((url, idx) => (
                      <div key={idx} className="h-full w-full shrink-0 snap-center">
                        <img 
                          src={url} 
                          alt={`${car.title} - Image ${idx + 1}`} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                  {car.image_urls && car.image_urls.length > 1 && (
                    <>
                      <button 
                        onClick={() => {
                          const el = document.getElementById('main-carousel');
                          if (el) el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/80 group-hover:opacity-100 sm:left-4 sm:p-3"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} className="sm:h-6 sm:w-6" />
                      </button>
                      <button 
                        onClick={() => {
                          const el = document.getElementById('main-carousel');
                          if (el) el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/80 group-hover:opacity-100 sm:right-4 sm:p-3"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} className="sm:h-6 sm:w-6" />
                      </button>
                    </>
                  )}
                </div>
                {car.image_urls && car.image_urls.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar">
                    {car.image_urls.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          const el = document.getElementById('main-carousel');
                          if (el) el.scrollTo({ left: el.clientWidth * idx, behavior: 'smooth' });
                        }}
                        className={`relative h-20 w-28 shrink-0 snap-start overflow-hidden rounded-lg border-2 transition focus:outline-none ${
                          idx === currentImageIndex ? 'border-accent' : 'border-transparent hover:border-accent/50'
                        }`}
                      >
                        <img src={url} alt={`${car.title} thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="text-accent">{car.year} {car.make} {car.model}</p>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{car.title}</h1>
                  {car.status !== "available" && (
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-amber-500 uppercase tracking-wide">
                      {car.status}
                    </span>
                  )}
                </div>
                {car.offer_price > 0 ? (
                  <div className="mt-2 flex flex-col">
                    <p className="text-lg font-semibold text-slate-500 line-through decoration-double decoration-2 sm:-mb-1">KES {new Intl.NumberFormat().format(car.price)}</p>
                    <p className="text-3xl font-extrabold text-white">KES {new Intl.NumberFormat().format(car.offer_price)}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-3xl font-extrabold text-white">KES {new Intl.NumberFormat().format(car.price)}</p>
                )}
                
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-black/20 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Mileage</p>
                    <p className="text-slate-300">{car.mileage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Transmission</p>
                    <p className="text-slate-300">{car.transmission}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Fuel Type</p>
                    <p className="text-slate-300">{car.fuel_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Body Type</p>
                    <p className="text-slate-300">{car.body_type}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-slate-500">Location</p>
                    <p className="text-slate-300">{car.location}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white">Description</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">{car.description}</p>
                </div>
              </div>
            </div>
          )}

          {otherCars.length > 0 && (
            <div className="mt-16 border-t border-white/10 pt-10">
              <h2 className="mb-6 text-2xl font-bold text-white">More Cars You Might Like</h2>
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x no-scrollbar md:pb-10">
                {otherCars.map((suggestedCar) => (
                  <div key={suggestedCar.id} className="w-[300px] shrink-0 snap-start sm:w-[350px]">
                    <CarCard car={suggestedCar} />
                  </div>
                ))}
                
                {/* View All Card */}
                <div className="flex w-[300px] shrink-0 snap-start items-center justify-center p-4 sm:w-[350px]">
                  <Link 
                    to="/cars" 
                    className="flex h-[200px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-panel/50 text-slate-400 transition hover:bg-panel hover:text-white hover:border-accent"
                  >
                    <div className="rounded-full bg-black/30 p-4">
                      <ArrowRight size={24} className="text-accent" />
                    </div>
                    <span className="font-semibold">View All Inventory</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <Link to="/cars" className="mt-8 inline-block text-accent transition hover:text-white">
            ← Back to All Inventory
          </Link>
        </section>
      </PageContainer>
    </SiteShell>
  );
}
