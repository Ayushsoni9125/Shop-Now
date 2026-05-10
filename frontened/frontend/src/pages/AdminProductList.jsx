import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "http://localhost:3200/api";

const emptyForm = { name: "", price: "", description: "", image: "", category: "", stock: "" };

function AdminProductList() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null = add mode
  const [form, setForm] = useState(emptyForm);

  // Delete confirm
  const [deleteId, setDeleteId] = useState(null);

  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  useEffect(() => {
    if (!userInfo?.isAdmin) { navigate("/"); return; }
    fetchProducts();
  }, [userInfo, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/products`);
      setProducts(data.products || data);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: product.image || "",
      category: product.category || "",
      stock: product.stock,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editProduct) {
        const { data } = await axios.put(`${BASE_URL}/products/${editProduct._id}`, payload, { headers });
        setProducts(prev => prev.map(p => p._id === editProduct._id ? data : p));
        showSuccess("Product updated successfully!");
      } else {
        const { data } = await axios.post(`${BASE_URL}/products`, payload, { headers });
        setProducts(prev => [data, ...prev]);
        showSuccess("Product created successfully!");
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${BASE_URL}/products/${deleteId}`, { headers });
      setProducts(prev => prev.filter(p => p._id !== deleteId));
      showSuccess("Product deleted.");
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb + Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link to="/admin" className="hover:text-yellow-400 transition-colors">Dashboard</Link>
              <span>›</span>
              <span className="text-gray-300">Products</span>
            </div>
            <h1 className="text-3xl font-black text-white">📦 Product Management</h1>
            <p className="text-gray-400 text-sm mt-1">{products.length} products total</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-400/20 whitespace-nowrap"
          >
            ＋ Add Product
          </button>
        </div>

        {/* Success Toast */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl p-3 mb-4 text-sm flex items-center gap-2 animate-fade-in">
            ✅ {success}
          </div>
        )}
        {error && !showModal && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-white font-bold text-xl mb-2">No Products Found</p>
            <p className="text-gray-400 mb-6">Start by adding your first product.</p>
            <button onClick={openAdd} className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all">
              ＋ Add First Product
            </button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-gray-500">
                    <th className="text-left px-5 py-4 font-semibold">Product</th>
                    <th className="text-left px-5 py-4 font-semibold">Category</th>
                    <th className="text-left px-5 py-4 font-semibold">Price</th>
                    <th className="text-left px-5 py-4 font-semibold">Stock</th>
                    <th className="text-right px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-white/10"
                            onError={e => { e.target.src = "https://via.placeholder.com/48?text=?"; }}
                          />
                          <div>
                            <p className="text-white font-semibold leading-tight line-clamp-1">{product.name}</p>
                            <p className="text-gray-500 text-xs line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-full">
                          {product.category || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-yellow-400 font-bold">₹{product.price?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border
                          ${product.stock > 0
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-500/30 transition-all"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(product._id)}
                            className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-black text-xl">{editProduct ? "✏️ Edit Product" : "＋ Add Product"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { id: "name", label: "Product Name", type: "text", placeholder: "e.g. Wireless Headphones" },
                { id: "price", label: "Price (₹)", type: "number", placeholder: "e.g. 1999" },
                { id: "image", label: "Image URL", type: "url", placeholder: "https://..." },
                { id: "category", label: "Category", type: "text", placeholder: "e.g. Electronics" },
                { id: "stock", label: "Stock Quantity", type: "number", placeholder: "e.g. 50" },
              ].map(field => (
                <div key={field.id}>
                  <label className="text-gray-400 text-xs font-semibold mb-1.5 block">{field.label}</label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.id]}
                    onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                    required
                    min={field.type === "number" ? "0" : undefined}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 placeholder-gray-600 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1.5 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short product description..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 placeholder-gray-600 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-white/10 border border-white/20 text-gray-300 font-semibold py-2.5 rounded-xl hover:bg-white/15 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all disabled:opacity-60"
                >
                  {saving ? "Saving..." : editProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-white font-black text-lg mb-2">Delete Product?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-white/10 border border-white/20 text-gray-300 font-semibold py-2.5 rounded-xl hover:bg-white/15 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductList;
