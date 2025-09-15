// "use client";

// import { useState, useEffect } from "react";

// // --- WORKAROUND: Simulasi useAuth ---
// const useAuth = () => {
//   return {
//     userData: {
//       id: '123',
//       nama: 'Nama Pengguna',
//       username: 'usernamecontoh',
//       email: 'user@example.com',
//       profileImageUrl: "/user-avatar-1.png",
//     },
//     isLoading: false,
//     isLoggedIn: true,
//     refreshUserData: async () => {
//       console.log("Fungsi refreshUserData() dipanggil.");
//       return Promise.resolve();
//     },
//   };
// };

// export default function EditProfilePage() {
//   const { userData, isLoading, isLoggedIn, refreshUserData } = useAuth();
  
//   const [formData, setFormData] = useState({
//     nama: "",
//     username: "",
//     email: "",
//   });
//   const [profileImage, setProfileImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   useEffect(() => {
//     if (userData && userData.nama) {
//       setFormData({
//         nama: userData.nama,
//         username: userData.username || "",
//         email: userData.email || "",
//       });

//       setPreviewImage(userData.profileImageUrl || "/user-avatar-1.png");
//     }
//   }, [userData]);

//   useEffect(() => {
//     if (!isLoading && !isLoggedIn) {
//       window.location.href = "/login";
//     }
//   }, [isLoading, isLoggedIn]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setProfileImage(file);
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       if (!userData || !userData.id) {
//         throw new Error("ID Pengguna tidak ditemukan.");
//       }

//       // ✅ GANTI PORT SESUAI SERVERMU (3001)
//       const apiEndpoint = `http://10.49.3.154:3001/api/users/${userData.id}`;
//       const updatePayload = new FormData();

//       updatePayload.append('nama', formData.nama);
//       updatePayload.append('username', formData.username);
//       updatePayload.append('email', formData.email); // WAJIB!

//       if (profileImage) {
//         updatePayload.append('profileImage', profileImage);
//       }

//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error("Token tidak ditemukan. Silakan login ulang.");
//       }

//       const response = await fetch(apiEndpoint, {
//         method: "PUT",
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: updatePayload,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Gagal memperbarui profil.");
//       }

//       setSuccess("Profil berhasil diperbarui!");
//       await refreshUserData();
      
//       setTimeout(() => {
//         window.location.href = "/profile";
//       }, 1500);

//     } catch (err) {
//       console.error("Error saat update profil:", err);
//       setError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return <div className="text-center mt-20">Memuat editor profil...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-10">
//       <h1 className="text-3xl font-bold text-[#6F4E37] mb-6">Edit Profil</h1>

//       <form onSubmit={handleSubmit}>
//         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
//           <img
//             src={previewImage}
//             alt="Profile Preview"
//             className="w-24 h-24 rounded-full object-cover border-4 border-[#F5EBE0]"
//           />
//           <div>
//             <label htmlFor="profileImage" className="cursor-pointer px-4 py-2 text-sm text-white bg-[#72541B] rounded-md hover:bg-opacity-90 transition-colors">
//               Ubah Foto
//             </label>
//             <input
//               type="file"
//               id="profileImage"
//               name="profileImage"
//               className="hidden"
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//             <p className="text-xs text-gray-500 mt-2">JPG, PNG, atau GIF. Maks 2MB.</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="nama" className="block text-sm font-medium text-gray-600 mb-1">
//               Nama Lengkap
//             </label>
//             <input
//               type="text"
//               id="nama"
//               name="nama"
//               value={formData.nama}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#72541B]"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#72541B]"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
//             />
//           </div>
//         </div>
        
//         {error && (
//           <div className="mt-6 text-center text-red-500 bg-red-100 p-3 rounded-md">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="mt-6 text-center text-green-500 bg-green-100 p-3 rounded-md">
//             {success}
//           </div>
//         )}

//         <div className="mt-8 flex justify-end space-x-4">
//           <a href="/profile">
//             <button type="button" className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
//               Batal
//             </button>
//           </a>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="px-6 py-2 text-white bg-[#72541B] rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-wait"
//           >
//             {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
// --- TAMBAHKAN IMPORT INI ---
import { useAuth } from "@/app/context/authContext"; 
import { useRouter } from "next/navigation";

// --- HAPUS BAGIAN INI ---
// const useAuth = () => { ... } // Seluruh blok workaround ini dihapus

export default function EditProfilePage() {
  const { userData, isLoading, isLoggedIn, login } = useAuth(); // Ambil fungsi login untuk refresh
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Mengisi form dengan data dari user yang sedang login
    if (userData) {
      setFormData({
        nama: userData.nama || "",
        username: userData.username || "",
        email: userData.email || "",
      });

      // Menampilkan gambar profil yang ada
      const imageUrl = userData.image 
        ? `http://10.49.3.154:3001/uploads/avatar_user/${userData.image}`
        : "/user-avatar-1.png";
      setPreviewImage(imageUrl);
    }
  }, [userData]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!userData || !userData.id) {
        throw new Error("ID Pengguna tidak ditemukan.");
      }

      const apiEndpoint = `http://10.49.3.154:3001/api/user/${userData.id}`;
      const updatePayload = new FormData();

      updatePayload.append('nama', formData.nama);
      updatePayload.append('username', formData.username);
      // Email tidak perlu dikirim karena di backend tidak di-update
      
      if (profileImage) {
        updatePayload.append('profileImage', profileImage);
      }
      
      // --- PERBAIKAN PENGAMBILAN TOKEN ---
      const token = localStorage.getItem('authToken'); // Gunakan 'authToken'
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login ulang.");
      }

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: updatePayload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memperbarui profil.");
      }

      // Refresh data user di context dengan data baru dari backend
      login(token, result.user);

      setSuccess("Profil berhasil diperbarui!");
      
      setTimeout(() => {
        router.push("/profile");
      }, 1500);

    } catch (err) {
      console.error("Error saat update profil:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !userData) {
    return <div className="text-center mt-20">Memuat editor profil...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#F3EBD8] rounded-lg shadow-md my-10">
      <h1 className="text-3xl font-bold text-[#6F4E37] mb-6">Edit Profil</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <img
            src={previewImage}
            alt="Profile Preview"
            onError={(e) => { e.target.onerror = null; e.target.src='/user-avatar-1.png'; }}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#F5EBE0]"
          />
          <div>
            <label htmlFor="profileImage" className="cursor-pointer px-4 py-2 text-sm text-white bg-[#72541B] rounded-md hover:bg-opacity-90 transition-colors">
              Ubah Foto
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-xs text-gray-500 mt-2">JPG, PNG, atau GIF. Maks 2MB.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-600 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#72541B]"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#72541B]"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
             <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah.</p>
          </div>
        </div>
        
        {error && (
          <div className="mt-6 text-center text-red-500 bg-red-100 p-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-6 text-center text-green-500 bg-green-100 p-3 rounded-md">
            {success}
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-[#72541B] rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-wait"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}