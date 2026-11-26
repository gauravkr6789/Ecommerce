import { useNavigate } from "react-router-dom";

import {
  useProducts,
  useDeleteProduct,
} from "../../hooks/product/useProduct.js";

const Products = () => {
  const navigate = useNavigate();

  // =========================
  // GET PRODUCTS
  // =========================

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProducts();

  // =========================
  // DELETE PRODUCT
  // =========================

  const {
    mutate: deleteProduct,
    isPending: isDeleting,
  } = useDeleteProduct();

  // =========================
  // DELETE HANDLER
  // =========================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    deleteProduct(id);
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-xl p-6">
          Loading products...
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-xl p-6 text-red-500">
          {error?.response?.data?.message ||
            "Failed to load products"}
        </div>
      </div>
    );
  }

  // =========================
  // IMAGE URL HELPER
  // =========================

  const getImageUrl = (product) => {
    const imagePath = product?.images?.[0]?.url;

    if (!imagePath) return null;

    // Backend already sends full URL
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    // Local backend image
    return `${import.meta.env.VITE_API_URLL}${imagePath}`;
  };

  // =========================
  // OPEN PRODUCT DETAIL
  // =========================

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your products
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/admin/products/create")
          }
          className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
        >
          + Add Product
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            {/* ================= TABLE HEADER ================= */}

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left p-4">
                  Product
                </th>

                <th className="text-left p-4">
                  Price
                </th>

                <th className="text-left p-4">
                  Discount
                </th>

                <th className="text-left p-4">
                  Stock
                </th>

                <th className="text-left p-4">
                  Actions
                </th>

              </tr>

            </thead>

            {/* ================= TABLE BODY ================= */}

            <tbody>

              {products.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No products found.
                  </td>

                </tr>

              ) : (

                products.map((product) => {

                  const imageUrl = getImageUrl(product);

                  return (
                    <tr
                      key={product._id}
                      className="border-t"
                    >

                      {/* ================= PRODUCT ================= */}

                      <td className="p-4">

                        <div
                          onClick={() =>
                            handleProductClick(product._id)
                          }
                          className="flex items-center gap-3 cursor-pointer group"
                        >

                          {imageUrl ? (

                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                              No Image
                            </div>

                          )}

                          <div>

                            <p className="font-medium group-hover:text-indigo-600">
                              {product.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {product._id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ================= PRICE ================= */}

                      <td className="p-4">
                        ₹{product.price}
                      </td>

                      {/* ================= DISCOUNT ================= */}

                      <td className="p-4">

                        {product.discountPrice
                          ? `₹${product.discountPrice}`
                          : "-"}

                      </td>

                      {/* ================= STOCK ================= */}

                      <td className="p-4">

                        <span
                          className={
                            product.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {product.stock}
                        </span>

                      </td>

                      {/* ================= ACTIONS ================= */}

                      <td className="p-4">

                        <div className="flex gap-2">

                          {/* EDIT */}

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/products/edit/${product._id}`
                              )
                            }
                            className="border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              handleDelete(product._id)
                            }
                            disabled={isDeleting}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-50"
                          >
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Products;