import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-[85vh] min-h-[650px] overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80"
        alt="Hero Banner"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-2xl text-white">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-600/90 px-4 py-2 text-sm font-semibold shadow-lg">
            <ShoppingBag size={16} />
            New Collection 2026
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
            Shop Smarter
            <br />
            Live Better
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-8 text-gray-200 md:text-xl">
            Discover premium electronics, fashion, accessories and everyday
            essentials. Get the best prices with fast delivery and secure
            payments.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 font-semibold transition hover:bg-indigo-700"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/products"
              className="rounded-xl border border-white px-7 py-4 font-semibold transition hover:bg-white hover:text-black"
            >
              Explore Products
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap items-center gap-8">

            <div>
              <h3 className="text-3xl font-bold">10K+</h3>
              <p className="text-gray-300">Happy Customers</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-gray-300">Premium Products</p>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((item) => (
                <Star
                  key={item}
                  size={20}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}

              <span className="ml-2 text-lg font-semibold">
                4.9 / 5 Rating
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;