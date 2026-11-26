import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

import Hero from "../components/home/Hero.jsx";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";

import { useProducts } from "../hooks/product/useProduct.js";

const Home = () => {
  const { data, isLoading, isError } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = data?.products || [];

  const categories = [
    "all",
    ...new Set(
      products.map((product) => product.category?.name || "Uncategorized"),
    ),
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) =>
            (product.category?.name || "Uncategorized") === selectedCategory,
        );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <h1 className="text-xl font-bold text-red-500">Something went wrong</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      {/* Hero */}
      <Hero />

      {/* Category Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Browse Collection
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Shop By Category
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Explore products from your favorite categories.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? "scale-105 bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Our Collection
            </p>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Products
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Discover our latest and popular products.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <ShoppingBag size={18} />
              {filteredProducts.length} Products
            </span>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400"
            >
              View All
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Product List */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950">
              <ShoppingBag
                size={30}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              No Products Found
            </h3>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try selecting another category.
            </p>

            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="transition duration-300 hover:-translate-y-2"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
