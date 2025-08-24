"use client";

import Carousel from "./ui/carousel";
import { useEffect, useState } from "react";
import { getAllProducts } from "@/app/(shop)/product/action";

export default function ForYou() {
  return (
    <div className="flex-1 flex justify-center items-start p-6">
      <Carousel />
    </div>
  );
}
