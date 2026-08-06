import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Star, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="
      relative
      min-h-[85vh]
      overflow-hidden
      flex
      items-center
      "
    >

      {/* Background Image */}

      <img
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=85"
        alt="Shopping Hero"
        className="
        absolute
        inset-0
        w-full
        h-full
        object-cover
        "
      />


      {/* Overlay */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-r
        from-black/80
        via-black/60
        to-black/30
        "
      />


      {/* Content */}

      <div
        className="
        relative
        z-10
        max-w-7xl
        mx-auto
        w-full
        px-6
        py-20
        "
      >

        <div className="max-w-3xl text-white">


          {/* Badge */}

          <div
            className="
            inline-flex
            items-center
            gap-2
            mb-6
            px-5
            py-2
            rounded-full
            bg-white/10
            backdrop-blur-md
            border
            border-white/20
            text-sm
            font-semibold
            "
          >
            <Sparkles size={17} />
            Premium Shopping Experience
          </div>



          {/* Heading */}

          <h1
            className="
            text-5xl
            md:text-7xl
            font-extrabold
            leading-tight
            "
          >
            Everything You Need,
            <br />

            <span className="text-indigo-400">
              Delivered Faster
            </span>
          </h1>



          {/* Description */}

          <p
            className="
            mt-6
            max-w-2xl
            text-lg
            md:text-xl
            text-gray-200
            leading-8
            "
          >
            Explore premium products with amazing deals,
            secure payments and fast doorstep delivery.
            Your perfect shopping destination.
          </p>




          {/* Buttons */}

          <div
            className="
            mt-10
            flex
            flex-wrap
            gap-4
            "
          >

            <Link
              to="/products"
              className="
              flex
              items-center
              gap-2
              bg-indigo-600
              hover:bg-indigo-700
              px-8
              py-4
              rounded-xl
              font-semibold
              transition
              shadow-lg
              "
            >
              Shop Now
              <ArrowRight size={18}/>
            </Link>



            <Link
              to="/products"
              className="
              px-8
              py-4
              rounded-xl
              font-semibold
              border
              border-white/40
              backdrop-blur-md
              hover:bg-white
              hover:text-black
              transition
              "
            >
              Explore Products
            </Link>

          </div>




          {/* Stats */}

          <div
            className="
            mt-12
            grid
            grid-cols-2
            md:grid-cols-3
            gap-5
            "
          >

            <div
              className="
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              rounded-xl
              p-5
              "
            >
              <h3 className="text-3xl font-bold">
                10K+
              </h3>

              <p className="text-gray-300">
                Happy Customers
              </p>
            </div>




            <div
              className="
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              rounded-xl
              p-5
              "
            >

              <h3 className="text-3xl font-bold">
                500+
              </h3>

              <p className="text-gray-300">
                Products
              </p>

            </div>




            <div
              className="
              hidden
              md:block
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              rounded-xl
              p-5
              "
            >

              <div className="flex gap-1">

                {
                  [1,2,3,4,5].map((item)=>(
                    <Star
                      key={item}
                      size={18}
                      className="
                      fill-yellow-400
                      text-yellow-400
                      "
                    />
                  ))
                }

              </div>


              <p className="mt-2 font-semibold">
                4.9/5 Rating
              </p>

            </div>


          </div>



        </div>


      </div>

    </section>
  );
};

export default Hero;