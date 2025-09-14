export default function ProductModal({
  isModalOpen,
  closeModal,
  form,
  setForm,
  handleFormSubmit,
  handleImageChange,
  imagePreview,
  editing,
  loading,
  categories,
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#F3EBD8] rounded-3xl max-w-4xl w-full p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#878B5A] text-center mb-6">
          {editing ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>
        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Nama Produk *
              </label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#878B5A]"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Deskripsi *
              </label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                className="p-3 h-24 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-[#878B5A]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Harga (Rp) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#878B5A]"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Stok *
                </label>
                <input
                  type="number"
                  value={form.stok}
                  onChange={(e) => setForm({ ...form, stok: e.target.value })}
                  className="p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#878B5A]"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                className="p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#878B5A]"
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
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Gambar Produk {editing ? "" : "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#878B5A]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: JPEG, JPG, PNG, GIF. Maksimal 5MB
              </p>
            </div>
            {imagePreview && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 rounded-3xl text-white font-bold bg-[#961E32] hover:from-red-600 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-3xl text-white font-bold bg-[#878B5A] ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-green-600 hover:to-green-800 transform hover:-translate-y-1"
              } transition-all shadow-lg hover:shadow-xl`}
            >
              {loading
                ? "Processing..."
                : editing
                ? "Update Produk"
                : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
