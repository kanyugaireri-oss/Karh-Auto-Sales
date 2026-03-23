import { PageContainer } from "@/components/layout/PageContainer";
import { SiteShell } from "@/components/layout/SiteShell";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryToolbar } from "@/components/inventory/InventoryToolbar";
import { listCars } from "@/services/cars";
import type { Car } from "@/types/car";
import { useEffect, useMemo, useState } from "react";

export default function InventoryPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listCars()
      .then((data) => {
        setCars(data);
        setError(null);
      })
      .catch((err) => {
        setCars([]);
        setError(err instanceof Error ? err.message : "Failed to load inventory.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    let output = cars.filter((car) => car.title.toLowerCase().includes(normalized));
    output = [...output].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return +new Date(b.created_at) - +new Date(a.created_at);
    });
    return output;
  }, [cars, query, sort]);

  return (
    <SiteShell>
      <PageContainer>
        <InventoryHeader />
        <InventoryToolbar query={query} sort={sort} onQuery={setQuery} onSort={setSort} />
        <p className="mt-5 text-sm text-slate-400">Showing {filtered.length} vehicles</p>
        {loading ? <p className="mt-3 text-sm text-slate-400">Loading inventory...</p> : null}
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        <div className="mt-5 pb-8">
          <InventoryGrid cars={filtered} />
        </div>
      </PageContainer>
    </SiteShell>
  );
}
