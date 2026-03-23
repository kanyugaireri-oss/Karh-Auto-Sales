import { Car, FileText, Key, MessageCircle, Search } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Browse a Car",
      description: "Explore our premium inventory and find the perfect vehicle for you.",
      icon: Search,
    },
    {
      title: "Contact Us",
      description: "Reach out to us to inquire more details about the vehicle you like.",
      icon: MessageCircle,
    },
    {
      title: "Book Inspection",
      description: "Schedule a time to inspect the car or take it for a test drive.",
      icon: Car,
    },
    {
      title: "Secure Payment",
      description: "We handle all the secure payments and fast paperwork for a smooth transfer.",
      icon: FileText,
    },
    {
      title: "Drive Home",
      description: "Get the keys and drive off in your new vehicle with complete peace of mind.",
      icon: Key,
    },
  ];

  return (
    <section className="bg-[#050b14] py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            How It <span className="text-accent">Works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400 p-[10px] md:p-0">
            We've streamlined our process to ensure getting your dream car is as simple and transparent as possible.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 relative">
          {/* Connecting line for desktop */}
          <div className="absolute top-1/4 left-[10%] w-[80%] h-0.5 bg-accent/20 hidden lg:block -z-0"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative z-10 flex flex-col items-center text-center p-[20px] md:p-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0a1120] border-4 border-[#050b14] shadow-[0_0_20px_rgba(79,111,240,0.2)] text-accent transition-transform hover:scale-110">
                  <Icon size={32} />
                </div>
                <div className="mt-6 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-slate-400 text-sm xl:text-base">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
