import { buildWhatsAppLink } from "@/lib/utils";
import { whatsappNumber } from "@/lib/supabase";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { PageContainer } from "./PageContainer";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Inventory", to: "/cars" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
];

const baseLink =
  "text-sm font-medium text-slate-400 transition hover:text-slate-100";
const activeLink = "text-slate-100";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const consultLink = buildWhatsAppLink(
    whatsappNumber,
    "Hi Karh Auto Sales, I want to consult an expert."
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070d18]/95 backdrop-blur">
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-slate-100">KARH </span>
            <span className="text-accent">AUTO SALES</span>
          </Link>

          <button
            type="button"
            className="rounded-md border border-white/10 p-2 text-slate-200 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={consultLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Consult an Expert
            </a>
          </nav>
        </div>
      </PageContainer>

      {open ? (
        <div className="border-t border-white/10 bg-[#070d18] md:hidden">
          <PageContainer>
            <nav className="flex flex-col gap-1 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm ${isActive ? "bg-white/5 text-white" : "text-slate-300"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href={consultLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-md bg-accent px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Consult an Expert
              </a>
            </nav>
          </PageContainer>
        </div>
      ) : null}
    </header>
  );
}
