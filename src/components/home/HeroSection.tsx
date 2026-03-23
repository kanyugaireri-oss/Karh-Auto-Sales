import heroImage from "@/assets/images/hero/hero-car.jpg";
import { buildWhatsAppLink } from "@/lib/utils";
import { whatsappNumber } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { PageContainer } from "../layout/PageContainer";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(5, 11, 20, 0.95), rgba(5, 11, 20, 0.82), rgba(5, 11, 20, 0.58)), url(${heroImage})`
        }}
        aria-hidden="true"
      />
      <div className="relative py-16 sm:py-24 lg:py-28">
        <PageContainer>
          <div className="max-w-2xl">
            <h1 className="text-6xl font-extrabold leading-tight sm:text-7xl">
              <span className="text-accent">Premium</span>
              <br />
              <span className="text-white">Cars in Kenya</span>
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-slate-300">
              Kenya's trusted destination for luxury and performance vehicles. Quality cars sourced
              and verified for discerning buyers across Nairobi and beyond.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/cars"
                className="flex w-full sm:w-auto items-center justify-center rounded-md bg-accent px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-110"
              >
                Browse Cars
              </Link>
              <a
                href={buildWhatsAppLink(
                  whatsappNumber,
                  "Hi Karh Auto Sales, I need help choosing a car."
                )}
                target="_blank"
                rel="noreferrer"
                className="flex w-full sm:w-auto items-center justify-center rounded-md border border-white/20 bg-[#0a1324] px-8 py-3.5 text-base font-semibold text-white transition hover:border-white/40"
              >
                Consult an Expert
              </a>
            </div>
          </div>
        </PageContainer>
      </div>
    </section>
  );
}
