"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "./action";

/** @type {import("../domain/product").product[]} */
const initialProducts = [];

export default function ProductPage() {
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
    <div className="p-4">
      <h1 className="text-2xl">Product List</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <a
              href={`/product/${p.id}`}
              className="text-blue-500 hover:underline"
            >
              {p.namaProduct} - {p.price}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
