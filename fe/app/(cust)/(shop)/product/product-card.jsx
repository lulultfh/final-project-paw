"use client"; 

import Link from 'next/link';
import { addToCart } from "./action";
import { useAuth } from '@/app/context/authContext'; 
import { useRouter } from 'next/navigation';

// Tambahkan onAddToCart di properti
export default function ProductCard({ product }) {
  const { userToken } = useAuth();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!userToken) {
      // Arahkan ke login, dan simpan halaman tujuan
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Jika sudah login, tambahkan ke cart
    addToCart(product);
  };

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div key={product.id} className="group relative bg-[#F8D7D1] p-4 rounded-lg shadow-md font-bold flex flex-col min-h-[350px]">
      <Link href={`/product/${product.id}`} className="block">
        <img
          alt={product.namaProduct}
          src={`http://localhost:3001/api/product/image/${product.image}`}
          className="aspect-square w-full rounded-md object-cover group-hover:opacity-75"
        />
      </Link>
      
      <div className="mt-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="text-sm text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis max-w-[120px]">
              <Link href={`/product/${product.id}`}>
                {product.namaProduct}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{product.kategori}</p>
          </div>
          <p className="text-sm font-medium text-gray-900 mt-2">{formattedPrice}</p>
        </div>
      </div>
      
      {/* Ubah ini dari Link menjadi button biasa dan tambahkan onClick */}
      <button 
        onClick={handleAddToCart}
        className="w-full py-2 px-4 bg-[#F3EBD8] text-[#7D5A5A] font-bold rounded-md hover:bg-[#F76079] hover:text-[#F3EBD8]"
      >
        Add to Cart
      </button>
    </div>
  );
}