import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "http://localhost:3200/api";

function ProfilePage() {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusColor = (order) => {
    if (order.isDelivered) return { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", label: "Delivered" };
    if (order.isPaid) return { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", label: "Shipped" };
    return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", label: "Processing" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/5 border border-yellow-400/20 rounded-2xl p-6 mb-8 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-gray-900 text-3xl font-black shadow-lg shadow-yellow-400/20 shrink-0">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">{userInfo?.name}</h1>
            <p className="text-gray-400 text-sm mt-1">📧 {userInfo?.email}</p>
            {userInfo?.isAdmin && (
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold mt-2">
                ⚙️ Administrator
              </span>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            {userInfo?.isAdmin && (
              <Link
                to="/admin"
                className="bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-500/30 transition-all"
              >
                ⚙️ Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: orders.length, icon: "📋" },
            { label: "Paid", value: orders.filter(o => o.isPaid).length, icon: "💳" },
            { label: "Delivered", value: orders.filter(o => o.isDelivered).length, icon: "✅" },
            { label: "Total Spent", value: `₹${orders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}`, icon: "💰" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm hover:border-yellow-400/30 transition-all">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-black text-yellow-400">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "orders", label: "📋 Order History" },
            { id: "account", label: "👤 Account Info" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${activeTab === tab.id
                  ? "bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/20"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Order History Tab */}
        {activeTab === "orders" && (
          <div>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center text-red-400">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-white font-bold text-xl mb-2">No Orders Yet</h3>
                <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
                <Link
                  to="/"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all inline-block"
                >
                  🛍️ Start Shopping
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => {
                  const status = getStatusColor(order);
                  return (
                    <Link
                      to={`/order/${order._id}`}
                      key={order._id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-yellow-400/30 hover:bg-white/8 transition-all duration-200 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-white font-bold group-hover:text-yellow-400 transition-colors font-mono text-sm">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            🗓 {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                            {" · "}
                            {order.orderItems.slice(0, 2).map(i => i.name).join(", ")}
                            {order.orderItems.length > 2 ? ` +${order.orderItems.length - 2} more` : ""}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-yellow-400 font-black text-lg">₹{order.totalPrice.toLocaleString()}</p>
                          <p className="text-gray-500 text-xs mt-1">View Details →</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Account Info Tab */}
        {activeTab === "account" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-white font-bold text-lg mb-6">Account Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: userInfo?.name, icon: "👤" },
                { label: "Email Address", value: userInfo?.email, icon: "📧" },
                { label: "Account Type", value: userInfo?.isAdmin ? "Administrator" : "Customer", icon: "🏷️" },
                { label: "Member Since", value: "Active Member", icon: "🎖️" },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">{item.icon} {item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
              <p className="text-yellow-400 text-sm font-semibold mb-1">🔐 Password</p>
              <p className="text-gray-400 text-xs">Password management will be available in a future update.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfilePage;
