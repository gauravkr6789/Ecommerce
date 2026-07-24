import React from "react";

const ProductCategoryFilter = ({
  categories,
  category,
  setCategory,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="font-medium">
        Category:
      </label>

      <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="border border-gray-300 rounded-lg px-4 py-2"
>
  <option value="">All Categories</option>

  {categories.map((item) => (
    <option
      key={item._id}
      value={item.slug}
    >
      {item.name}
    </option>
  ))}
</select>
    </div>
  );
};

export default ProductCategoryFilter;