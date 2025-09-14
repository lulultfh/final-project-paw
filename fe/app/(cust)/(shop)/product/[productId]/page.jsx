"use client";

import { getDataById } from "../action";
import { addToCart } from "../action";
import { useEffect, useState } from "react";
import { useAuth } from '@/app/context/authContext'; 
import { useRouter } from 'next/navigation'; 

export default function ProductPage({ params }) {
  const { productId } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userToken } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getDataById(productId);
        setProduct(productData);
      } catch (err) {
        setError("Error: Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (isOutOfStock) return; // 
    if (product) {
      addToCart(product);
    }
    if (!userToken) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    if (product) {
      addToCart(product);


    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  // Format harga ke Rupiah
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  const isOutOfStock = product.stok === 0;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-8 md:p-12">
      <div className="max-w-4xl mx-auto bg-[#F8D7D1] rounded-lg shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="md:col-span-1">
            <img 
              src={`http://localhost:3001/api/product/image/${product.image}`} 
              alt={product.namaProduct} 
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          {/* Product Details Section */}
          <div className="flex flex-col p-8 justify-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.namaProduct}</h1>
            <p className="text-2xl font-semibold text-gray-700 mb-4">{formattedPrice}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-sm text-gray-500">Kategori: <span className="font-medium text-gray-700">{product.kategori}</span></p>
            <p className="text-sm text-gray-500">Stok: <span className="font-medium text-gray-700">{product.stok}</span></p>
            
            {/* Bungkus tombol dengan Link */}
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`mt-6 w-full py-3 px-4 font-bold rounded-md ${
                isOutOfStock
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-[#F3EBD8] text-[#7D5A5A] hover:bg-[#F76079] hover:text-[#F3EBD8]'
              }`}
              >
              {isOutOfStock ? 'Stok Habis' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}