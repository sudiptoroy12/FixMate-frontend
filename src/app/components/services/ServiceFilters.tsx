
"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
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

export default function ServiceFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:grid-cols-2 lg:grid-cols-3">

      {/* Search */}
      <div className="relative">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#167d68] focus:ring-2 focus:ring-[#167d68]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Category */}
      <div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#167d68] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div className="relative">
        <SlidersHorizontal
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none focus:border-[#167d68] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

    </div>
  );
}
