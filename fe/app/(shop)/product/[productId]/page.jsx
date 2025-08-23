"use client"
import { useEffect, useState } from "react";
import { getAllProducts } from "../action";

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetch products:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl">Product List</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <a href={`/product/${p.id}`} className="text-blue-500 hover:underline">
              {p.name} - {p.price}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
