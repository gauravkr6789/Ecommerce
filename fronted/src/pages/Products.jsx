import React, { useEffect, useState } from "react";
import ProductCard from "../components/product/ProductCard";
import Pagination from "../components/product/Pagination";
import ProductSort from "../components/product/ProductSort";
import ProductCategoryFilter from "../components/product/ProductCategoryFilter";

import { useProducts } from "../hooks/product/useProduct";
import {useCategories} from "../hooks/categories/useCategories"
import useDebounce from "../hooks/useDebounce";

const Product = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");

  const limit = 12;

  const debouncedSearch = useDebounce(search, 500);

  // Search ya sort/category change hone par first page
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, category]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProducts({
    page,
    limit,
    search: debouncedSearch,
    sort,
    category,
  });

  const { data: categoryData } = useCategories();

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination;

  // 👇 Agar response alag ho to sirf is line ko change karna padega
 const categories = categoryData || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-semibold">
          Loading Products...
        </h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-red-500 text-xl">
          {error?.message || "Something went wrong!"}
        </h1>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">
        All Products
      </h1>

      {/* Search + Sort + Category */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full lg:w-80 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black"
        />

        <div className="flex flex-wrap gap-4">

          <ProductCategoryFilter
            categories={categories}
            category={category}
            setCategory={setCategory}
          />

          <ProductSort
            sort={sort}
            setSort={setSort}
          />

        </div>

      </div>

      {/* Product Grid */}

      {products.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No Products Found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>

          <Pagination
            currentPage={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
};

export default Product;