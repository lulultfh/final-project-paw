"use client";

import React from "react";
import MapLocation from "@/components/cust/ui/map";
import { Github } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Lu'lu' Luthfiah",
      role: "Fullstack Developer",
      nim: "20230140209",
      img: "images/uls.jpeg",
      github: "https://github.com/lulultfh",
    },
    {
      name: "Mannanta Brilian Citra",
      role: "Fullstack Developer",
      nim: "20230140228",
      img: "images/mananta.jpeg",
      github: "https://github.com/MannantaB",
    },
    {
      name: "Azizah Aurellia Azmi",
      role: "Fullstack Developer",
      nim: "20230140234",
      img: "images/azizi.jpeg",
      github: "https://github.com/azizazmi",
    },
    {
      name: "Husna Kamila Syahida",
      role: "Fullstack Developer",
      nim: "20230140238",
      img: "images/husna.jpeg",
      github: "https://github.com/husnakamilaa",
    },
  ];

  return (
    <main className="flex-1 min-h-screen">
      <div className="p-8 max-w-5xl mx-auto">
        {/* About Us */}
        <section id="about-us" className="mb-20">
          <h2 className="text-5xl font-second italic text-[#878B5A] mb-8">
            About Us
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <img
              src="/cewek-about.png"
              alt="Maskot Butter & Bliss"
              className="w-80 h-80 object-cover"
            />
            <p className="text-lg text-[#171717] leading-relaxed max-w-prose text-justify">
              Butter & Bliss is a modern bakery that blends authentic flavors
              with a touch of innovation. We believe every bite should bring
              happiness, which is why our breads, cakes, and pastries are
              crafted with quality ingredients and love. Through our elegant and
              user-friendly website, Butter & Bliss makes it easy for customers
              to explore the menu, place orders, and discover special seasonal
              creations.
            </p>
          </div>
        </section>

        {/* Find Us */}
        <section id="find-us" className="mb-20">
          <h2 className="text-5xl font-second italic text-[#878B5A] mb-8">
            Find us in
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Map */}
            <div className="flex-grow w-full h-96 bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <MapLocation />
            </div>
            {/* Mascot */}
            <div className="flex-shrink-0 hidden md:block">
              <img
                src="/cowok-map.png"
                alt="Maskot Butter & Bliss - cowok"
                className="w-80 h-auto"
              />
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section id="meet-our-team">
          <h2 className="text-5xl font-second italic text-[#878B5A] mb-4">
            Meet our Team
          </h2>
          <p className="text-3xl text-[#878B5A] mb-12 font-bold">
            Kelompok 7 PAW
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.img}
                    alt={`Profile of ${member.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#171717]">
                  {member.name}
                </h3>
                <p className="text-neutral-600">{member.role}</p>
                <p className="text-neutral-600">{member.nim}</p>

                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center mt-2 text-[#171717] hover:text-[#878B5A] transition-colors"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
