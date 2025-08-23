"use client"
import { useEffect, useState } from "react"

export default function ProductPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} - {p.price}</li>
        ))}
      </ul>
    </div>
  )
}
