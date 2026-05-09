import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-400">
          ShopNow
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link to="/cart" className="hover:text-yellow-400">
            🛒 Cart
          </Link>

          {userInfo ? (
            <>
              <Link to="/profile" className="hover:text-yellow-400">
                👤 {userInfo.name}
              </Link>
              {userInfo.isAdmin && (
                <Link to="/admin" className="hover:text-yellow-400">
                  ⚙️ Admin
                </Link>
              )}
              <button
                onClick={logoutHandler}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-500"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;