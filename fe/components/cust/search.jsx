"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { getAllProducts } from "@/app/(cust)/(shop)/product/action";

function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export default function SearchBar() {
  const router = useRouter();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Ambil semua produk untuk digunakan dalam pencarian
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    const fetchAllProducts = async () => {
      const products = await getAllProducts();
      setAllProducts(products);
    };
    fetchAllProducts();
  }, []);

  const categories = ["Cake", "Pastry", "Bread", "Cookies"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debouncedSearch = debounce(() => {
    if (query.length > 0) {
      setIsSearching(true);
      const filteredResults = allProducts.filter(p =>
        p.namaProduct.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults.map(p => ({
        id: p.id,
        title: p.namaProduct,
        type: p.kategori,
        path: `/product/${p.id}`
      })));
      setIsSearching(false);
    } else {
      setResults([]);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch();
  }, [query, allProducts]);

  const handleCategoryClick = (category) => {
    router.push(`/product?category=${category}`);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full my-4 md:my-0">
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-300 transition-all">
        <FiSearch className="text-gray-400 mr-3" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search your favorite bakery..."
          className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
          value={query}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <FiX className="text-gray-400 ml-2 hover:text-gray-600" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md z-50">
          {isSearching && query.length > 0 ? (
            <p className="p-3 text-sm text-gray-500">Searching...</p>
          ) : query === "" ? (
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Our Categories
              </p>
              <ul className="space-y-1">
                {categories.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleCategoryClick(item)}
                    className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : results.length > 0 ? (
            <ul className="p-2 space-y-1">
              {results.map((item, i) => (
                <li
                  key={i}
                  onClick={() => {
                    router.push(item.path);
                    setShowDropdown(false);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <span className="font-semibold text-blue-600 mr-2">
                    {item.type}:
                  </span>
                  {item.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-3 text-sm text-gray-500">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}