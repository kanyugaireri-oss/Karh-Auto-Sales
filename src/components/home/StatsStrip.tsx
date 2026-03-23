import { PageContainer } from "../layout/PageContainer";

const stats = [
  { value: "500+", label: "Cars Sold" },
  { value: "100%", label: "Authentic" },
  { value: "24h", label: "Turnaround" }
];

export function StatsStrip() {
  return (
    <section className="border-b border-white/10 bg-[#060d1b]">
      <PageContainer>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-8 sm:py-10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold sm:font-extrabold text-white">{stat.value}</p>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-xl text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
