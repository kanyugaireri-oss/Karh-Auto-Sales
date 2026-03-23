import { Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SourcingBanner() {
  return (
    <section className="bg-[#0f182a] py-12 md:py-16 relative border-y border-white/5">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:px-8 md:text-left">
        <div className="flex items-center justify-center gap-5 md:justify-start">
          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent md:flex">
            <Search size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl tracking-tight">
              Not on our LIST?
            </h2>
            <p className="mt-2 text-lg font-medium text-slate-300 max-w-lg">
              We will find it for you! Our sourcing experts can track down your exact dream vehicle.
            </p>
          </div>
        </div>
        <Link
          to="/contact"
          className="group inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-accent px-8 py-4 text-lg font-bold text-white transition-all hover:brightness-110 hover:shadow-xl hover:scale-105"
        >
          Contact Us
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
