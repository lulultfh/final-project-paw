"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Carousel() {
  const carouselRef = useRef(null);
  const [index, setIndex] = useState(0);

  const items = [
    { id: "c1", src: "/carousel1.svg", alt: "Carousel 1" },
    { id: "c2", src: "/carousel2.svg", alt: "Carousel 2" },
    { id: "c3", src: "/carousel3.svg", alt: "Carousel 3" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 1000); // 1 detik

    return () => clearInterval(interval);
  }, [items.length]);

  // useEffect(() => {
  //   const el = document.getElementById(items[index].id);
  //   if (el && carouselRef.current) {
  //     el.scrollIntoView({ behavior: "smooth", inline: "start" });
  //   }
  // }, [index, items]);
  return (
    <div className="flex flex-col items-center">
      {/* Carousel */}
      <div
        ref={carouselRef}
        className="carousel rounded-xl shadow-lg w-[1098px] h-[280px]"
      >
        {items.map((item) => (
          <div key={item.id} id={item.id} className="carousel-item w-full">
            <Image
              src={item.src}
              alt={item.alt}
              width={1098}
              height={280}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 py-2">
        <a href="#c1" className="btn btn-xs">
          1
        </a>
        <a href="#c2" className="btn btn-xs">
          2
        </a>
        <a href="#c3" className="btn btn-xs">
          3
        </a>
      </div>
    </div>
  );
}
