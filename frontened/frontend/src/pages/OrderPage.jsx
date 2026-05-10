import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "http://localhost:3200/api";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <Link to="/" className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-8 text-center backdrop-blur-sm">
          <div className="text-5xl mb-3 animate-bounce">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-1">Order Confirmed!</h1>
          <p className="text-gray-300">Thank you for your purchase. Your order has been placed successfully.</p>
          <p className="text-yellow-400 font-mono text-sm mt-2">Order ID: #{order._id}</p>
        </div>

        {/* Status Tracker */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-6">Order Status</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700 z-0"></div>
            {statusSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-2 z-10 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500
                  ${step.done
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-400/30"
                    : "bg-gray-700 border-2 border-gray-600"
                  }`}>
                  {step.icon}
                </div>
                <span className={`text-xs font-semibold ${step.done ? "text-yellow-400" : "text-gray-500"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Order Items */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">🛍️ Items Ordered</h2>
            <div className="flex flex-col gap-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/5 rounded-xl p-3 border border-white/10 hover:border-yellow-400/30 transition-all">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=No+Image"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{item.name}</p>
                    <p className="text-gray-400 text-sm">Qty: {item.qty}</p>
                  </div>
                  <span className="text-yellow-400 font-bold whitespace-nowrap">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary + Shipping */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Price Summary */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">💰 Price Details</h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{order.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <hr className="border-white/10 my-2" />
                <div className="flex justify-between text-white font-bold text-base">
                  <span>Total</span>
                  <span className="text-yellow-400">₹{order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold
                  ${order.isPaid ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"}`}>
                  {order.isPaid ? "✅ Paid" : "⏳ Pending Payment"}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold
                  ${order.isDelivered ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                  {order.isDelivered ? "✅ Delivered" : "📦 Processing"}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">📍 Shipping Address</h2>
              <div className="text-gray-300 text-sm space-y-1">
                <p>{order.shippingAddress.address}</p>
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
            className="flex-1 text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-400/20"
          >
            🛍️ Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="flex-1 text-center bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all duration-200"
          >
            📋 View My Orders
          </Link>
        </div>

      </div>
    </div>
  );
}

export default OrderPage;
