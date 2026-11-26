import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  PackageSearch,
  Sparkles,
  ShoppingBag,
  X,
} from "lucide-react";

import ProductCard from "../components/product/ProductCard.jsx";
import Pagination from "../components/product/Pagination.jsx";
import ProductSort from "../components/product/ProductSort.jsx";
import ProductCategoryFilter from "../components/product/ProductCategoryFilter.jsx";

import { useProducts } from "../hooks/product/useProduct.js";
import { useCategories } from "../hooks/categories/useCategories.js";
import useDebounce from "../hooks/useDebounce.js";

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");

  const limit = 12;

  const debouncedSearch = useDebounce(search, 500);

  // Sync URL search with input
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // Update URL when search changes
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    const newSearch = search.trim();

    if (currentSearch !== newSearch) {
      setSearchParams(newSearch ? { search: newSearch } : {}, {
        replace: true,
      });
    }
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, category]);

  // Fetch Products
  const { data, isLoading, isError, error } = useProducts({
    page,
    limit,
    search: debouncedSearch,
    sort,
    category: category || "",
  });

  // Fetch Categories
  const { data: categoryData } = useCategories();

  const products = data?.products || [];
  const pagination = data?.pagination;
  const categories = categoryData || [];

  const selectedCategory = categories.find((item) => item._id === category);

  // Clear Filters
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("newest");
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <Sparkles size={16} />
              Discover Something New
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Find Your
              <span className="block text-indigo-200">Perfect Products.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-indigo-100 md:text-base">
              Explore our collection of amazing products. Find your favorites,
              discover new arrivals and shop with confidence.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                Quality Products
              </div>

              <div className="h-1 w-1 rounded-full bg-white/60" />

              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                Latest Collection
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        {/* Section Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Our Collection
            </p>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Explore Products
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Find the products you are looking for.
            </p>
          </div>

          {!isLoading && !isError && (
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
              <ShoppingBag size={18} />
              {pagination?.totalProducts ?? products.length} Products
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-9 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal
              size={19}
              className="text-indigo-600 dark:text-indigo-400"
            />

            <h3 className="font-semibold text-gray-900 dark:text-white">
              Find Your Products
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-gray-800 dark:focus:ring-indigo-950"
              />
            </div>

            {/* Category */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
              <ProductCategoryFilter
                categories={categories}
                category={category}
                setCategory={setCategory}
              />
            </div>

            {/* Sort */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
              <ProductSort sort={sort} setSort={setSort} />
            </div>
          </div>

          {/* Active Filters */}
          {(search || category || sort !== "newest") && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active filters:
              </span>

              {search && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Search: {search}
                </span>
              )}

              {selectedCategory && (
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Category: {selectedCategory.name}
                </span>
              )}

              {sort !== "newest" && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Sort: {sort.replaceAll("_", " ")}
                </span>
              )}

              <button
                onClick={clearFilters}
                className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-red-500 transition hover:text-red-600"
              >
                <X size={15} />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="h-56 bg-gray-200 dark:bg-gray-800" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-9 rounded-lg bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/30">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              {error?.message || "Something went wrong!"}
            </p>
          </div>
        )}

        {/* Products */}
        {!isLoading && !isError && (
          <>
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center dark:border-gray-700 dark:bg-gray-900">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950">
                  <PackageSearch
                    size={32}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  No Products Found
                </h3>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try changing your search or category filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <>
                {/* Product Count */}
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {products.length}
                    </span>{" "}
                    products on this page
                  </p>

                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Page {pagination?.currentPage || page}
                  </span>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Product;
