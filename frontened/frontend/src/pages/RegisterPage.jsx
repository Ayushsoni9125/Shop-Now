import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const success = await register(name, email, password, isAdmin);
    if (success) {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full max-w-md transition-colors">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center transition-colors">
          Register
        </h1>

        {/* Error Message */}
        {error && (
          <p className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-center transition-colors">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="flex flex-col gap-4">

          {/* Name */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1 transition-colors">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

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

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1 transition-colors">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Account Type Toggle */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-2 transition-colors">Account Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="accountType"
                  checked={!isAdmin}
                  onChange={() => setIsAdmin(false)}
                  className="accent-yellow-500 w-4 h-4"
                />
                Regular User
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="accountType"
                  checked={isAdmin}
                  onChange={() => setIsAdmin(true)}
                  className="accent-yellow-500 w-4 h-4"
                />
                Admin
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-gray-900 dark:bg-yellow-400 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-yellow-300 font-bold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-md"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 transition-colors">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline transition-colors">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;