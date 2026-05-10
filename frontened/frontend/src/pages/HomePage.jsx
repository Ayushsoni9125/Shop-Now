import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const BASE_URL = "http://localhost:3200/api";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"];

const FEATURES = [
  { icon: "🚀", title: "Free & Fast Delivery", desc: "On all orders above ₹499" },
  { icon: "🔒", title: "Secure Payments", desc: "100% protected transactions" },
  { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: "🎧", title: "24/7 Support", desc: "Round-the-clock assistance" },
];

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [heroVisible, setHeroVisible] = useState(false);
  const navigate = useNavigate();
  const productsSectionRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const cat = activeCategory !== "All" ? `&category=${activeCategory}` : "";
        const { data } = await axios.get(
          `${BASE_URL}/products?page=${page}&limit=8&keyword=${keyword}${cat}`
        );
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, keyword, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1);
    setActiveCategory("All");
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setKeyword("");
    setSearchInput("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a]">

      {/* ─── HERO SECTION ─────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-10 right-0 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          {/* Grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        <div className={`relative z-10 max-w-5xl mx-auto px-6 py-24 text-center transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
            New arrivals just dropped — Shop Now
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Discover
            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Premium Products
            </span>
            <span className="text-4xl sm:text-5xl lg:text-6xl text-gray-300 font-bold">at Best Prices</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Thousands of curated products from top brands. Free delivery, easy returns, and 24/7 support.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-0 max-w-xl mx-auto mb-10 shadow-2xl shadow-yellow-400/10">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔍</span>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search for phones, shoes, books..."
                className="w-full bg-white/8 border border-white/15 border-r-0 rounded-l-2xl px-5 py-4 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:bg-white/12 transition-all text-sm backdrop-blur-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-7 py-4 rounded-r-2xl hover:from-yellow-300 hover:to-yellow-400 transition-all whitespace-nowrap text-sm shadow-lg shadow-yellow-400/25"
            >
              Search
            </button>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {["iPhone 15", "Headphones", "Sneakers", "Watches"].map(term => (
              <button
                key={term}
                onClick={() => { setSearchInput(term); setKeyword(term); setPage(1); setActiveCategory("All"); }}
                className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-full hover:border-yellow-400/40 hover:text-yellow-400 transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STATS BAR ────────────────────────────────────────── */}
      <div className="border-y border-white/5 bg-white/2">
        <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: "50K+", label: "Happy Customers" },
            { value: "10K+", label: "Products" },
            { value: "4.8★", label: "Avg. Rating" },
            { value: "Free", label: "Delivery" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-yellow-400 font-black text-2xl">{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── PRODUCTS SECTION ─────────────────────────────────── */}
      <div ref={productsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Our Collection</p>
            <h2 className="text-3xl font-black text-white">
              {keyword ? `Results for "${keyword}"` : activeCategory !== "All" ? activeCategory : "Latest Products"}
            </h2>
            {!loading && (
              <p className="text-gray-500 text-sm mt-1">{totalProducts} products available</p>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                  ${activeCategory === cat
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg shadow-yellow-400/20"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-white/8" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-white/8 rounded w-1/3" />
                  <div className="h-4 bg-white/8 rounded w-2/3" />
                  <div className="h-3 bg-white/8 rounded w-1/2" />
                  <div className="h-6 bg-white/8 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-400 font-semibold text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-300 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white font-bold text-xl mb-2">No Products Found</h3>
            <p className="text-gray-400 mb-6">Try a different keyword or category</p>
            <button
              onClick={() => { setKeyword(""); setSearchInput(""); setActiveCategory("All"); setPage(1); }}
              className="bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-300 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); productsSectionRef.current?.scrollIntoView({ behavior: "smooth" }); }} />
            </div>
          </>
        )}
      </div>

      {/* ─── FEATURES SECTION ─────────────────────────────────── */}
      <div className="border-t border-white/5 bg-white/2">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">Why ShopNow?</p>
            <h2 className="text-3xl font-black text-white">Shopping, Reimagined</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white/4 border border-white/8 rounded-2xl p-6 text-center hover:border-yellow-400/30 hover:bg-white/6 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-white font-bold mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA BANNER ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400/15 via-yellow-500/10 to-orange-400/10 border border-yellow-400/20 p-10 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <p className="text-yellow-400 font-bold text-sm uppercase tracking-widest mb-3">Limited Time Offer</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Get 20% Off Your First Order
            </h2>
            <p className="text-gray-400 mb-7 max-w-sm mx-auto">
              Sign up today and use code <span className="text-yellow-400 font-bold">FIRST20</span> at checkout.
            </p>
            <Link
              to="/register"
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-black px-8 py-3.5 rounded-2xl hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-xl shadow-yellow-400/20 text-sm"
            >
              Create Free Account →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HomePage;