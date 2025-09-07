// app/(shop)/product/page.jsx
"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "./action";
import ProductCard from "./product-card";

export default function ProductPage({ limit = null, groupByCategory = false, title = "All Products" }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
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

  // Logika untuk membatasi produk
  let displayedProducts = products;
  if (limit) {
    displayedProducts = products.slice(0, limit);
  }

  // Logika untuk mengelompokkan produk berdasarkan kategori
  if (groupByCategory) {
    const categories = displayedProducts.reduce((acc, product) => {
      const { kategori } = product;
      if (!acc[kategori]) {
        acc[kategori] = [];
      }
      acc[kategori].push(product);
      return acc;
    }, {});

    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {Object.keys(categories).map((kategori) => (
          <div key={kategori} className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">{kategori}</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {categories[kategori].map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Tampilan default tanpa pengelompokan
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}