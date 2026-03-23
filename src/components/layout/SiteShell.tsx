import type { PropsWithChildren } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function SiteShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-base text-slate-100">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
