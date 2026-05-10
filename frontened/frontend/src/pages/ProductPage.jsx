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
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-gray-600 hover:text-yellow-500 font-semibold"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Product Image */}
          <div className="w-full h-80 overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">

            {/* Category */}
            <p className="text-yellow-500 font-semibold uppercase text-sm">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-800">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              <span className="text-gray-600">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-gray-600">{product.description}</p>

            {/* Stock */}
            <p className={`font-semibold ${product.stock === 0 ? "text-red-500" : "text-green-500"}`}>
              {product.stock === 0 ? "Out of Stock" : `In Stock (${product.stock} left)`}
            </p>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-gray-700 font-semibold">Qty:</label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-yellow-400 hover:text-gray-900 text-gray-600 font-bold text-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-gray-900 font-bold text-base border-x-2 border-gray-200 bg-white">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(q => Math.min(Math.min(product.stock, 10), q + 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-yellow-400 hover:text-gray-900 text-gray-600 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400 text-sm">
                  (max {Math.min(product.stock, 10)})
                </span>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={addToCartHandler}
              disabled={product.stock === 0}
              className="bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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