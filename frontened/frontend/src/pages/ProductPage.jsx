import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import Loader from "../components/Loader";

const BASE_URL = "http://localhost:3200/api";

function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate("/cart");
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center py-20">{error}</p>;
  if (!product) return null;

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 font-semibold transition-colors"
        >
          ← Back to Products
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 grid grid-cols-1 md:grid-cols-2 gap-10 transition-colors">

          {/* Product Image */}
          <div className="w-full h-80 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center p-4 border border-gray-100 dark:border-gray-800 transition-colors">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">

            {/* Category */}
            <p className="text-yellow-500 font-semibold uppercase text-sm tracking-widest">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              <span className="text-gray-600 dark:text-gray-400 transition-colors">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-black text-gray-900 dark:text-white transition-colors">
              ₹{product.price.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 transition-colors leading-relaxed">
              {product.description}
            </p>

            {/* Stock */}
            <p className={`font-semibold px-3 py-1.5 w-fit rounded-lg ${product.stock === 0 ? "bg-red-50 dark:bg-red-500/10 text-red-500" : "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"} transition-colors`}>
              {product.stock === 0 ? "Out of Stock" : `In Stock (${product.stock} left)`}
            </p>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mt-2">
                <label className="text-gray-700 dark:text-gray-300 font-semibold transition-colors">Qty:</label>
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-yellow-400 dark:hover:bg-yellow-400 hover:text-gray-900 text-gray-600 dark:text-gray-300 font-bold text-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-gray-900 dark:text-white font-bold text-base border-x-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(q => Math.min(Math.min(product.stock, 10), q + 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-yellow-400 dark:hover:bg-yellow-400 hover:text-gray-900 text-gray-600 dark:text-gray-300 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400 dark:text-gray-500 text-sm transition-colors">
                  (max {Math.min(product.stock, 10)})
                </span>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={addToCartHandler}
              disabled={product.stock === 0}
              className="mt-4 bg-yellow-400 text-gray-900 font-bold py-3.5 rounded-xl hover:bg-yellow-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;