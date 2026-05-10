import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

function Navbar() {
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f1a]/90 backdrop-blur-xl border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center text-gray-900 font-black text-sm shadow-lg shadow-yellow-400/25 group-hover:shadow-yellow-400/40 transition-all">
            S
          </div>
          <span className="text-white font-black text-xl tracking-tight">
            Shop<span className="text-yellow-400">Now</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-1">

          {/* Cart */}
          <Link
            to="/cart"
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${location.pathname === "/cart" ? "text-yellow-400 bg-yellow-400/10" : "text-gray-300 hover:text-white hover:bg-white/8"}`}
          >
            <span className="text-base">🛒</span>
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce-once">
                {totalItems}
              </span>
            )}
          </Link>

          {userInfo ? (
            <>
              <Link
                to="/profile"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${location.pathname === "/profile" ? "text-yellow-400 bg-yellow-400/10" : "text-gray-300 hover:text-white hover:bg-white/8"}`}
              >
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center text-gray-900 text-xs font-black">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{userInfo.name}</span>
              </Link>
              {userInfo.isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${location.pathname.startsWith("/admin") ? "text-purple-400 bg-purple-400/10" : "text-gray-300 hover:text-purple-400 hover:bg-purple-400/8"}`}
                >
                  ⚙️ Admin
                </Link>
              )}
              <button
                onClick={logoutHandler}
                className="ml-1 bg-red-500/15 border border-red-500/25 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-500/25 hover:border-red-400/40 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/8 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-5 py-2 rounded-xl text-sm font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <Link to="/cart" className="relative text-gray-300 p-2">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/8 transition-all"
          >
            <div className={`w-5 h-0.5 bg-current transition-all mb-1.5 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-5 h-0.5 bg-current transition-all mb-1.5 ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/8 bg-[#0b0f1a]/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-2">
          {userInfo ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-gray-900 font-black">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{userInfo.name}</p>
                  <p className="text-gray-500 text-xs">{userInfo.email}</p>
                </div>
              </div>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/8 font-semibold text-sm">👤 My Profile</Link>
              {userInfo.isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-purple-400 px-3 py-2.5 rounded-xl hover:bg-purple-400/8 font-semibold text-sm">⚙️ Admin Panel</Link>
              )}
              <button onClick={logoutHandler} className="text-left text-red-400 px-3 py-2.5 rounded-xl hover:bg-red-400/8 font-semibold text-sm">🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/8 font-semibold text-sm">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-yellow-400 text-gray-900 px-3 py-2.5 rounded-xl font-bold text-sm text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;