import { useState } from "react";

import Hero from '../components/home/Hero.jsx'
import ProductCard from "../components/product/ProductCard";

import { useProducts } from "../hooks/product/useProduct.js";

const Home = () => {
  const { data: products = [], isLoading, isError } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    ...new Set(
      products.map((p) => p.category?.name || "Uncategorized")
    ),
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) =>
            (p.category?.name || "Uncategorized") ===
            selectedCategory
        );

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center py-20 text-red-500">
        Something went wrong
      </div>
    );

  return (
    <>

      <Hero />

      {/* Categories */}

      <section className="mx-auto max-w-7xl px-6 py-8">

        <h2 className="mb-5 text-2xl font-bold">
          Shop By Category
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-2">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}

        </div>

      </section>

      {/* Products */}

      <section className="mx-auto max-w-7xl px-6 pb-12">

        <h2 className="mb-6 text-3xl font-bold">
          Featured Products
        </h2>

        {filteredProducts.length === 0 ? (
          <p>No Products Found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>
        )}

      </section>

    </>
  );
};

export default Home;