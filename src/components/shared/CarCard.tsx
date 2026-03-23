import { buildWhatsAppLink, formatCurrencyKES } from "@/lib/utils";
import { whatsappNumber } from "@/lib/supabase";
import type { Car } from "@/types/car";
import { Eye, Gauge, Settings, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

type CarCardProps = {
  car: Car;
  showFeaturedBadge?: boolean;
};

export function CarCard({ car, showFeaturedBadge = true }: CarCardProps) {
  const whatsapp = buildWhatsAppLink(
    whatsappNumber,
    `Hi Karh Auto Sales, I am interested in ${car.title} (${formatCurrencyKES(car.offer_price || car.price)}).`
  );

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-panel shadow-card transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative">
        <img src={car.image_urls?.[0]} alt={car.title} className="h-56 w-full object-cover sm:h-64" />
        <div className="absolute left-4 top-4 flex w-[calc(100%-2rem)] justify-between">
          {showFeaturedBadge ? (
            <span className="rounded-md bg-accent px-3 py-1 text-xs font-bold text-white">
              FEATURED
            </span>
          ) : (
            <span />
          )}
          <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-900">
            {car.fuel_type}
          </span>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-lg font-semibold text-accent">{car.year}</p>
        <h3 className="text-3xl font-bold text-white">{car.title}</h3>
        <div className="flex items-center gap-5 text-sm text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Gauge size={14} />
            {car.mileage}
          </span>
          <span className="inline-flex items-center gap-1">
            <Settings size={14} />
            {car.transmission}
          </span>
        </div>
        <div className="h-px bg-white/10" />
        {car.offer_price > 0 ? (
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-slate-500 line-through decoration-double decoration-2 sm:-mb-1">{formatCurrencyKES(car.price)}</p>
            <p className="text-4xl font-extrabold text-white">{formatCurrencyKES(car.offer_price)}</p>
          </div>
        ) : (
          <p className="text-4xl font-extrabold text-white">{formatCurrencyKES(car.price)}</p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-whatsapp px-3 py-3 font-semibold text-white transition hover:brightness-110"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <Link
            to={`/cars/${car.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-[#0b1323] px-3 py-3 font-semibold text-white transition hover:border-white/30"
          >
            <Eye size={16} />
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
