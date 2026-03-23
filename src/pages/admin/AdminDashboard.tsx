import { useEffect, useState } from "react";
import { listCars } from "@/services/cars";
import type { Car } from "@/types/car";
import { CarFront, CheckCircle2, CircleDollarSign, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const [data, setData] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCars()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const totalAssets = data.length;
  const availableCars = data.filter((c) => c.status === "available").length;
  const soldCars = data.filter((c) => c.status === "sold").length;
  const reservedCars = data.filter((c) => c.status === "reserved").length;

  const totalValuation = data
    .filter((c) => c.status === "available" || c.status === "reserved")
    .reduce((acc, car) => acc + (car.offer_price > 0 ? car.offer_price : car.price), 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-KE").format(val);


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
        <p className="mt-1 text-slate-500">Platform statistics and inventory valuation.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <CarFront size={20} />
            </div>
            <p className="text-sm font-medium text-slate-600">Total Inventory</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{totalAssets}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-sm font-medium text-slate-600">Available / Reserved</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {availableCars} <span className="text-lg font-normal text-slate-400">/ {reservedCars}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <PackageSearch size={20} />
            </div>
            <p className="text-sm font-medium text-slate-600">Sold Units</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{soldCars}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <CircleDollarSign size={20} />
            </div>
            <p className="text-sm font-medium text-slate-600">Active Valuation</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            <span className="text-lg font-normal text-slate-500">KES</span> {formatCurrency(totalValuation)}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Recent Inventory</h3>
          <Link to="/admin/cars" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {data.slice(0, 5).map(car => (
            <div key={car.id} className="flex items-center gap-4 px-5 py-3">
              <img src={car.image_urls?.[0]} alt={car.title} className="h-12 w-16 rounded object-cover" />
              <div className="flex-1">
                <p className="font-medium text-slate-900">{car.title}</p>
                <p className="text-xs text-slate-500">{car.make} {car.model} • {car.year}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                {car.offer_price > 0 ? (
                  <>
                    <p className="text-xs font-semibold text-slate-400 line-through decoration-double decoration-2 -mb-0.5">KES {formatCurrency(car.price)}</p>
                    <p className="text-sm font-medium text-slate-900">KES {formatCurrency(car.offer_price)}</p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-slate-900">KES {formatCurrency(car.price)}</p>
                )}
                <p className="text-xs text-slate-500 uppercase">{car.status}</p>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-slate-500">No recent cars found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
