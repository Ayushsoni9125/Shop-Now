import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://shop-now-5has.onrender.com/api";

function CheckoutPage() {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { cartItems, totalPrice, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [userInfo, cartItems, navigate]);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post(
        `${BASE_URL}/orders`,
        {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress: { address, city, postalCode, country },
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Shipping Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Shipping Address
            </h2>

            {error && (
              <p className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 transition-colors">
                {error}
              </p>
            )}

            <form onSubmit={placeOrderHandler} className="flex flex-col gap-4">

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 transition-colors">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 transition-colors">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 transition-colors">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Enter your postal code"
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 transition-colors">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter your country"
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-yellow-400 text-gray-900 font-bold py-3.5 rounded-xl hover:bg-yellow-300 transition-colors duration-200 disabled:opacity-50 shadow-md"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-fit transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Order Summary
            </h2>

            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between mb-3 text-sm">
                <span className="text-gray-600 dark:text-gray-400 transition-colors">
                  {item.name} x {item.qty}
                </span>
                <span className="text-gray-900 dark:text-white font-semibold transition-colors">
                  ₹{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}

            <hr className="my-4 border-gray-100 dark:border-gray-700 transition-colors" />

            <div className="flex justify-between">
              <span className="text-gray-900 dark:text-white font-bold transition-colors">Total</span>
              <span className="text-gray-900 dark:text-white font-black text-xl transition-colors">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;