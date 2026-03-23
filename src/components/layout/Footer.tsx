import { Instagram, Linkedin, Send, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "./PageContainer";
import { useState } from "react";
import { subscribeToNewsletter } from "@/services/inquiries";

const inventoryLinks = [
  { label: "New Arrivals", to: "/cars" },
  { label: "Luxury Sedans", to: "/cars" },
  { label: "Sport Coupes", to: "/cars" },
  { label: "Performance SUVs", to: "/cars" },
];
const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Our Process", to: "/about" },
  { label: "Testimonials", to: "/about" },
  { label: "Contact", to: "/contact" },
];
const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/karhautosales", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/karhautosales", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/karhautosales", label: "LinkedIn" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      await subscribeToNewsletter(email);
      setStatus("success");
      setMessage("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to subscribe.");
    }
  };

  return (
    <footer className="mt-12 border-t border-white/10 bg-[#0a1220]">
      <PageContainer>
        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-3xl font-extrabold">
              <span className="text-white">KARH </span>
              <span className="text-accent">AUTO SALES</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              Kenya's trusted automotive dealer. Serving Nairobi and beyond with premium vehicles
              and exceptional service.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-white/30 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-white">Inventory</h4>
            <ul className="mt-4 space-y-3 text-slate-400">
              {inventoryLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-slate-100">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-white">Company</h4>
            <ul className="mt-4 space-y-3 text-slate-400">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-slate-100">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-white">Newsletter</h4>
            <p className="mt-4 text-sm text-slate-400">
              Subscribe to receive first access to new listings.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="min-w-0 flex-1 rounded-md border border-white/10 bg-[#111a2a] px-3 py-2 text-sm text-slate-100 outline-none disabled:opacity-50"
                  disabled={status === "loading" || status === "success"}
                />
                <button 
                  type="submit" 
                  disabled={status === "loading" || status === "success"}
                  className="rounded-md bg-accent px-3 text-white disabled:opacity-50 transition-opacity hover:opacity-90 flex items-center justify-center min-w-[44px]"
                >
                  {status === "loading" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : status === "success" ? (
                    <span className="text-xl">✓</span>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
              {message && (
                <p className={`text-xs ${status === "error" ? "text-rose-400" : "text-emerald-400"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-sm text-slate-500 sm:flex-row sm:justify-between">
          <span>© 2026 Karh Auto Sales. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-slate-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
