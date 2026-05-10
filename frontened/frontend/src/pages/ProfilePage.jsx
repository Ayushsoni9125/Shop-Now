import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "https://shop-now-5has.onrender.com/api";

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
    if (order.isDelivered) return { bg: "bg-green-50 dark:bg-green-500/10", text: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-500/20", label: "Delivered" };
    if (order.isPaid) return { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/20", label: "Shipped" };
    return { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-500/20", label: "Processing" };
  };

  return (
    <div className="py-10 px-4 min-h-screen transition-colors">
      <div className="max-w-5xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-400/20 rounded-2xl flex items-center justify-center text-gray-900 dark:text-yellow-400 text-3xl font-black shadow-sm shrink-0 transition-colors">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">{userInfo?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">📧 {userInfo?.email}</p>
            {userInfo?.isAdmin && (
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 font-semibold mt-2 transition-colors">
                ⚙️ Administrator
              </span>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            {userInfo?.isAdmin && (
              <Link
                to="/admin"
                className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all"
              >
                ⚙️ Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-300 dark:hover:border-red-500/50 transition-all"
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
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-4 text-center hover:border-yellow-400 dark:hover:border-yellow-400/50 transition-all">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-black text-gray-900 dark:text-white transition-colors">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">{stat.label}</div>
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
                  ? "bg-gray-900 dark:bg-yellow-400 text-white dark:text-gray-900 shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"}`}
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
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 text-center text-red-600 dark:text-red-400 transition-colors">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-12 text-center transition-colors">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2 transition-colors">No Orders Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors">You haven't placed any orders yet.</p>
                <Link
                  to="/"
                  className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all inline-block shadow-sm"
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
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-5 hover:border-yellow-400 dark:hover:border-yellow-400/50 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-gray-900 dark:text-white font-bold group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors font-mono text-sm">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-semibold border ${status.bg} ${status.text} ${status.border} transition-colors`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 transition-colors">
                            🗓 {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 transition-colors">
                            {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                            {" · "}
                            {order.orderItems.slice(0, 2).map(i => i.name).join(", ")}
                            {order.orderItems.length > 2 ? ` +${order.orderItems.length - 2} more` : ""}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-gray-900 dark:text-white font-black text-lg transition-colors">₹{order.totalPrice.toLocaleString()}</p>
                          <p className="text-blue-600 dark:text-blue-400 text-xs mt-1 font-medium group-hover:underline transition-colors">View Details →</p>
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
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-6 transition-colors">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-6 transition-colors">Account Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: userInfo?.name, icon: "👤" },
                { label: "Email Address", value: userInfo?.email, icon: "📧" },
                { label: "Account Type", value: userInfo?.isAdmin ? "Administrator" : "Customer", icon: "🏷️" },
                { label: "Member Since", value: "Active Member", icon: "🎖️" },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 transition-colors">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 flex items-center gap-1 transition-colors">{item.icon} {item.label}</p>
                  <p className="text-gray-900 dark:text-white font-semibold transition-colors">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-200 dark:border-yellow-400/20 rounded-xl transition-colors">
              <p className="text-yellow-700 dark:text-yellow-400 text-sm font-semibold mb-1 transition-colors">🔐 Password</p>
              <p className="text-yellow-600 dark:text-yellow-500 text-xs transition-colors">Password management will be available in a future update.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfilePage;
