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
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  const { cartItems, totalPrice, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (cartItems.length === 0) {
      navigate("/cart");
    }

    const checkNewUser = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setIsNewUser(data.length === 0);
      } catch (err) {
        console.error("Error checking new user status:", err);
      }
    };

    if (userInfo) {
      checkNewUser();
    }
  }, [userInfo, cartItems, navigate]);

  const applyPromoCode = () => {
    if (promoCode === "FIRST20") {
      if (isNewUser) {
        setDiscount(totalPrice * 0.2);
        setPromoApplied(true);
        setError(null);
      } else {
        setError("FIRST20 is only for first-time orders");
        setDiscount(0);
        setPromoApplied(false);
      }
    } else if (promoCode === "") {
        setDiscount(0);
        setPromoApplied(false);
        setError(null);
    } else {
      setError("Invalid promo code");
      setDiscount(0);
      setPromoApplied(false);
    }
  };

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
          promoCode: promoApplied ? promoCode : "",
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

            {/* Promo Code Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="FIRST20"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  onClick={applyPromoCode}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                  Code applied! 20% discount saved.
                </p>
              )}
            </div>

            {discount > 0 && (
              <div className="flex justify-between mb-2 text-sm text-green-600 dark:text-green-400 font-medium">
                <span>Discount (20%)</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <span className="text-gray-900 dark:text-white font-bold transition-colors">Total</span>
              <span className="text-gray-900 dark:text-white font-black text-xl transition-colors">
                ₹{(totalPrice - discount).toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;