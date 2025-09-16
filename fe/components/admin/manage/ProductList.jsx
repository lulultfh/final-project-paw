"use client";

import { useEffect, useState } from "react";
import ProductHeader from "./ProductHeader";
import ProductControls from "./ProductControls";
import ProductGrid from "./ProductGrid";
import ProductModal from "./ProductModal";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nama: "",
    desc: "",
    price: "",
    stok: "",
    kategori: "",
    image: null,
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const categories = ["cake", "pastry", "bread", "cookies"];

  // Ambil data produk dari backend
  const fetchProducts = async () => {
    try {
<<<<<<< HEAD
      const res = await fetch("http://10.69.2.146:3001/api/product");
=======
      const res = await fetch("http://10.69.2.146:3001/api/product");
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError("Hanya file gambar (JPEG, JPG, PNG, GIF) yang diizinkan");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (!form.nama || !form.desc || !form.price || !form.stok || !form.kategori) {
      setError("Semua field wajib diisi!");
      setLoading(false);
      return;
    }
    if (parseFloat(form.price) < 0 || parseInt(form.stok) < 0) {
      setError("Harga dan Stok tidak boleh minus!");
      setLoading(false);
      return;
    }
    if (!categories.includes(form.kategori)) {
      setError("Kategori tidak valid!");
      setLoading(false);
      return;
    }
    if (!editing && !form.image) {
      setError("Gambar produk wajib diupload!");
      setLoading(false);
      return;
    }

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
<<<<<<< HEAD
        response = await fetch(`http://10.69.2.146:3001/api/product/${form.id}`, {
=======
        response = await fetch(`http://10.69.2.146:3001/api/product/${form.id}`, {
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
          method: "PUT",
          body: formData,
        });
      } else {
<<<<<<< HEAD
        response = await fetch("http://10.69.2.146:3001/api/product", {
=======
        response = await fetch("http://10.69.2.146:3001/api/product", {
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
          method: "POST",
          body: formData,
        });
      }

      const result = await response.json();

      if (response.ok) {
        setForm({ id: null, nama: "", desc: "", price: "", stok: "", kategori: "", image: null });
        setEditing(false);
        setImagePreview("");
        setSuccess(editing ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!");
        fetchProducts();
        closeModal();
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
      image: null,
    });
    setEditing(true);
<<<<<<< HEAD
    setImagePreview(`http://10.69.2.146:3001/api/product/image/${product.image}`);
=======
    setImagePreview(`http://10.69.2.146:3001/api/product/image/${product.image}`);
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
    clearMessages();
    openModal();
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
<<<<<<< HEAD
      const response = await fetch(`http://10.69.2.146:3001/api/product/${id}`, {
=======
      const response = await fetch(`http://10.69.2.146:3001/api/product/${id}`, {
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(false);
    setForm({ id: null, nama: "", desc: "", price: "", stok: "", kategori: "", image: null });
    setImagePreview("");
    clearMessages();
  };
  
  // Filtered Products Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.namaProduct.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || product.kategori === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === "active") {
      matchesStatus = product.stok > 10;
    } else if (selectedStatus === "low") {
      matchesStatus = product.stok > 0 && product.stok <= 10;
    } else if (selectedStatus === "out") {
      matchesStatus = product.stok === 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="container max-w-7xl mx-auto">
        <ProductHeader />
        <ProductControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          categories={categories}
          openModal={openModal}
        />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-center">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 text-center">{success}</div>
        )}
        <ProductGrid
          products={filteredProducts}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
      <ProductModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        form={form}
        setForm={setForm}
        handleFormSubmit={handleFormSubmit}
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
        editing={editing}
        loading={loading}
        categories={categories}
      />
    </div>
  );
}