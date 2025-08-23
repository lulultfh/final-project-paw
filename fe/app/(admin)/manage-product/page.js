"use client";

import { useEffect, useState } from "react";
import SidebarLayoutAdmin from "@/components/admin/sidebar";

export default function ManageProductPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nama: "",
    desc: "",
    price: "",
    stok: "",
    kategori: "",
    image: "",
  });
  const [editing, setEditing] = useState(false);

  // Ambil data produk dari backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/product");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
  fetch("http://localhost:3001/api/product")
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((err) => console.error("Error fetching products:", err));
  }, []);


  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nama: form.nama,
      desc: form.desc,
      price: parseInt(form.price),
      stok: parseInt(form.stok),
      kategori: form.kategori,
      image: form.image,
    };

    try {
      if (editing) {
        await fetch(`http://localhost:3001/api/product/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:3001/api/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setForm({ id: null, nama: "", desc: "", price: "", stok: "", kategori: "", image: "" });
      setEditing(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      nama: product.namaProduct,
      desc: product.description,
      price: product.price,
      stok: product.stok,
      kategori: product.kategori,
      image: product.image,
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/product/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarLayoutAdmin />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Product</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-4 mb-6"
        >
          <input
            type="text"
            placeholder="Image URL"
            className="border p-2 mb-2 w-full rounded"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product Name"
            className="border p-2 mb-2 w-full rounded"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="border p-2 mb-2 w-full rounded"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 mb-2 w-full rounded"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stock"
            className="border p-2 mb-2 w-full rounded"
            value={form.stok}
            onChange={(e) => setForm({ ...form, stok: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            className="border p-2 mb-2 w-full rounded"
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value })}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editing ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* Product Table */}
        <table className="w-full border-collapse bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-2">
                  <img
                    src={product.image}
                    alt={product.namaProduct}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2">{product.namaProduct}</td>
                <td className="p-2">{product.description}</td>
                <td className="p-2">Rp {product.price}</td>
                <td className="p-2">{product.stok}</td>
                <td className="p-2">{product.kategori}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
