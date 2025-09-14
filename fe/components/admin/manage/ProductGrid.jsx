import ProductCard from "./ProductCard";

export default function ProductGrid({ products, handleEdit, handleDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.length === 0 ? (
        <div className="col-span-full text-center p-12 text-gray-500">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold">Belum ada produk</h3>
          <p className="text-sm">Klik "Tambah Produk" untuk menambah produk pertama Anda</p>
        </div>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}