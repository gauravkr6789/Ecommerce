import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateProduct } from "../../hooks/product/useProduct.js";

const CreateProduct = () => {
  const navigate = useNavigate();

  const {
    mutate: createProduct,
    isPending,
    isError,
    error,
  } = useCreateProduct();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
  });

  const [images, setImages] = useState([]);

  // =========================
  // HANDLE TEXT INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE IMAGE
  // =========================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    // Add new selected images to previous images
    // Previous images will NOT be removed
    setImages((prev) => [
      ...prev,
      ...files,
    ]);

    // Reset input
    // This allows selecting the same image again
    e.target.value = "";
  };

  // =========================
  // REMOVE IMAGE
  // =========================

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please select at least one product image");
      return;
    }

    const normalizedSlug =
      formData.slug.trim() ||
      formData.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const data = new FormData();

    data.append("name", formData.name.trim());
    data.append("slug", normalizedSlug);
    data.append("description", formData.description.trim());
    data.append("price", Number(formData.price));
    data.append("discountPrice", Number(formData.discountPrice || 0));
    data.append("stock", Number(formData.stock));
    data.append("category", formData.category.trim());

    // =========================
    // ADD IMAGES
    // =========================

    images.forEach((image) => {
      data.append("images", image);
    });

    createProduct(data, {
      onSuccess: () => {
        navigate("/admin/products");
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="transition hover:text-slate-900"
            >
              Products
            </button>

            <span>/</span>

            <span className="text-slate-900">
              Create Product
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create Product
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add a new product to your store catalog.
          </p>
        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ================= BASIC INFORMATION ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <h2 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the basic details of your product.
              </p>

            </div>

            <div className="space-y-6 p-6">

              {/* NAME + SLUG */}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* NAME */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Product Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. iPhone 15 Pro"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                </div>

                {/* SLUG */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Product Slug
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g. iphone-15-pro"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Use lowercase letters, numbers and hyphens.
                  </p>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a detailed description of your product..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

              </div>

            </div>
          </div>

          {/* ================= PRICING & INVENTORY ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <h2 className="text-lg font-semibold text-slate-900">
                Pricing & Inventory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage product pricing and available stock.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

              {/* PRICE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Price
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                </div>

              </div>

              {/* DISCOUNT PRICE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Discount Price
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    min="0"
                    placeholder="Optional"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                </div>

              </div>

              {/* STOCK */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Stock
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

              </div>

            </div>
          </div>

          {/* ================= CATEGORY ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <h2 className="text-lg font-semibold text-slate-900">
                Category
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Assign this product to a category.
              </p>

            </div>

            <div className="p-6">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category ID
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category ID"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />

            </div>
          </div>

          {/* ================= IMAGES ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <h2 className="text-lg font-semibold text-slate-900">
                Product Images
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload one or more images for your product.
              </p>

            </div>

            <div className="p-6">

              {/* UPLOAD */}

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-slate-400 hover:bg-slate-100">

                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

                  <svg
                    className="h-6 w-6 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 16V4m0 0L8 8m4-4 4 4M4 16.5v1.25A2.25 2.25 0 0 0 6.25 20h11.5A2.25 2.25 0 0 0 20 17.75V16.5"
                    />
                  </svg>

                </div>

                <span className="text-sm font-medium text-slate-700">
                  Click to upload product images
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  PNG, JPG or WEBP
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

              {/* SELECTED IMAGES */}

              {images.length > 0 && (
                <div className="mt-6">

                  <div className="mb-3 flex items-center justify-between">

                    <h3 className="text-sm font-semibold text-slate-700">
                      Selected Images
                    </h3>

                    <span className="text-xs text-slate-400">
                      {images.length} image
                      {images.length !== 1 ? "s" : ""}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                    {images.map((image, index) => (
                      <div
                        key={`${image.name}-${image.lastModified}-${index}`}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                      >

                        <img
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                          className="h-36 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white opacity-0 transition group-hover:opacity-100"
                        >
                          ×
                        </button>

                        <div className="truncate border-t border-slate-200 bg-white px-2 py-2 text-xs text-slate-500">
                          {image.name}
                        </div>

                      </div>
                    ))}

                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ================= ERROR ================= */}

          {isError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              <span className="font-semibold">
                Error:
              </span>

              <span>
                {error?.response?.data?.message ||
                  "Failed to create product"}
              </span>

            </div>
          )}

          {/* ================= ACTIONS ================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? "Creating Product..."
                : "Create Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProduct;