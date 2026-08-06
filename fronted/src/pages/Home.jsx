import { useState } from "react";

import Hero from "../components/home/Hero.jsx";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";

import { useProducts } from "../hooks/product/useProduct.js";


const Home = () => {

  const { data: products = [], isLoading, isError } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");


  const categories = [
    "all",
    ...new Set(
      products.map(
        (p) => p.category?.name || "Uncategorized"
      )
    ),
  ];


  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) =>
            (p.category?.name || "Uncategorized") === selectedCategory
        );



  if (isLoading) {
    return <Loader />;
  }


  if (isError) {
    return (
      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      dark:bg-gray-950
      ">
        <h1 className="
        text-xl
        font-bold
        text-red-500
        ">
          Something went wrong
        </h1>
      </div>
    );
  }



  return (

    <div className="
      min-h-screen
      bg-gray-50
      dark:bg-gray-950
      transition-colors
      duration-300
    ">


      {/* HERO */}

      <Hero />



      {/* CATEGORY SECTION */}


      <section className="
        max-w-7xl
        mx-auto
        px-6
        py-12
      ">


        <div className="
          bg-white
          dark:bg-gray-900
          rounded-2xl
          shadow-lg
          border
          border-gray-200
          dark:border-gray-700
          p-6
        ">


          <h2 className="
            text-2xl
            md:text-3xl
            font-bold
            mb-6
            text-gray-900
            dark:text-white
          ">
            Shop By Category
          </h2>



          <div className="
            flex
            gap-4
            overflow-x-auto
            pb-2
          ">


            {
              categories.map((cat)=>(

                <button
                  key={cat}
                  onClick={()=>setSelectedCategory(cat)}
                  className={`
                  
                  px-6
                  py-3
                  rounded-full
                  font-medium
                  whitespace-nowrap
                  transition-all
                  duration-300

                  ${
                    selectedCategory === cat

                    ?
                    `
                    bg-indigo-600
                    text-white
                    shadow-lg
                    scale-105
                    `

                    :

                    `
                    bg-gray-100
                    dark:bg-gray-800
                    text-gray-700
                    dark:text-gray-300
                    hover:bg-indigo-100
                    dark:hover:bg-gray-700
                    `
                  }

                  `}
                >
                  {cat}
                </button>


              ))
            }


          </div>


        </div>


      </section>





      {/* PRODUCT SECTION */}


      <section className="
        max-w-7xl
        mx-auto
        px-6
        pb-16
      ">


        <div className="
          flex
          justify-between
          items-center
          mb-8
        ">


          <h2 className="
            text-3xl
            font-bold
            text-gray-900
            dark:text-white
          ">
            Featured Products
          </h2>



          <button className="
            text-indigo-600
            dark:text-indigo-400
            font-semibold
            hover:underline
          ">
            View All
          </button>


        </div>





        {
          filteredProducts.length === 0 ?


          (

            <div className="
              bg-white
              dark:bg-gray-900
              rounded-xl
              shadow
              p-10
              text-center
            ">


              <h3 className="
                text-xl
                font-semibold
                text-gray-800
                dark:text-white
              ">
                No Products Found
              </h3>


              <p className="
                text-gray-500
                mt-2
              ">
                Try another category
              </p>


            </div>


          )


          :

          (

            <div className="
              grid
              gap-8
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            ">


              {
                filteredProducts.map((product)=>(

                  <div
                    key={product._id}
                    className="
                    transition
                    duration-300
                    hover:-translate-y-2
                    "
                  >

                    <ProductCard
                      product={product}
                    />

                  </div>


                ))
              }


            </div>


          )

        }


      </section>


    </div>

  );
};


export default Home;