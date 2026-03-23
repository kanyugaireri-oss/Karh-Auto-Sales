import { signOut } from "@/services/auth";
import {
  Bell,
  CarFront,
  CircleDot,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Search,
  X
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/adminSearch";
import { getSupabaseClient } from "@/lib/supabase";

const menu = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/cars", label: "Cars", icon: CarFront },
  { to: "/admin/inquiries", label: "Inquiries", icon: ClipboardList },
  { to: "/admin/cars/new", label: "New Listing", icon: CircleDot }
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useAdminStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const title = location.pathname.includes("/dashboard")
    ? "Dashboard"
    : location.pathname.includes("/inquiries")
      ? "Customer Inquiries"
      : location.pathname.includes("/cars/new")
        ? "Add Vehicle"
        : location.pathname.includes("/edit")
          ? "Edit Vehicle"
          : "Inventory";

  useEffect(() => {
    async function fetchUnreadInquiries() {
      const client = getSupabaseClient();
      const { count } = await client
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");
      
      setUnreadCount(count || 0);
    }
    fetchUnreadInquiries();

    // Setup realtime subscription for new inquiries
    const client = getSupabaseClient();
    const channels = client.channel('custom-inquiries-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inquiries' },
        () => {
          fetchUnreadInquiries();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channels);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#d8d9e6] text-slate-900 md:bg-[#c9cad9] overflow-x-hidden">
      <div className="flex w-full min-h-screen md:p-3 gap-3 overflow-x-hidden">
        <aside className="hidden w-[250px] rounded-3xl bg-[#060912] px-4 py-5 text-slate-100 lg:flex lg:flex-col">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Karh Admin</p>
            <h1 className="mt-2 flex items-center gap-2 text-lg font-semibold">
              <LayoutDashboard size={18} className="text-[#5f7bff]" />
              Dashboard
            </h1>
          </div>
          <nav className="mt-7 space-y-1.5">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin/cars"}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-[#4f6ff0] text-white shadow-[0_10px_20px_rgba(79,111,240,0.38)]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    ].join(" ")
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-sm font-medium text-white">Karh Team</p>
            <p className="text-xs text-slate-400">Manager</p>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate("/admin/login");
              }}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 bg-white p-4 pb-24 md:rounded-3xl md:p-6 md:pb-6 overflow-x-hidden w-full relative">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            
            {showMobileSearch ? (
              <div className="flex w-full items-center gap-2 lg:hidden animate-in fade-in slide-in-from-top-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      navigate("/admin/cars");
                    }}
                    placeholder="Search cars by letter..."
                    className="h-10 w-full rounded-full border border-slate-300 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4f6ff0] focus:outline-none focus:ring-1 focus:ring-[#4f6ff0]"
                  />
                </div>
                <button 
                  onClick={() => setShowMobileSearch(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 truncate">Karh Auto Sales</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-900 truncate">{title}</h2>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  {/* Desktop Search Bar */}
                  <div className="hidden lg:block relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (location.pathname !== "/admin/cars") {
                          navigate("/admin/cars");
                        }
                      }}
                      placeholder="Search cars by letter..."
                      className="h-10 w-64 rounded-full border border-slate-300 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#4f6ff0] focus:outline-none focus:ring-1 focus:ring-[#4f6ff0] transition-all"
                    />
                  </div>

                  {/* Mobile Search Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowMobileSearch(true)}
                    className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  >
                    <Search size={18} />
                  </button>

                  {/* Notifications */}
                  <button
                    type="button"
                    onClick={() => navigate("/admin/inquiries")}
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
            
          </header>
          <div className="pt-4">
            <Outlet />
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 pb-1">
          {menu.map((item) => {
            const Icon = item.icon;
            let active = false;
            if (item.to === "/admin/cars") {
              active = location.pathname === "/admin/cars";
            } else {
              active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            }
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={[
                  "flex flex-1 flex-col items-center justify-center rounded-xl py-2 px-1 text-xs font-medium transition",
                  active ? "bg-[#4f6ff0] text-white" : "text-slate-600 hover:bg-slate-50"
                ].join(" ")}
              >
                <Icon size={16} className="mb-1" />
                <span className="truncate w-full text-center text-[10px] sm:text-xs">{item.label}</span>
              </NavLink>
            );
          })}
          
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate("/admin/login");
            }}
            className="flex min-w-[70px] flex-col items-center justify-center rounded-xl py-2 px-1 text-xs font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut size={16} className="mb-1" />
            <span className="truncate w-full text-center text-[10px] sm:text-xs">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
