// // // Pastikan path file ini adalah: fe/app/(cust)/profile/page.jsx

// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";

// export default function ProfilePage() {
//   // State untuk menyimpan data user dan status loading
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // useEffect untuk mengambil data saat komponen pertama kali di-render
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // GANTI URL INI dengan URL API backend kamu untuk mengambil data profil
//         // Anggap backend punya endpoint /api/user/me yang mengembalikan data user yang sedang login
//         const response = await fetch("/api/user/me", {
//           headers: {
//             // Jika kamu pakai token (JWT), kirimkan di header
//             // 'Authorization': `Bearer ${localStorage.getItem('token')}`
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Gagal mengambil data user");
//         }

//         const data = await response.json();
//         setUser(data); // Simpan data user ke state
//       } catch (error) {
//         console.error("Error:", error);
//         // Handle error, mungkin redirect ke halaman login
//       } finally {
//         setLoading(false); // Hentikan loading
//       }
//     };

//     fetchUserData();
//   }, []); // Array kosong berarti efek ini hanya berjalan sekali

//   // Tampilkan pesan loading saat data sedang diambil
//   if (loading) {
//     return <div className="text-center mt-10">Loading profile...</div>;
//   }
  
//   // Tampilkan pesan jika data user tidak ditemukan
//   if (!user) {
//     return <div className="text-center mt-10">Gagal memuat profil. Silakan coba lagi.</div>;
//   }

//   // Tampilan halaman profil jika data berhasil didapat
//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
//       <div className="flex items-center space-x-6">
//         <img
//           src={user.profileImageUrl || "https://i.pravatar.cc/150"} // Gunakan gambar dari data atau gambar default
//           alt="Profile Picture"
//           className="w-24 h-24 rounded-full object-cover border-4 border-[#F5EBE0]"
//         />
//         <div>
//           <h1 className="text-3xl font-bold text-[#6F4E37]">{user.name}</h1>
//           <p className="text-gray-500">{user.email}</p>
//         </div>
//       </div>

//       <div className="mt-8 border-t pt-6">
//         <h2 className="text-xl font-semibold text-[#6F4E37]">Informasi Akun</h2>
//         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Nama Lengkap</label>
//             <p className="mt-1 text-lg">{user.name}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Nomor Telepon</label>
//             <p className="mt-1 text-lg">{user.phone || "Belum diatur"}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Alamat</label>
//             <p className="mt-1 text-lg">{user.address || "Belum diatur"}</p>
//           </div>
//         </div>
//       </div>
      
//       <div className="mt-8 flex justify-end">
//         <Link href="/profile/edit">
//           <button className="px-6 py-2 text-white bg-[#72541B] rounded-md hover:bg-opacity-90">
//             Edit Profil
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// }

// // fe/app/profile/page.jsx

// export default function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Ambil userId dari localStorage (dari saat login)
//   const userId = localStorage.getItem('userId'); // <-- pastikan ini disimpan saat login!

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!userId) {
//         setError('Anda belum login. Arahkan ke halaman login.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:3001/api/user/${userId}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const userData = await response.json();
//         setUser(userData);
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userId]);

//   if (loading) return <div className="p-6 text-center">Memuat profil...</div>;
//   if (error) return <div className="p-6 text-red-500">{error}</div>;

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
//       <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>
//       <div className="space-y-3">
//         <p><strong>Nama:</strong> {user.nama}</p>
//         <p><strong>Username:</strong> {user.username}</p>
//         <p><strong>Email:</strong> {user.email}</p>
//         <p><strong>Role:</strong> {user.role}</p>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";

export default function ProfilePage() {
  // State untuk menyimpan data user, status loading, dan pesan error
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect untuk mengambil data saat komponen pertama kali di-render
  useEffect(() => {
    const fetchUserData = async () => {
      // Ambil userId dari localStorage (disimpan saat login)
      const userId = localStorage.getItem('userId');

      // Jika tidak ada userId, hentikan proses dan tampilkan error
      if (!userId) {
        setError('Anda belum login. Silakan login terlebih dahulu.');
        setLoading(false);
        return;
      }

      try {
        // Menggunakan endpoint API dari contoh kedua
        const response = await fetch(`http://localhost:3001/api/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Jika kamu pakai token (JWT), bisa ditambahkan di sini
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          // Tangani response error dari server (misal: 404, 500)
          throw new Error(`Gagal mengambil data user. Status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data); // Simpan data user ke state
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message); // Simpan pesan error untuk ditampilkan ke user
      } finally {
        setLoading(false); // Hentikan loading setelah selesai (baik sukses maupun gagal)
      }
    };

    fetchUserData();
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat komponen dimuat

  // Tampilkan pesan loading saat data sedang diambil
  if (loading) {
    return <div className="text-center mt-20">Memuat profil...</div>;
  }
  
  // Tampilkan pesan error jika terjadi masalah
  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  // Tampilkan pesan jika data user tidak ditemukan setelah proses selesai
  if (!user) {
    return <div className="text-center mt-20">Gagal memuat profil. Silakan coba lagi.</div>;
  }

  // Tampilan utama halaman profil jika data berhasil didapat
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-10">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.nama}&background=F5EBE0&color=6F4E37`} // Gunakan gambar dari data atau inisial nama
          alt="Profile Picture"
          className="w-24 h-24 rounded-full object-cover border-4 border-[#F5EBE0]"
        />
        <div>
          {/* Menggunakan 'user.nama' dari API */}
          <h1 className="text-3xl text-center sm:text-left font-bold text-[#6F4E37]">{user.nama}</h1>
          <p className="text-gray-500 text-center sm:text-left">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold text-[#6F4E37]">Informasi Akun</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nama Lengkap</label>
            <p className="mt-1 text-lg">{user.nama}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <p className="mt-1 text-lg">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-lg">{user.email}</p>
          </div>
           {/* <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <p className="mt-1 text-lg capitalize">{user.role || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Nomor Telepon</label>
            <p className="mt-1 text-lg">{user.phone || "Belum diatur"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Alamat</label>
            <p className="mt-1 text-lg">{user.address || "Belum diatur"}</p>
          </div> */}
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <a href="/profile/edit">
          <button className="px-6 py-2 text-white bg-[#72541B] rounded-md hover:bg-opacity-90 transition-colors">
            Edit Profil
          </button>
        </a>
      </div>
    </div>
  );
}

