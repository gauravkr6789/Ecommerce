import React, {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import { useProduct } from "../context/ProductContext.jsx";

function ProductDetail() {

  const { id } = useParams();

  const { fetchProductById } =
    useProduct();

  const [product, setProduct] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  useEffect(() => {

    const getProduct = async () => {

      const data =
        await fetchProductById(id);

      // CORRECT
      console.log("data", data);

      setProduct(data);

      // DEFAULT IMAGE
      if (data?.images?.length > 0) {

        setSelectedImage(
          `http://localhost:3500${data.images[0].url}`
        );
      }
    };

    getProduct();

  }, [id]);

  console.log(product);

  return (
  <div className="min-h-screen bg-black text-white p-10">

    <h1 className="text-4xl font-bold">
      {product?.name}
    </h1>

    <img
      src={`http://localhost:3500${product?.images?.[0]?.url}`}
      alt={product?.name}
      className="w-80 h-80 object-cover rounded-2xl mt-6"
    />

    <p className="mt-5 text-gray-400">
      {product?.description}
    </p>

    <h2 className="text-3xl text-indigo-400 mt-5">
      ₹{product?.price}
    </h2>

  </div>
);
}

export default ProductDetail;