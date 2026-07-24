import React from "react";

const ProductFilter = ({
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStock,
  setInStock,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">

      {/* Category */}
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2"
      />

      {/* Min Price */}
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-32"
      />

      {/* Max Price */}
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-32"
      />

      {/* In Stock */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
        />
        In Stock
      </label>
    </div>
  );
};

export default ProductFilter;