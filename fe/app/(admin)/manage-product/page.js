"use client";

import { useEffect, useState } from "react";

export default function ManageProductPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nama: "",
    desc: "",
    price: "",
    stok: "",
    kategori: "",
    image: null, // Changed to handle file
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Kategori yang tersedia
  const categories = ["cake", "pastry", "bread", "cookies"];

  // Ambil data produk dari backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/product");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Gagal mengambil data produk");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError("Hanya file gambar (JPEG, JPG, PNG, GIF) yang diizinkan");
        return;
      }

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }

      setForm({ ...form, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    // Validasi form
    if (!form.nama || !form.desc || !form.price || !form.stok || !form.kategori) {
      setError("Semua field wajib diisi!");
      setLoading(false);
      return;
    }

    // Validasi harga dan stok tidak boleh minus
    if (parseFloat(form.price) < 0) {
      setError("Harga tidak boleh minus!");
      setLoading(false);
      return;
    }

    if (parseInt(form.stok) < 0) {
      setError("Stok tidak boleh minus!");
      setLoading(false);
      return;
    }

    // Validasi kategori
    if (!categories.includes(form.kategori)) {
      setError("Kategori tidak valid! Pilih dari: " + categories.join(", "));
      setLoading(false);
      return;
    }

    // Validasi gambar untuk produk baru
    if (!editing && !form.image) {
      setError("Gambar produk wajib diupload!");
      setLoading(false);
      return;
    }

    // Prepare FormData untuk multipart/form-data
    const formData = new FormData();
    formData.append("nama", form.nama);
    formData.append("desc", form.desc);
    formData.append("price", form.price);
    formData.append("stok", form.stok);
    formData.append("kategori", form.kategori);
    
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      let response;
      if (editing) {
        response = await fetch(`http://localhost:3001/api/product/${form.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch("http://localhost:3001/api/product", {
          method: "POST",
          body: formData,
        });
      }

      const result = await response.json();

      if (response.ok) {
        setForm({ 
          id: null, 
          nama: "", 
          desc: "", 
          price: "", 
          stok: "", 
          kategori: "", 
          image: null 
        });
        setEditing(false);
        setImagePreview("");
        setSuccess(editing ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!");
        fetchProducts();
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        setError(result.error || "Terjadi kesalahan");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Gagal menyimpan produk");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      nama: product.namaProduct,
      desc: product.description,
      price: product.price.toString(),
      stok: product.stok.toString(),
      kategori: product.kategori,
      image: null, // Reset file input for editing
    });
    setEditing(true);
    setImagePreview(`http://localhost:3001/api/product/image/${product.image}`);
    clearMessages();
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/product/${id}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        setSuccess("Produk berhasil dihapus!");
        fetchProducts();
      } else {
        const result = await response.json();
        setError(result.error || "Gagal menghapus produk");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Gagal menghapus produk");
    }
  };

  const handleCancel = () => {
    setForm({ 
      id: null, 
      nama: "", 
      desc: "", 
      price: "", 
      stok: "", 
      kategori: "", 
      image: null 
    });
    setEditing(false);
    setImagePreview("");
    clearMessages();
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Product</h1>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-4 mb-6"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk *
              </label>
              <input
                type="text"
                placeholder="Masukkan nama produk"
                className="border border-gray-300 p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi *
              </label>
              <textarea
                placeholder="Masukkan deskripsi produk"
                className="border border-gray-300 p-3 mb-3 w-full rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="border border-gray-300 p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    className="border border-gray-300 p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.stok}
                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
                    required
                  />
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                className="border border-gray-300 p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Column */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Produk {!editing && "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                className="border border-gray-300 p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleImageChange}
              />
              <p className="text-xs text-gray-500 mb-3">
                Format: JPEG, JPG, PNG, GIF. Maksimal 5MB
              </p>

              {/* Image Preview */}
              {imagePreview && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded text-white font-medium ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading 
                ? "Processing..." 
                : editing 
                  ? "Update Product" 
                  : "Add Product"
              }
            </button>
            
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">
                      Belum ada produk
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <img
                          src={`http://localhost:3001/api/product/image/${product.image}`}
                          alt={product.namaProduct}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.svg"; // Fallback image
                          }}
                        />
                      </td>
                      <td className="p-4 font-medium">{product.namaProduct}</td>
                      <td className="p-4 text-gray-600 max-w-xs truncate">
                        {product.description}
                      </td>
                      <td className="p-4 font-semibold text-green-600">
                        Rp {product.price?.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.stok > 10 
                            ? "bg-green-100 text-green-800" 
                            : product.stok > 0 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                        }`}>
                          {product.stok}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                          {product.kategori}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}