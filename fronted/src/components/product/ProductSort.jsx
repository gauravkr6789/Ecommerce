import React from "react";
import { ArrowUpDown } from "lucide-react";

const ProductSort = ({ sort, setSort }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        <ArrowUpDown size={16} />
        Sort By
      </label>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-indigo-900"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
        <option value="stock">Stock</option>
        <option value="name_asc">Name A-Z</option>
        <option value="name_desc">Name Z-A</option>
      </select>
    </div>
  );
};

export default ProductSort;
