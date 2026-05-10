import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "http://localhost:3200/api";

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
      gradient: "from-yellow-400/20 to-yellow-500/10",
      border: "border-yellow-400/30",
      textColor: "text-yellow-400",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: "📋",
      gradient: "from-blue-400/20 to-blue-500/10",
      border: "border-blue-400/30",
      textColor: "text-blue-400",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      gradient: "from-purple-400/20 to-purple-500/10",
      border: "border-purple-400/30",
      textColor: "text-purple-400",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      gradient: "from-orange-400/20 to-orange-500/10",
      border: "border-orange-400/30",
      textColor: "text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">⚙️ Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, {userInfo?.name}. Here's your overview.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-400/30 transition-all"
            >
              📦 Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="bg-blue-400/20 border border-blue-400/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-400/30 transition-all"
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
                  className={`bg-gradient-to-br ${card.gradient} border ${card.border} rounded-2xl p-5 backdrop-blur-sm hover:scale-105 transition-all duration-200 cursor-default`}
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <div className={`text-2xl font-black ${card.textColor}`}>{card.value}</div>
                  <div className="text-gray-400 text-sm mt-1">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <Link
                to="/admin/products"
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/40 hover:bg-white/8 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-yellow-400/20 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-yellow-400/30 transition-all">
                    📦
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors">Product Management</h3>
                    <p className="text-gray-400 text-sm">Add, edit, and delete products</p>
                    <p className="text-yellow-400/60 text-xs mt-1">{stats.totalProducts} products total →</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/orders"
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-400/40 hover:bg-white/8 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-400/20 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-400/30 transition-all">
                    📋
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">Order Management</h3>
                    <p className="text-gray-400 text-sm">View and update all orders</p>
                    <p className="text-blue-400/60 text-xs mt-1">{stats.pendingOrders} pending orders →</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-white font-bold text-lg">🕐 Recent Orders</h2>
                <Link to="/admin/orders" className="text-yellow-400 text-sm hover:underline">
                  View All →
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-white/10">
                        <th className="text-left pb-3 font-semibold">Order ID</th>
                        <th className="text-left pb-3 font-semibold">Customer</th>
                        <th className="text-left pb-3 font-semibold">Date</th>
                        <th className="text-left pb-3 font-semibold">Total</th>
                        <th className="text-left pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 font-mono text-yellow-400 text-xs">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="py-3 text-gray-300">{order.user?.name || "—"}</td>
                          <td className="py-3 text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="py-3 text-white font-semibold">₹{order.totalPrice.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border
                              ${order.isDelivered
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : order.isPaid
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : "bg-orange-500/20 text-orange-400 border-orange-500/30"}`}>
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
