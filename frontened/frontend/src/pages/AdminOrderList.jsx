import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "http://localhost:3200/api";

function AdminOrderList() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  useEffect(() => {
    if (!userInfo?.isAdmin) { navigate("/"); return; }
    fetchOrders();
  }, [userInfo, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/orders`, { headers });
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const markDelivered = async (orderId) => {
    try {
      setUpdatingId(orderId);
      const { data } = await axios.put(`${BASE_URL}/orders/${orderId}/deliver`, {}, { headers });
      setOrders(prev => prev.map(o => o._id === orderId ? data : o));
      showSuccess("Order marked as delivered!");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const markPaid = async (orderId) => {
    try {
      setUpdatingId(orderId);
      const { data } = await axios.put(`${BASE_URL}/orders/${orderId}/pay`, {}, { headers });
      setOrders(prev => prev.map(o => o._id === orderId ? data : o));
      showSuccess("Order marked as paid!");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatus = (order) => {
    if (order.isDelivered) return { label: "Delivered", bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" };
    if (order.isPaid) return { label: "Shipped", bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" };
    return { label: "Processing", bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" };
  };

  const filteredOrders = orders.filter(order => {
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && !order.isPaid) ||
      (filterStatus === "paid" && order.isPaid && !order.isDelivered) ||
      (filterStatus === "delivered" && order.isDelivered);

    const query = searchQuery.toLowerCase();
    const matchSearch =
      !query ||
      order._id.toLowerCase().includes(query) ||
      order.user?.name?.toLowerCase().includes(query) ||
      order.user?.email?.toLowerCase().includes(query);

    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link to="/admin" className="hover:text-yellow-400 transition-colors">Dashboard</Link>
              <span>›</span>
              <span className="text-gray-300">Orders</span>
            </div>
            <h1 className="text-3xl font-black text-white">📋 Order Management</h1>
            <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl p-3 mb-4 text-sm flex items-center gap-2">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "all", label: "All Orders" },
              { id: "pending", label: "⏳ Pending" },
              { id: "paid", label: "💳 Paid" },
              { id: "delivered", label: "✅ Delivered" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${filterStatus === f.id
                    ? "bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/20"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 sm:max-w-xs">
            <input
              type="text"
              placeholder="🔍 Search by ID, name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all"
            />
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-white font-bold text-xl mb-1">No Orders Found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map(order => {
              const status = getStatus(order);
              const isUpdating = updatingId === order._id;
              return (
                <div
                  key={order._id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all backdrop-blur-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

                    {/* Left: Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-yellow-400 font-bold text-sm">
                          #{order._id.slice(-10).toUpperCase()}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs font-semibold mb-0.5">CUSTOMER</p>
                          <p className="text-white">{order.user?.name || "Unknown"}</p>
                          <p className="text-gray-400 text-xs">{order.user?.email || "—"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-semibold mb-0.5">ORDER DATE</p>
                          <p className="text-white">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-semibold mb-0.5">SHIPPING TO</p>
                          <p className="text-white text-xs">{order.shippingAddress?.address}</p>
                          <p className="text-gray-400 text-xs">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                        </div>
                      </div>

                      {/* Items preview */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.orderItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1 border border-white/10">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-5 h-5 object-cover rounded"
                              onError={e => { e.target.style.display = "none"; }}
                            />
                            <span className="text-gray-300 text-xs">{item.name} ×{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                      <p className="text-yellow-400 font-black text-xl">₹{order.totalPrice.toLocaleString()}</p>

                      <div className="flex gap-2 flex-wrap lg:justify-end">
                        {!order.isPaid && (
                          <button
                            onClick={() => markPaid(order._id)}
                            disabled={isUpdating}
                            className="bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-all disabled:opacity-50"
                          >
                            {isUpdating ? "..." : "💳 Mark Paid"}
                          </button>
                        )}
                        {order.isPaid && !order.isDelivered && (
                          <button
                            onClick={() => markDelivered(order._id)}
                            disabled={isUpdating}
                            className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-500/30 transition-all disabled:opacity-50"
                          >
                            {isUpdating ? "..." : "🚚 Mark Delivered"}
                          </button>
                        )}
                        <Link
                          to={`/order/${order._id}`}
                          className="bg-white/10 border border-white/20 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/15 transition-all"
                        >
                          👁️ View
                        </Link>
                      </div>

                      <div className="flex gap-2 text-xs text-gray-500">
                        <span className={order.isPaid ? "text-green-400" : "text-orange-400"}>
                          {order.isPaid ? "✅ Paid" : "⏳ Unpaid"}
                        </span>
                        <span>·</span>
                        <span className={order.isDelivered ? "text-green-400" : "text-gray-500"}>
                          {order.isDelivered ? "✅ Delivered" : "📦 Not Delivered"}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminOrderList;
