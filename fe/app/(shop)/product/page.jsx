"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "./action";
import ProductCard from "./product-card";
import { useSearchParams } from "next/navigation";
//import { useRouter } from 'next/navigation'; // Tambahkan useRouter

export default function ProductPage({ className, limit = null, groupByCategory = false, title = "All Products" }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [sessionOrderId, setSessionOrderId] = useState(null);
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  //const router = useRouter(); // Inisiasi router

  // const handleAddToCart = async (product) => {
  //   const res = await addToCart(product);
  //   if (res.error) {
  //     alert("Failed to add to cart. Please try again.");
  //   } else {
  //     router.push('/cart'); // Arahkan ke halaman keranjang setelah berhasil
  //   }
  // };

  useEffect(() => {
    // const initSessionOrder = async () => {
    //   let orderId = localStorage.getItem('sessionOrderId');
    //   if (!orderId) {
    //     orderId = await createSessionOrder();
    //     if (orderId) {
    //       localStorage.setItem('sessionOrderId', orderId);
    //     }
    //   }
    //   setSessionOrderId(orderId);
    // };

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

  // const handleAddToCart = async (product) => {
  //   if (!sessionOrderId) {
  //     alert("Membuat pesanan sesi gagal. Coba muat ulang halaman.");
  //     return;
  //   }

  //   const res = await addToCart(product, sessionOrderId);
  //   if (res.error) {
  //     alert("Gagal menambahkan ke keranjang. Coba lagi.");
  //   } else {
  //     router.push('/cart');
  //   }
  // };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading products...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  let displayedProducts = products;
  if (categoryParam) {
    displayedProducts = products.filter((p) => p.kategori.toLowerCase() === categoryParam.toLowerCase());
  } else if (limit) {
    displayedProducts = products.slice(0, limit);
  }

  const renderProductCards = () => (
    <>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        {categoryParam ? `Products in ${categoryParam}` : title}
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {displayedProducts.map((product) => (
          // Teruskan fungsi handleAddToCart ke ProductCard
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );

  const renderCategorizedProducts = () => {
    const categories = displayedProducts.reduce((acc, product) => {
      const { kategori } = product;
      if (!acc[kategori]) {
        acc[kategori] = [];
      }
      acc[kategori].push(product);
      return acc;
    }, {});

    return (
      <>
        {Object.keys(categories).map((kategori) => (
          <div key={kategori} className="mb-12">
            <h2 className="text-[50px] font-second font-light italic text-[#878B5A] mb-6">{kategori}</h2>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {categories[kategori].map((product) => (
                // Teruskan fungsi handleAddToCart ke ProductCard
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={`py-16 sm:py-24 min-h-screen ${className}`}>
      {groupByCategory ? renderCategorizedProducts() : renderProductCards()}
    </div>
  );
}