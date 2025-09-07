"use client";

import Image from "next/image";

/** @typedef {import("../domain/product").product} product */

/**
 * @param {{ products: product[], showCategoryTag?: boolean }} props
 */
export default function ProductCard({ products, showCategoryTag = false }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        <p>Tidak ada produk yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <a key={product.id} href={`/product/${product.id}`} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-[#F8D7D1] xl:aspect-h-8 xl:aspect-w-7">
                <div className="relative h-48 w-full">
                  <Image
                    alt={product.namaProduct}
                    src={product.image}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                  {/* Kondisi untuk menampilkan tag kategori */}
                  {showCategoryTag && (
                    <div className="absolute top-2 right-2 rounded-full bg-pink-400 px-3 py-1 text-xs font-semibold text-white">
                      #{product.kategori.charAt(0).toUpperCase() + product.kategori.slice(1)}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.namaProduct}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">Rp {product.price}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShoppingCard(){
  return
}