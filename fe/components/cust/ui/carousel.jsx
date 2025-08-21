"use client";

import Image from "next/image";

export default function Carousel() {
  return (
    <div className="flex flex-col items-center">
      {/* Carousel */}
      <div className="carousel rounded-xl shadow-lg w-[1098px] h-[280px]">
        <div id="item1" className="carousel-item w-full">
          <Image
            src="/carousel1.svg"
            alt="Carousel 1"
            width={1098}
            height={280}
            className="w-full h-full object-cover"
          />
        </div>
        <div id="item2" className="carousel-item w-full">
          <Image
            src="/carousel2.svg"
            alt="Carousel 2"
            width={1098}
            height={280}
            className="w-full h-full object-cover"
          />
        </div>
        <div id="item3" className="carousel-item w-full">
          <Image
            src="/carousel3.svg"
            alt="Carousel 3"
            width={1098}
            height={280}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center gap-2 py-2">
        <a href="#item1" className="btn btn-xs">1</a>
        <a href="#item2" className="btn btn-xs">2</a>
        <a href="#item3" className="btn btn-xs">3</a>
      </div> */}
    </div>
  );
}
