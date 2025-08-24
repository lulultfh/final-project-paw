"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
/** @type {import("../domain/product").product[]} */
const initialProducts = [];

export default function ProductCard(){
    const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        console.log("Products from API:", data);
        setProducts(data);
      })
      .catch((err) => console.error("Error fetch products:", err));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map((p) => (
        <div key={p.id} className="border rounded-xl p-3 shadow">
          <div className="relative w-full h-40">
            <Image
              src={p.image}
              alt={p.namaProduct}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <h2 className="card-title">{p.namaProduct}</h2>
          <p className="text-gray-600">Rp {p.price}</p>
          <p className="text-sm text-gray-500">{p.kategori}</p>
        </div>
      ))}
    </div>
  );
}

{/* <div className="card bg-base-100 w-96 shadow-sm">
  <figure className="px-10 pt-10">
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes"
      className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Card Title</h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div className="card-actions">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div> */}


export default function CartCard(){
    return(
        <div className="flex flex-col-reserve">
            <div>01</div>
            <div>01</div>
            <div>01</div>
            <div>01</div>
        </div>
    )
}