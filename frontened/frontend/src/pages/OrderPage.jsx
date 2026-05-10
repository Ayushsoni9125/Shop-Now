import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "https://shop-now-5has.onrender.com/api";

function OrderPage() {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) fetchOrder();
  }, [id, userInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0b0f1a] flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0b0f1a] flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Error</h2>
          <p className="text-red-500 mb-6 transition-colors">{error}</p>
          <Link to="/" className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all shadow-md">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusSteps = [
    { label: "Order Placed", done: true, icon: "📋" },
    { label: "Payment", done: order.isPaid, icon: "💳" },
    { label: "Shipped", done: order.isDelivered, icon: "📦" },
    { label: "Delivered", done: order.isDelivered, icon: "✅" },
  ];

  return (
    <div className="py-10 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">

        {/* Success Banner */}
        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-6 mb-8 text-center transition-colors">
          <div className="text-5xl mb-3 animate-bounce">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">Order Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">Thank you for your purchase. Your order has been placed successfully.</p>
          <p className="text-green-700 dark:text-green-400 font-mono text-sm mt-2 font-semibold transition-colors">Order ID: #{order._id}</p>
        </div>

        {/* Status Tracker */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-6 mb-6 transition-colors">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 transition-colors">Order Status</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 z-0 transition-colors"></div>
            {statusSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-2 z-10 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500
                  ${step.done
                    ? "bg-yellow-400 text-gray-900 shadow-md shadow-yellow-400/20"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border-2 border-gray-200 dark:border-gray-700"
                  }`}>
                  {step.icon}
                </div>
                <span className={`text-xs font-semibold ${step.done ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"} transition-colors`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Order Items */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-6 transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors">🛍️ Items Ordered</h2>
            <div className="flex flex-col gap-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=No+Image"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-semibold truncate transition-colors">{item.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Qty: {item.qty}</p>
                  </div>
                  <span className="text-gray-900 dark:text-white font-bold whitespace-nowrap transition-colors">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary + Shipping */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Price Summary */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-6 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors">💰 Price Details</h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 transition-colors">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors">₹{order.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 transition-colors">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400 font-medium transition-colors">Free</span>
                </div>
                <hr className="border-gray-100 dark:border-gray-700 my-2 transition-colors" />
                <div className="flex justify-between text-gray-900 dark:text-white font-bold text-base transition-colors">
                  <span>Total</span>
                  <span className="text-gray-900 dark:text-white transition-colors">₹{order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <span className={`inline-flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg font-semibold transition-colors
                  ${order.isPaid ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400" : "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400"}`}>
                  {order.isPaid ? "✅ Paid Successfully" : "⏳ Pending Payment"}
                </span>
                <span className={`inline-flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg font-semibold transition-colors
                  ${order.isDelivered ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400" : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"}`}>
                  {order.isDelivered ? "✅ Delivered" : "📦 Order Processing"}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-6 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 transition-colors">📍 Shipping Address</h2>
              <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                <p className="font-medium text-gray-800 dark:text-gray-200 transition-colors">{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6 flex-wrap">
          <Link
            to="/"
            className="flex-1 text-center bg-yellow-400 text-gray-900 font-bold py-3.5 rounded-xl hover:bg-yellow-300 transition-all duration-200 shadow-md"
          >
            🛍️ Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="flex-1 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
          >
            📋 View My Orders
          </Link>
        </div>

      </div>
    </div>
  );
}

export default OrderPage;
