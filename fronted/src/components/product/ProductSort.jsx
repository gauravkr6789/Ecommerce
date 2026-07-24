import React from "react";

const ProductSort = ({ sort, setSort }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="font-medium text-gray-700">
        Sort By:
      </label>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black"
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