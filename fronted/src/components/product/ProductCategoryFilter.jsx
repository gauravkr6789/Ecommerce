import React from "react";
import { Tag } from "lucide-react";

const ProductCategoryFilter = ({ categories, category, setCategory }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        <Tag size={16} />
        Category
      </label>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-indigo-900"
      >
        <option value="">All Categories</option>

        {categories.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductCategoryFilter;
