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
      className="group relative bg-white/4 border border-white/8 rounded-2xl overflow-hidden cursor-pointer
        hover:border-yellow-400/30 hover:bg-white/7 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-400/8
        transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Stock Badge */}
      {product.stock === 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
          Sold Out
        </div>
      )}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="absolute top-3 left-3 z-10 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
          Only {product.stock} left
        </div>
      )}

      {/* Image */}
      <div className="relative h-52 bg-white/5 overflow-hidden flex items-center justify-center">
        {imgError ? (
          <div className="text-5xl opacity-20">📦</div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Hover overlay with quick-add */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className={`text-xs font-bold px-5 py-2 rounded-xl transition-all duration-200 shadow-lg
                ${added
                  ? "bg-green-500 text-white scale-95"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:scale-105"}`}
            >
              {added ? "✓ Added!" : "Quick Add"}
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-yellow-400/80 text-[10px] font-bold uppercase tracking-widest mb-1.5">
          {product.category || "General"}
        </p>

        {/* Name */}
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-yellow-50 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xs ${i < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-600"}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-500 text-xs">({product.numReviews || 0})</span>
        </div>

        {/* Price + Stock */}
        <div className="flex items-center justify-between">
          <p className="text-white font-black text-lg">
            ₹{product.price?.toLocaleString()}
          </p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
            ${product.stock > 0
              ? "bg-green-500/15 text-green-400 border border-green-500/20"
              : "bg-red-500/15 text-red-400 border border-red-500/20"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;