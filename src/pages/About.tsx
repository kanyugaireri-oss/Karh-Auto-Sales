import { PageContainer } from "@/components/layout/PageContainer";
import { SiteShell } from "@/components/layout/SiteShell";
import { ShieldCheck, Trophy, Truck } from "lucide-react";

export default function AboutPage() {
  return (
    <SiteShell>
      <PageContainer>
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
              About <span className="text-accent">Karh Auto Sales</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              We are Nairobi's premier destination for high-quality, pre-owned and brand-new vehicles. 
              Our mission is to redefine the car buying experience through transparency, unmatched vehicle quality, and exceptional customer service.
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-[#0a1120] p-8 text-center transition hover:border-accent/50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
                <Trophy size={32} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Premium Quality</h3>
              <p className="mt-4 text-slate-400">
                Every vehicle in our showroom undergoes a rigorous multi-point inspection to ensure it meets our exacting standards before it ever reaches you.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0a1120] p-8 text-center transition hover:border-accent/50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
                <ShieldCheck size={32} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Trusted Transparency</h3>
              <p className="mt-4 text-slate-400">
                We provide complete vehicle histories and upfront pricing. No hidden fees, no surprises—just honest details so you can buy with confidence.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0a1120] p-8 text-center transition hover:border-accent/50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
                <Truck size={32} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Nationwide Delivery</h3>
              <p className="mt-4 text-slate-400">
                Found your dream car but can't make it to our showroom? We offer secure, insured delivery services straight to your doorstep across Kenya.
              </p>
            </div>
          </div>

          <div className="mt-24 rounded-3xl overflow-hidden relative h-[400px]">
             <img 
               src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
               alt="Luxury cars lined up" 
               className="inset-0 absolute w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/60 to-transparent flex flex-col justify-end p-8 md:p-12">
               <h2 className="text-3xl font-bold text-white md:text-4xl">More than just cars.</h2>
               <p className="mt-4 max-w-2xl text-lg text-slate-300">
                 Whether you are hunting for a reliable daily driver or a luxury weekend cruiser, Karh Auto Sales is committed to matching you with the perfect vehicle that fits your lifestyle and budget.
               </p>
             </div>
          </div>
        </section>
      </PageContainer>
    </SiteShell>
  );
}
