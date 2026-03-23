import { Search, SlidersHorizontal } from "lucide-react";

type InventoryToolbarProps = {
  query: string;
  sort: string;
  onQuery: (value: string) => void;
  onSort: (value: string) => void;
};

export function InventoryToolbar({ query, sort, onQuery, onSort }: InventoryToolbarProps) {
  return (
    <div className="mt-8 grid gap-3 md:grid-cols-[1fr_180px]">
      <label className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Search by car title..."
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-panel py-3 pl-10 pr-3 text-slate-100 outline-none placeholder:text-slate-500"
        />
      </label>
      <label className="relative">
        <SlidersHorizontal
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={18}
        />
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className="w-full appearance-none rounded-md border border-white/15 bg-panel py-3 pl-10 pr-3 text-slate-100 outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="price-asc">Price: Low to High</option>
        </select>
      </label>
    </div>
  );
}
