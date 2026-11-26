
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useProduct,
  useUpdateProduct,
} from "../../hooks/product/useProduct.js";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================
  // GET PRODUCT
  // =========================

  const {
    data: productResponse,
    isLoading,
    isError,
  } = useProduct(id);

  // =========================
  // UPDATE PRODUCT
  // =========================

  const {
    mutate: updateProduct,
    isPending,
    isError: updateError,
    error,
  } = useUpdateProduct();

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
  });

  // Existing images already stored in database
  const [existingImages, setExistingImages] = useState([]);

  // New images selected from computer
  const [newImages, setNewImages] = useState([]);

  // =========================
  // IMAGE URL
  // =========================

  const getImageUrl = (image) => {
    if (!image) return "";

    // -------------------------
    // IMAGE OBJECT
    // -------------------------

    if (typeof image === "object") {
      const imagePath = image.url;

      if (!imagePath) return "";

      // Already complete URL
      if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://")
      ) {
        return imagePath;
      }

      // Your existing API URL
      return `${import.meta.env.VITE_API_URLL}${imagePath}`;
    }

    // -------------------------
    // IMAGE STRING
    // -------------------------

    if (typeof image === "string") {
      // Already complete URL
      if (
        image.startsWith("http://") ||
        image.startsWith("https://")
      ) {
        return image;
      }

      // Your existing API URL
      return `${import.meta.env.VITE_API_URLL}${image}`;
    }

    return "";
  };

  // =========================
  // LOAD PRODUCT
  // =========================

  useEffect(() => {
    if (!productResponse) return;

    const product =
      productResponse.product ||
      productResponse.data ||
      productResponse;

    console.log("Product:", product);
    console.log("Product images:", product.images);

    // Fill form
    setFormData({
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      discountPrice: product.discountPrice ?? "",
      stock: product.stock ?? "",
      category:
        product.category?._id ||
        product.category ||
        "",
    });

    // Load existing images
    setExistingImages(product.images ?? []);

    // Reset new images
    setNewImages([]);
  }, [productResponse]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SELECT NEW IMAGES
  // =========================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setNewImages((prev) => [
      ...prev,
      ...files,
    ]);

    // Same file can be selected again
    e.target.value = "";
  };

  // =========================
  // REMOVE NEW IMAGE
  // =========================

  const removeNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================
  // REMOVE EXISTING IMAGE
  // =========================

  const removeExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================
  // NEW IMAGE PREVIEW URLS
  // =========================

  const newImagePreviews = useMemo(() => {
    return newImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [newImages]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [newImagePreviews]);

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    // -------------------------
    // PRODUCT DATA
    // -------------------------

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append(
      "discountPrice",
      formData.discountPrice
    );
    data.append("stock", formData.stock);
    data.append("category", formData.category);

    // -------------------------
    // EXISTING IMAGES
    // -------------------------

    /*
      Only images that are still visible
      are sent to backend.
    */

    const remainingImages = existingImages.map(
      (image) => {
        if (typeof image === "object") {
          return image.url;
        }

        return image;
      }
    );

    data.append(
      "existingImages",
      JSON.stringify(remainingImages)
    );

    // -------------------------
    // NEW IMAGES
    // -------------------------

    newImages.forEach((image) => {
      data.append("images", image);
    });

    // -------------------------
    // DEBUG
    // -------------------------

    console.log(
      "Remaining existing images:",
      remainingImages
    );

    console.log(
      "New images:",
      newImages
    );

    // -------------------------
    // UPDATE
    // -------------------------

    updateProduct(
      {
        id,
        productData: data,
      },
      {
        onSuccess: () => {
          navigate("/admin/products");
        },
      }
    );
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="p-6">
        Loading product...
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load product.
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Update Product
          </h1>

          <p className="text-gray-500 mt-1">
            Update your product information
          </p>
        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-6"
        >

          {/* ================= NAME ================= */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2.5"
            />
          </div>

          {/* ================= DESCRIPTION ================= */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="w-full border rounded-lg px-4 py-2.5"
            />
          </div>

          {/* ================= PRICE / DISCOUNT / STOCK ================= */}

          <div className="grid md:grid-cols-3 gap-4">

            {/* PRICE */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
                className="w-full border rounded-lg px-4 py-2.5"
              />
            </div>

            {/* DISCOUNT */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Discount Price
              </label>

              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-4 py-2.5"
              />
            </div>

            {/* STOCK */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
                className="w-full border rounded-lg px-4 py-2.5"
              />
            </div>

          </div>

          {/* ================= CATEGORY ================= */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2.5"
            />
          </div>

          {/* ================= EXISTING IMAGES ================= */}

          <div>
            <h3 className="font-medium mb-3">
              Existing Images
            </h3>

            {existingImages.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No existing images.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {existingImages.map(
                  (image, index) => {
                    const imageUrl =
                      getImageUrl(image);

                    return (
                      <div
                        key={`${index}-${imageUrl}`}
                        className="relative border rounded-lg overflow-hidden"
                      >

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              console.log(
                                "Image failed:",
                                imageUrl
                              );

                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                            Image unavailable
                          </div>
                        )}

                        {/* REMOVE EXISTING */}

                        <button
                          type="button"
                          onClick={() =>
                            removeExistingImage(index)
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 hover:bg-red-600"
                        >
                          ×
                        </button>

                      </div>
                    );
                  }
                )}

              </div>
            )}
          </div>

          {/* ================= NEW IMAGES ================= */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Add New Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded-lg p-2"
            />

            {/* NEW IMAGE PREVIEWS */}

            {newImagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

                {newImagePreviews.map(
                  ({ file, url }, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="relative border rounded-lg overflow-hidden"
                    >

                      <img
                        src={url}
                        alt={file.name}
                        className="w-full h-32 object-cover"
                      />

                      {/* REMOVE NEW IMAGE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(index)
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 hover:bg-red-600"
                      >
                        ×
                      </button>

                    </div>
                  )
                )}

              </div>
            )}
          </div>

          {/* ================= ERROR ================= */}

          {updateError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              {error?.response?.data?.message ||
                "Failed to update product"}
            </div>
          )}

          {/* ================= BUTTONS ================= */}

          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {isPending
                ? "Updating..."
                : "Update Product"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/products")
              }
              className="border px-6 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
