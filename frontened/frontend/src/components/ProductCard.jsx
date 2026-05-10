import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group bg-white dark:bg-[#111827] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-50 dark:bg-[#0b0f1a] overflow-hidden flex items-center justify-center">
        {/* Badges */}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">Sold Out</span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-3 left-3 z-10 bg-orange-400 text-white text-[10px] font-bold px-2 py-1 rounded-full">Only {product.stock} left</span>
        )}

        {imgError ? (
          <div className="text-5xl opacity-20">📦</div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className={`text-xs font-bold px-5 py-2 rounded-xl transition-all duration-200 shadow-lg
                ${added ? "bg-green-500 text-white" : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"}`}
            >
              {added ? "✓ Added!" : "Quick Add"}
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-yellow-600 dark:text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors">
          {product.category || "General"}
        </p>
        <h3 className="text-gray-800 dark:text-gray-200 font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-xs ${i < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}`}>★</span>
          ))}
          <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">({product.numReviews || 0})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <p className="text-gray-900 dark:text-white font-black text-lg transition-colors">₹{product.price?.toLocaleString()}</p>
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full transition-colors
            ${product.stock > 0 ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;