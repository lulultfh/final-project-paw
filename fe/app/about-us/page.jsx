import SidebarLayout from "@/components/cust/sidebar";
import NavbarCustMenu from "@/components/cust/navbar";

// // export default function AboutPage() {
// //   return (
// //     <div style={{ display: "flex" }}>
// //       <SidebarLayout />
// //       {/* Konten utama */}
// //       <div className="flex-1 flex justify-center items-start p-6">
// //         {/* <Carousel /> */}
// //       </div>
// //     </div>
// //   );
// // }

import React from 'react';

// --- DEFINISI KOMPONEN ICON ---
// Komponen ini penting dan harus ada agar <Icon> bisa digunakan.
// const Icon = ({ path, className = "w-6 h-6" }) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     viewBox="0 0 24 24" 
//     fill="none" // Menggunakan 'none' agar stroke bisa terlihat
//     stroke="currentColor" // Mengatur warna garis
//     strokeWidth="2" // Mengatur ketebalan garis
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className={className}
//   >
//     <path d={path} />
//   </svg>
// );

// --- KOMPONEN UTAMA HALAMAN ---
// Pastikan file font 'AppleGaramaond.ttf' ada di folder /public/font/ di proyekmu
export default function AboutPage() {
  const teamMembers = [
    { name: "Jane Doe", role: "Head Pâtissier", img: "https://placehold.co/300x300/FDECE2/5D4037?text=Jane" },
    { name: "John Smith", role: "Master Baker", img: "https://placehold.co/300x300/D4E0C7/5D4037?text=John" },
    { name: "Emily White", role: "Chocolatier", img: "https://placehold.co/300x300/F5DBCB/5D4037?text=Emily" },
    { name: "Michael Brown", role: "Operations Head", img: "https://placehold.co/300x300/FDF6B2/5D4037?text=Michael" },
    { name: "Billy Brown", role: "Operations Head", img: "https://placehold.co/300x300/FDF6B2/5D4037?text=Michael" },
  ];

  return (
    // Menggunakan gradient background dan font 'Urbanist' sesuai CSS
    <div className="flex bg-gradient-to-t from-[#F3EBD8] to-[#F9D0CE] min-h-screen" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      <SidebarLayout />
      
      {/* Area Konten Utama */}
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto">

          {/* Bagian About Us */}
          <section id="about-us" className="mb-20">
            <h2 style={{ fontFamily: "'AppGaram'" }} className="text-5xl font-bold text-[#171717] mb-8">About Us</h2>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-shrink-0">
                <img src="/cewek-standar.png" alt="Maskot Butter & Bliss - cewek" className="w-80 h-80 object-cover"/>
              </div>
              <p className="text-lg text-[#171717] leading-relaxed max-w-prose text-justify">
                Butter & Bliss is a modern bakery that blends authentic flavors with a touch of innovation. We believe every bite should bring happiness, which is why our breads, cakes, and pastries are crafted with quality ingredients and love. Through our elegant and user-friendly website, Butter & Bliss makes it easy for customers to explore the menu, place orders, and discover special seasonal creations.
              </p>
            </div>
          </section>

          {/* Bagian Find Us */}
          <section id="find-us" className="mb-20">
            <h2 style={{ fontFamily: "'AppGaram', serif" }} className="text-5xl font-bold text-[#171717] mb-8">Find us in</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Kolom Peta */}
                <div className="flex-grow w-full h-96 bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.91578335338!2d110.3648588748924!3d-7.79851619222271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a578bf2d49a2d%3A0x1d32a9a7c3b2f5a!2sYogyakarta!5e0!3m2!1sen!2sid!4v1694346452504!5m2!1sen!2sid"
                        width="100%" 
                        height="100%" 
                        style={{ border:0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                {/* Kolom Maskot */}
                <div className="flex-shrink-0 hidden md:block">
                    <img 
                        src="/cowok-standar-1.png" // Ganti dengan path maskotmu jika berbeda
                        alt="Maskot Butter & Bliss - cowok" 
                        className="w-80 h-auto"
                    />
                </div>
            </div>
          </section>

          {/* Bagian Meet Our Team */}
          <section id="meet-our-team">
            <h2 style={{ fontFamily: "'AppGaram', serif" }} className="text-5xl font-bold text-[#171717] mb-12">Meet our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center group">
                   <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                     <img src={member.img} alt={`Profile of ${member.name}`} className="w-full h-full object-cover" />
                   </div>
                  <h3 className="text-xl font-bold text-[#171717]">{member.name}</h3>
                  <p className="text-neutral-600">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

// Catatan: Gambar profil dan ikon menggunakan placeholder dari placehold.co
// Ganti URL gambar dengan gambar asli sesuai kebutuhan.