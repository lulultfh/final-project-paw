"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar() {
  const router = useRouter();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);

  const categories = ["Cake", "Pastry", "Bread", "Cookies"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length === 0) {
        setResults([]);
        return;
      }
      // fetch logic kalau mau searching beneran
    };
    fetchResults();
  }, [query]);

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
          {query === "" ? (
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Our Categories
              </p>
              <ul className="space-y-1">
                {categories.map((item, i) => (
                  <li
                    key={i}
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
                  onClick={() => router.push(item.path)}
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
