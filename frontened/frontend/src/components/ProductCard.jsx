import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
    >
      {/* Product Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-yellow-500 font-semibold uppercase mb-1">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-gray-800 font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.numReviews} reviews)
          </span>
        </div>

        {/* Price & Stock */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </p>
          {product.stock === 0 ? (
            <span className="text-xs text-red-500 font-semibold">
              Out of Stock
            </span>
          ) : (
            <span className="text-xs text-green-500 font-semibold">
              In Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;