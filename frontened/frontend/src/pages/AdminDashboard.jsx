import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "https://shop-now-5has.onrender.com/api";

function AdminDashboard() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${userInfo.token}` };

        const [ordersRes, productsRes] = await Promise.all([
          axios.get(`${BASE_URL}/orders`, { headers }),
          axios.get(`${BASE_URL}/products`, { headers }),
        ]);

        const orders = ordersRes.data;
        const products = productsRes.data.products || productsRes.data;

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
          pendingOrders: orders.filter(o => !o.isPaid).length,
        });

        setRecentOrders(
          [...orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo, navigate]);

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: "💰",
      bg: "bg-yellow-50 dark:bg-yellow-500/10",
      border: "border-yellow-200 dark:border-yellow-500/20",
      textColor: "text-yellow-700 dark:text-yellow-400",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: "📋",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-500/20",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      bg: "bg-purple-50 dark:bg-purple-500/10",
      border: "border-purple-200 dark:border-purple-500/20",
      textColor: "text-purple-700 dark:text-purple-400",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      bg: "bg-orange-50 dark:bg-orange-500/10",
      border: "border-orange-200 dark:border-orange-500/20",
      textColor: "text-orange-700 dark:text-orange-400",
    },
  ];

  return (
    <div className="py-10 px-4 min-h-[calc(100vh-64px)] transition-colors">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors">⚙️ Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Welcome back, {userInfo?.name}. Here's your overview.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              📦 Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              📋 Manage Orders
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statCards.map((card, i) => (
                <div
                  key={i}
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-default`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 ${card.bg} ${card.border} border transition-colors`}>
                    {card.icon}
                  </div>
                  <div className={`text-2xl font-black text-gray-900 dark:text-white transition-colors`}>{card.value}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <Link
                to="/admin/products"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-6 hover:border-yellow-400 dark:hover:border-yellow-500/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-yellow-50 dark:bg-yellow-500/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-yellow-100 dark:group-hover:bg-yellow-500/20 transition-all">
                    📦
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Product Management</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Add, edit, and delete products</p>
                    <p className="text-yellow-600 dark:text-yellow-400 font-semibold text-xs mt-1 transition-colors">{stats.totalProducts} products total →</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/orders"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-6 hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-all">
                    📋
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Order Management</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">View and update all orders</p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs mt-1 transition-colors">{stats.pendingOrders} pending orders →</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-6 transition-colors">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-gray-900 dark:text-white font-bold text-lg transition-colors">🕐 Recent Orders</h2>
                <Link to="/admin/orders" className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm hover:underline transition-colors">
                  View All →
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-xl transition-colors">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 transition-colors">
                        <th className="text-left pb-3 font-semibold">Order ID</th>
                        <th className="text-left pb-3 font-semibold">Customer</th>
                        <th className="text-left pb-3 font-semibold">Date</th>
                        <th className="text-left pb-3 font-semibold">Total</th>
                        <th className="text-left pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-3 font-mono text-gray-900 dark:text-white font-bold text-xs transition-colors">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="py-3 text-gray-700 dark:text-gray-300 transition-colors">{order.user?.name || "—"}</td>
                          <td className="py-3 text-gray-500 dark:text-gray-400 transition-colors">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="py-3 text-gray-900 dark:text-white font-bold transition-colors">₹{order.totalPrice.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors
                              ${order.isDelivered
                                ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                                : order.isPaid
                                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                                  : "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20"}`}>
                              {order.isDelivered ? "Delivered" : order.isPaid ? "Shipped" : "Processing"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
