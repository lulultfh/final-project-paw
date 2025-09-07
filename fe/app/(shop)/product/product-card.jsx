// app/(shop)/product/product-card.jsx
// Hapus import Image
// import Image from "next/image";

export default function ProductCard({ product }) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div key={product.id} className="group relative bg-[#F8D7D1] p-4 rounded-lg shadow-md font-bold">
      {/* Ganti div dan Image dengan img biasa */}
      <img
        alt={product.namaProduct}
        src={`http://localhost:3001/api/product/image/${product.image}`}
        className="aspect-square w-full rounded-md object-cover group-hover:opacity-75"
      />
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.namaProduct}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.kategori}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{formattedPrice}</p>
      </div>
    </div>
  );
}