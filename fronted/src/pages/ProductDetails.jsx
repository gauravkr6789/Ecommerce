import { useParams } from "react-router-dom";
import { useProducts } from "../hooks/product/useProduct.js";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);

  if (isLoading) return <p className="p-10">Loading...</p>;
  if (!product) return <p className="p-10">Not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-6 grid md:grid-cols-2 gap-8">

        <img
          src={product.images?.[0]?.url}
          className="w-full h-[400px] object-cover rounded-lg"
        />

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mt-2">{product.description}</p>

          <p className="text-2xl mt-4 font-semibold">
            ₹{product.price}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Category: {product.category?.name}
          </p>

          <p className="text-sm text-gray-500">
            Stock: {product.stock}
          </p>

          <div className="mt-6 flex gap-4">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
              Add to Cart
            </button>

            <button className="bg-black text-white px-6 py-2 rounded-lg">
              Buy Now
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;