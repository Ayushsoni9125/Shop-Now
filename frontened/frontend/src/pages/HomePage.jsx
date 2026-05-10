import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const BASE_URL = "https://shop-now-5has.onrender.com/api";
const TABS = ["All", "Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"];

const CATEGORIES = [
  { name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop", count: "120+ items" },
  { name: "Clothing",    img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=300&fit=crop", count: "85+ items"  },
  { name: "Books",       img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop", count: "200+ items" },
  { name: "Home",        img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop", count: "60+ items"  },
  { name: "Sports",      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop", count: "90+ items"  },
  { name: "Beauty",      img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop", count: "75+ items"  },
];

const FEATURES = [
  { icon: "🚚", title: "Free Delivery",    desc: "On orders above ₹499" },
  { icon: "🔒", title: "Secure Payment",   desc: "100% protected"        },
  { icon: "↩️", title: "Easy Returns",     desc: "7-day return policy"   },
  { icon: "🎧", title: "24/7 Support",     desc: "Always here for you"   },
];

export default function HomePage() {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [keyword, setKeyword]           = useState("");
  const [searchInput, setSearchInput]   = useState("");
  const [activeTab, setActiveTab]       = useState("All");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const productsRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true); setError(null);
        const kw  = keyword   ? `&keyword=${encodeURIComponent(keyword)}`   : "";
        const cat = activeTab !== "All" ? `&category=${encodeURIComponent(activeTab)}` : "";
        const { data } = await axios.get(`${BASE_URL}/products?page=${page}&limit=8${kw}${cat}`);
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.totalProducts || 0);
      } catch { setError("Failed to load products."); }
      finally { setLoading(false); }
    };
    fetch();
  }, [page, keyword, activeTab, searchTrigger]);

  const handleSearch = (e) => {
    if (e?.preventDefault) e.preventDefault();
    setKeyword(searchInput.trim());
    setPage(1); setActiveTab("All");
    setSearchTrigger(t => t + 1);
    setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleTab = (tab) => {
    setActiveTab(tab); setKeyword(""); setSearchInput(""); setPage(1);
    setSearchTrigger(t => t + 1);
    setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0b0f1a] transition-colors duration-300">

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#0d1222] dark:to-[#0f162a] text-gray-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-yellow-400/20 dark:bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest transition-colors">
              🔥 New Arrivals
            </span>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4 text-gray-900 dark:text-white transition-colors">
              Shop <span className="text-yellow-500 dark:text-yellow-400">Premium</span><br />Products Online
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md transition-colors">
              Discover thousands of curated products from top brands with free delivery and easy returns.
            </p>
            {/* Search */}
            <div className="flex max-w-lg">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch(e)}
                placeholder="Search for products..."
                className="flex-1 px-5 py-3.5 rounded-l-xl text-sm bg-white dark:bg-gray-800 focus:outline-none placeholder-gray-400 text-gray-900 dark:text-white border border-transparent dark:border-gray-700 focus:border-yellow-400 dark:focus:border-yellow-400 transition-colors"
              />
              <button onClick={handleSearch} className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3.5 rounded-r-xl transition-all text-sm">
                Search
              </button>
            </div>
            <div className="flex gap-3 mt-4 flex-wrap">
              {["iPhone 15", "Sneakers", "Headphones", "Books"].map(t => (
                <button key={t} type="button" onClick={() => { setSearchInput(t); setKeyword(t); setPage(1); setActiveTab("All"); setSearchTrigger(n=>n+1); }}
                  className="text-xs bg-white/10 border border-white/20 text-gray-300 px-3 py-1.5 rounded-full hover:bg-yellow-400/20 hover:text-yellow-400 hover:border-yellow-400/40 transition-all">
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Hero image grid */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {[
              { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", label: "Sneakers" },
              { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", label: "Headphones" },
              { src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop", label: "Laptops" },
              { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop", label: "Watches" },
            ].map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 h-44" : "h-36"} border border-white/10 dark:border-white/5`}>
                <img src={img.src} alt={img.label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────── */}
      <div className="bg-yellow-400 dark:bg-yellow-500 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          {[["50K+","Happy Customers"],["34+","Products"],["4.8★","Avg Rating"],["Free","Delivery"]].map(([v,l],i) => (
            <div key={i} className="py-2">
              <p className="text-gray-900 font-black text-xl">{v}</p>
              <p className="text-gray-800 dark:text-gray-900 text-xs font-semibold">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-1">Browse</p>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">Shop by Category</h2>
          </div>
          <button onClick={() => handleTab("All")} className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-semibold transition-colors">View All →</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <button key={cat.name} onClick={() => handleTab(cat.name)}
              className="group flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-transparent dark:border-gray-800 group-hover:border-yellow-400 transition-all duration-200 shadow-sm">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <p className="text-gray-800 dark:text-gray-200 font-bold text-xs transition-colors">{cat.name}</p>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] transition-colors">{cat.count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── PROMO BANNERS ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative rounded-2xl overflow-hidden h-44 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 flex items-center px-8 cursor-pointer hover:shadow-xl transition-all"
          onClick={() => handleTab("Electronics")}>
          <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=220&fit=crop" alt="Electronics" className="absolute right-0 h-full w-1/2 object-cover opacity-40 dark:opacity-30" />
          <div className="relative z-10">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Up to 30% off</p>
            <h3 className="text-white font-black text-2xl leading-tight">Latest<br />Electronics</h3>
            <button className="mt-3 bg-white text-blue-700 dark:text-blue-900 text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-all">Shop Now →</button>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden h-44 bg-gradient-to-r from-rose-500 to-orange-500 dark:from-rose-900 dark:to-orange-900 flex items-center px-8 cursor-pointer hover:shadow-xl transition-all"
          onClick={() => handleTab("Clothing")}>
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=220&fit=crop" alt="Fashion" className="absolute right-0 h-full w-1/2 object-cover opacity-40 dark:opacity-30" />
          <div className="relative z-10">
            <p className="text-rose-100 text-xs font-bold uppercase tracking-widest mb-1">New Season</p>
            <h3 className="text-white font-black text-2xl leading-tight">Trending<br />Fashion</h3>
            <button className="mt-3 bg-white text-rose-600 dark:text-rose-900 text-xs font-bold px-4 py-2 rounded-lg hover:bg-rose-50 transition-all">Shop Now →</button>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ──────────────────────────────────────── */}
      <div ref={productsRef} className="max-w-7xl mx-auto px-6 pb-16">
        {/* Header + tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-1">Our Collection</p>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">
              {keyword ? `Results for "${keyword}"` : activeTab !== "All" ? activeTab : "Featured Products"}
            </h2>
            {!loading && <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5 transition-colors">{totalProducts} products</p>}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8 border-b border-gray-200 dark:border-gray-800 pb-4 transition-colors">
          {TABS.map(tab => (
            <button key={tab} onClick={() => handleTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${activeTab === tab
                  ? "bg-gray-900 dark:bg-yellow-400 text-white dark:text-gray-900 shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-52 bg-gray-100 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-gray-800 dark:text-gray-200 font-bold text-xl mb-2 transition-colors">No Products Found</h3>
            <button onClick={() => { setKeyword(""); setSearchInput(""); setActiveTab("All"); setPage(1); }}
              className="mt-4 bg-gray-900 dark:bg-gray-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-600 transition-all">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
            <div className="mt-10">
              <Pagination page={page} totalPages={totalPages} onPageChange={p => { setPage(p); productsRef.current?.scrollIntoView({ behavior: "smooth" }); }} />
            </div>
          </>
        )}
      </div>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#080b13] border-t border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-400/10 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-400/20 transition-colors">
                {f.icon}
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100 font-bold text-sm transition-colors">{f.title}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs transition-colors">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-[#080b13] dark:to-[#05070c]">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <p className="text-yellow-400 font-bold text-sm uppercase tracking-widest mb-3">Limited Time</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Get 20% Off Your First Order
          </h2>
          <p className="text-gray-400 mb-7 max-w-sm mx-auto text-sm">
            Use code <span className="text-yellow-400 font-bold">FIRST20</span> at checkout.
          </p>
          <Link to="/register"
            className="inline-block bg-yellow-400 text-gray-900 font-black px-8 py-3.5 rounded-xl hover:bg-yellow-300 transition-all shadow-xl text-sm">
            Create Free Account →
          </Link>
        </div>
      </div>

    </div>
  );
}