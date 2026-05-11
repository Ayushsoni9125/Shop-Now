import { createContext, useState, useContext } from "react";
import axios from "axios";
import Toast from "../components/Toast";

const BASE_URL = "https://shop-now-5has.onrender.com/api";

// Create Context
const AuthContext = createContext();

// Provider Component
export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Show Toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });
      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      showToast("Logged in successfully!");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      showToast(err.response?.data?.message || "Login failed", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name, email, password, isAdmin) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(`${BASE_URL}/users/register`, {
        name,
        email,
        password,
        isAdmin,
      });
      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      showToast("Registered successfully!");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
      showToast(err.response?.data?.message || "Register failed", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
    showToast("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{ userInfo, loading, error, login, register, logout }}
    >
      {toast && <Toast message={toast.message} type={toast.type} />}
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}