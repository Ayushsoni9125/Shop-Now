import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "https://shop-now-5has.onrender.com/api";

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
    if (order.isDelivered) return { label: "Delivered", bg: "bg-green-50 dark:bg-green-500/10", text: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-500/30" };
    if (order.isPaid) return { label: "Shipped", bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/30" };
    return { label: "Processing", bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-500/30" };
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
    <div className="min-h-[calc(100vh-64px)] py-10 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">
              <Link to="/admin" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">Dashboard</Link>
              <span>›</span>
              <span className="text-gray-400 dark:text-gray-500 transition-colors">Orders</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors">📋 Order Management</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">{orders.length} total orders</p>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 rounded-xl p-3 mb-4 text-sm flex items-center gap-2 transition-colors">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl p-3 mb-4 text-sm transition-colors">
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
                    ? "bg-gray-900 dark:bg-yellow-400 text-white dark:text-gray-900 shadow-md"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"}`}
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
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center shadow-sm transition-colors">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-900 dark:text-white font-bold text-xl mb-1 transition-colors">No Orders Found</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map(order => {
              const status = getStatus(order);
              const isUpdating = updatingId === order._id;
              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

                    {/* Left: Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-yellow-600 dark:text-yellow-400 font-bold text-sm transition-colors">
                          #{order._id.slice(-10).toUpperCase()}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${status.bg} ${status.text} ${status.border} transition-colors`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-0.5 transition-colors">CUSTOMER</p>
                          <p className="text-gray-900 dark:text-white font-medium transition-colors">{order.user?.name || "Unknown"}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors">{order.user?.email || "—"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-0.5 transition-colors">ORDER DATE</p>
                          <p className="text-gray-900 dark:text-white font-medium transition-colors">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors">{new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-0.5 transition-colors">SHIPPING TO</p>
                          <p className="text-gray-900 dark:text-white text-xs font-medium transition-colors">{order.shippingAddress?.address}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                        </div>
                      </div>

                      {/* Items preview */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.orderItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg px-2.5 py-1 border border-gray-100 dark:border-gray-700/50 transition-colors">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-5 h-5 object-cover rounded"
                              onError={e => { e.target.style.display = "none"; }}
                            />
                            <span className="text-gray-600 dark:text-gray-300 text-xs transition-colors">{item.name} ×{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                      <p className="text-gray-900 dark:text-white font-black text-xl transition-colors">₹{order.totalPrice.toLocaleString()}</p>

                      <div className="flex gap-2 flex-wrap lg:justify-end">
                        {!order.isPaid && (
                          <button
                            onClick={() => markPaid(order._id)}
                            disabled={isUpdating}
                            className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100 dark:hover:bg-green-500/20 transition-all disabled:opacity-50"
                          >
                            {isUpdating ? "..." : "💳 Mark Paid"}
                          </button>
                        )}
                        {order.isPaid && !order.isDelivered && (
                          <button
                            onClick={() => markDelivered(order._id)}
                            disabled={isUpdating}
                            className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all disabled:opacity-50"
                          >
                            {isUpdating ? "..." : "🚚 Mark Delivered"}
                          </button>
                        )}
                        <Link
                          to={`/order/${order._id}`}
                          className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                          👁️ View
                        </Link>
                      </div>

                      <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        <span className={order.isPaid ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}>
                          {order.isPaid ? "✅ Paid" : "⏳ Unpaid"}
                        </span>
                        <span>·</span>
                        <span className={order.isDelivered ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>
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
