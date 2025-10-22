export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-[#F8D7D1] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 relative">
      <div className="relative h-48">
        <img
          src={`http://localhost:3001/api/product/image/${product.image}`}
          alt={product.namaProduct}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "/placeholder-image.svg"; }}
        />
        <div className={`status-badge absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
          product.stok > 10 ? "bg-green-500" : product.stok > 0 ? "bg-yellow-500" : "bg-red-500"
        }`}>
          {product.stok > 10 ? "Aktif" : product.stok > 0 ? "Stok Rendah" : "Stok Habis"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-[#878B5A] mb-1">{product.namaProduct}</h3>
        <p className="text-xs font-semibold text-[#961E32] uppercase mb-2">{product.kategori}</p>
        <p 
          className="text-sm text-gray-600 mb-3 overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {product.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-[#7D5A5A]">Rp {product.price?.toLocaleString('id-ID')}</span>
          <span className="text-sm font-medium text-gray-600">Stok: {product.stok}</span>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 px-4 py-2 bg-[#B6BB79] hover:bg-[#636541] text-white rounded-2xl text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex-1 px-4 py-2 bg-[#F76079] hover:bg-red-700 text-white rounded-2xl text-sm font-medium transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}