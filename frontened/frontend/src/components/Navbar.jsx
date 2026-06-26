import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

function Navbar() {
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center text-gray-900 font-black text-sm shadow-md">
            S
          </div>
          <span className="text-gray-900 dark:text-white font-black text-xl tracking-tight transition-colors">
            Shop<span className="text-yellow-500">Now</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex items-center gap-1">

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 mr-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${isActive("/") ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-400/10" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
            Home
          </Link>

          {/* Cart */}
          <Link to="/cart" className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${isActive("/cart") ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-400/10" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
            <span>🛒</span>
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </Link>

          {userInfo ? (
            <>
              <Link to="/profile" className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                ${isActive("/profile") ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-400/10" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-md flex items-center justify-center text-gray-900 text-xs font-black">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[90px] truncate">{userInfo.name}</span>
              </Link>

              {userInfo.isAdmin && (
                <>
                  <Link to="/admin" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                    ${location.pathname.startsWith("/admin") ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10"}`}>
                    ⚙️ Admin
                  </Link>
                  <Link to="/admin/products?action=add"
                    className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-green-500/30">
                    ＋ Add Product
                  </Link>
                </>
              )}

              <button onClick={logoutHandler}
                className="ml-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/30 transition-all">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Login
              </Link>
              <Link to="/register"
                className="bg-gray-900 dark:bg-yellow-400 text-white dark:text-gray-900 px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-yellow-300 transition-all shadow-md shadow-yellow-400/30">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex sm:hidden items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(m => !m)}
            className="text-gray-600 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <div className={`w-5 h-0.5 bg-current transition-all mb-1.5 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-5 h-0.5 bg-current transition-all mb-1.5 ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 flex flex-col gap-1 transition-colors">
          {userInfo ? (
            <>
              <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-2">
                <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-gray-900 font-black">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white text-sm font-bold">{userInfo.name}</p>
                  <p className="text-gray-400 dark:text-gray-400 text-xs">{userInfo.email}</p>
                </div>
              </div>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm">👤 My Profile</Link>
              {userInfo.isAdmin && (
                <>
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 font-semibold text-sm">⚙️ Admin Panel</Link>
                  <Link to="/admin/products?action=add" onClick={() => setMenuOpen(false)} className="bg-green-500 text-white px-3 py-2.5 rounded-xl font-bold text-sm text-center hover:bg-green-400 transition-all">＋ Add Product</Link>
                </>
              )}
              <button onClick={logoutHandler} className="text-left text-red-500 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold text-sm">🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-gray-900 dark:bg-yellow-400 text-white dark:text-gray-900 px-3 py-2.5 rounded-xl font-bold text-sm text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;