import { CreditCard, ShieldCheck, Tag, Zap } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      title: "Trustworthy",
      description: "Every vehicle is 100% verified with comprehensive background and mechanical checks.",
      icon: ShieldCheck,
    },
    {
      title: "Fast Paperwork",
      description: "We hate waiting as much as you do. Our team streamlines the entire transfer process.",
      icon: Zap,
    },
    {
      title: "Flexible Financing",
      description: "Partnered with top tier banks to offer affordable and highly flexible payment plans.",
      icon: CreditCard,
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees, no last-minute surprises. What you see is exactly what you pay.",
      icon: Tag,
    },
  ];

  return (
    <section className="bg-[#0a1120] py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="lg:w-1/2 p-[10px] md:p-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Why Choose <span className="text-accent">Karh</span>
            </h2>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              We go beyond just selling cars. We provide an unparalleled automotive experience built on trust, efficiency, and clarity. Here is why hundreds of clients choose us as their preferred dealership.
            </p>
            <div className="mt-10 mb-8 lg:mb-0">
             <a href="/about" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white transition hover:brightness-110">
                Learn More About Us
              </a>
            </div>
          </div>

          {/* Right Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6 lg:w-1/2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="rounded-2xl border border-white/5 bg-[#11192b] p-6 transition-colors hover:border-accent/40">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
