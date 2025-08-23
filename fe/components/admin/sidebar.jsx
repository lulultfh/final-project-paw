"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SidebarLayoutAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const pathname = usePathname();

  const mainNav = [
    { label: "Home", icon: "/home.svg", path: "/home-admin" },
    { label: "Manage Product", icon: "/product.svg", path: "/manage-product" },
    { label: "Manage Order", icon: "/transaction.svg", path: "/manage-order" },
  ];

  const secondaryNav = [
    { label: "Logout", icon: "/logout.svg", path: "/" },
  ];
  return (
    <div className="flex rounded-lg min-h-screen sidebar-gradient">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-full shadow-[4px_4px_12px_rgba(0,0,0,0.25)]
          ${isSidebarOpen ? "animate-slide-right" : "hidden"}
          md:w-64
        `}
        style={{
          overflow: isSidebarOpen ? "visible" : "hidden",
          background: "linear-gradient(180deg, #F9D0CE 0.08%, #F3EBD8 99.92%)",
          boxShadow: "4px 4px 4px 0 rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          className="flex flex-col w-64"
          style={{ display: isSidebarOpen ? "flex" : "none" }}
        >
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r border-gray-50">
            <div className="flex flex-col items-center px-4">
              <Link href="/" className="px-8 text-left focus:outline-none">
                <div className="sidebar flex items-center space-x-2 mt-4">
                  <Image
                    src="/logo-text.svg"
                    alt="My Icon"
                    width={192}
                    height={48}
                  />
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex flex-col flex-grow px-4 mt-5">
              <nav className="flex-1 space-y-1">
                <ul className="space-y-[30px]">
                  {mainNav.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <li key={item.label}>
                        <Link href={item.path}>
                          <div
                            className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base font-semibold transition duration-300 transform rounded-lg
                              ${
                                isActive
                                  ? "bg-[#B6BB79] text-black"
                                  : "text-gray-900 hover:bg-[#B6BB79] hover:text-black"
                              }
                            `}
                          >
                            <Image
                              src={item.icon}
                              alt={`${item.label} Icon`}
                              width={20}
                              height={20}
                            />
                            <span className="ml-4">{item.label}</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <p className="px-4 pt-4 font-medium text-gray-500"></p>
                <ul>
                  {secondaryNav.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <li key={item.label}>
                        <Link href={item.path}>
                          <div
                            className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base font-semibold transition duration-300 transform rounded-lg
                              ${
                                isActive
                                  ? "bg-[#B6BB79] text-black"
                                  : "text-gray-900 hover:bg-[#B6BB79] hover:text-black"
                              }
                            `}
                          >
                            <Image
                              src={item.icon}
                              alt={item.label}
                              width={20}
                              height={20}
                              className="w-5 h-5"
                            />
                            <span className="ml-4">{item.label}</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Hamburger (Mobile) */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <button onClick={toggleSidebar}>
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              <div className="py-4">
                <div className="rounded-lg bg-gray-50 h-96" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
