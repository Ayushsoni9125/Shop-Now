import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    console.log("success:", success);
    if (success) {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full max-w-md transition-colors">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center transition-colors">
          Login
        </h1>

        {/* Error Message */}
        {error && (
          <p className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-center transition-colors">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1 transition-colors">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1 transition-colors">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition-colors duration-200 disabled:opacity-50 shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 transition-colors">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline transition-colors">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;