"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "./action";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      try {
        const data = await getAllProducts();
        console.log("Products from API:", data);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndSetProducts();
  }, []);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading products...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-[#F8D7D1] p-4 rounded-lg shadow-md font-bold">
              <img
                alt={product.namaProduct}
                src={`http://localhost:3001/api/product/image/${product.image}`}
                className="aspect-square w-full rounded-md object-cover group-hover:opacity-75 lg:aspect-auto lg:h-50"
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
                {/* Harga diformat menjadi Rupiah */}
                <p className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}