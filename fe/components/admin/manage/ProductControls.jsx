import { FiSearch, FiX } from "react-icons/fi";

export default function ProductControls({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories,
  openModal,
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        {/* Input Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full pl-4 pr-12 py-3 border-2 border-[#961E32] rounded-3xl focus:outline-none focus:border-[#878B5A] focus:ring-2 focus:ring-[#878B5A] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Icon Search */}
          <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#961E32] pointer-events-none" />
          {/* Icon Clear */}
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
            >
              <FiX className="text-lg" />
            </button>
          )}
        </div>

        {/* Dropdown Category */}
        <select
          className="w-full sm:w-auto px-4 py-3 border-2 border-[#878B5A] rounded-3xl bg-[#F3EBD8] text-[#878B5A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#878B5A] transition-all cursor-pointer"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* Dropdown Status */}
        <select
          className="w-full sm:w-auto px-4 py-3 border-2 border-[#878B5A] rounded-3xl bg-[#F3EBD8] text-[#878B5A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#878B5A] transition-all cursor-pointer"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="active">Stok Tersedia</option>
          <option value="low">Stok Rendah</option>
          <option value="out">Stok Habis</option>
        </select>
      </div>

      {/* Button Tambah Produk */}
      <button
        onClick={openModal}
        className="w-full md:w-auto px-6 py-3 rounded-3xl text-white font-bold text-lg bg-[#F76079] hover:bg-[#e04c66] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        Tambah Produk
      </button>
    </div>
  );
}
