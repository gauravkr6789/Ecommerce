import { useState } from "react";

const ProductImageGallery = ({ images = [], productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const getImageUrl = (image) => {
    if (!image) return "";

    const imagePath =
      typeof image === "object"
        ? image.url
        : image;

    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return `${import.meta.env.VITE_API_URLL}${imagePath}`;
  };

  if (!images.length) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
        No Image
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="border rounded-lg overflow-hidden">
        <img
          src={getImageUrl(images[selectedImage])}
          alt={productName}
          className="w-full h-[400px] object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((image, index) => (
            <button
              key={image._id || index}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`border rounded-lg overflow-hidden ${
                selectedImage === index
                  ? "border-indigo-600"
                  : "border-gray-200"
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`${productName} ${index + 1}`}
                className="w-20 h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;