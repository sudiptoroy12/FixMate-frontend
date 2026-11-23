
"use client";

import { Search, SlidersHorizontal, ChevronDown, Sparkles } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  serviceMode: string;
  setServiceMode: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}

const categories = [
  "All Categories",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const selectClass =
  "w-full appearance-none rounded-xl border border-border bg-surface-secondary/70 px-4 py-3.5 pr-10 text-sm font-medium text-foreground outline-none transition-all duration-300 hover:border-primary/50 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10";

export default function ServiceFilters({
  search,
  setSearch,
  category,
  setCategory,
  serviceMode,
  setServiceMode,
  sort,
  setSort,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[var(--card-shadow)] transition-all duration-300 hover:border-primary/30 sm:p-6">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-secondary/20 blur-[70px]" />

      <div className="relative">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
              <SlidersHorizontal size={21} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                Find Your Service
              </h2>
              <p className="text-xs text-muted">
                Search, filter and explore repair services
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-2 text-xs font-semibold text-primary">
            <Sparkles size={14} />
            Smart Filters
          </span>

        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* Search */}
          <div className="group relative lg:col-span-1">

            <Search
              size={19}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted transition-colors duration-300 group-focus-within:text-primary"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              aria-label="Search services by title or category"
              className="w-full rounded-xl border border-border bg-surface-secondary/70 py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground hover:border-primary/50 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
            />

          </div>

          {/* Category */}
          <div className="group relative">

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
              className={selectClass}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-primary"
            />

          </div>

          {/* Service Mode */}
          <div className="group relative">

            <select
              value={serviceMode}
              onChange={(e) => setServiceMode(e.target.value)}
              aria-label="Filter by service mode"
              className={selectClass}
            >
              <option value="">All Service Modes</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-primary"
            />

          </div>

          {/* Sorting */}
          <div className="group relative">

            <SlidersHorizontal
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-300 group-focus-within:text-primary"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort services"
              className="w-full appearance-none rounded-xl border border-border bg-surface-secondary/70 py-3.5 pl-11 pr-10 text-sm font-medium text-foreground outline-none transition-all duration-300 hover:border-primary/50 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-primary"
            />

          </div>

        </div>

      </div>
    </section>
  );
}
