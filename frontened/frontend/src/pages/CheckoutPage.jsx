
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3200/api";

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

  // Redirect if not logged in
// ✅ Replace with this
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
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Shipping Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Shipping Address
            </h2>

            {error && (
              <p className="bg-red-100 text-red-500 p-3 rounded-lg mb-4">
                {error}
              </p>
            )}

            <form onSubmit={placeOrderHandler} className="flex flex-col gap-4">

              <div>
                <label className="block text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Enter your postal code"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter your country"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>

            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between mb-2">
                <span className="text-gray-600">
                  {item.name} x {item.qty}
                </span>
                <span className="text-gray-800 font-semibold">
                  ₹{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}

            <hr className="my-4" />

            <div className="flex justify-between">
              <span className="text-gray-800 font-bold">Total</span>
              <span className="text-gray-800 font-bold text-xl">
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