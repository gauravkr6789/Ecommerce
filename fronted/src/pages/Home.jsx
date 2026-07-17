import { useState } from "react";
import Navbar from "../components/navbar/Navbar.jsx"
import ProductCard from "../components/ProductCard.jsx"
import {useProducts} from '../hooks/auth/useProducts.js'

const Home = () => {
  const { data: products = [], isLoading } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    ...new Set(products.map(p => p.category?.name || "uncategorized"))
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) => (p.category?.name || "uncategorized") === selectedCategory
        );

  return (
    <div className="bg-gray-50 min-h-screen">

     

      {/* HERO */}
      <div className="h-[55vh] bg-[url('https://images.unsplash.com/photo-1523275335684-37898b6baf30')] bg-cover bg-center flex items-center justify-center">
        <div className="bg-black/50 w-full h-full flex items-center justify-center text-white text-center">
          <div>
            <h1 className="text-5xl font-bold">Shop Smart, Live Better</h1>
            <p className="mt-2 opacity-80">Best deals on fashion & electronics</p>
          </div>
        </div>
      </div>

      {/* CATEGORY */}
      <div className="flex gap-3 px-6 py-4 overflow-x-auto bg-white">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="p-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;