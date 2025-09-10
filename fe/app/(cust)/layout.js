// import { Urbanist } from "next/font/google";
// import "../globals.css";
// import { AuthProvider } from "../context/authContext";
// import SidebarLayout from "@/components/cust/sidebar";
// import NavbarCustMenu from "@/components/cust/navbar";

// const urban = Urbanist({
//   variable: "--font-urbanist-sans",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Butter&Bliss",
//   description:
//     "Butter & Bliss is a bakery website built with Next.js and Node.js, offering an elegant, responsive platform for browsing menus, placing orders, and exploring seasonal specials",
//   icons: {
//     icon: "/logo-text.svg",
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${urban.variable} antialiased`}>
//         <AuthProvider>
//           <div className="flex">
//             {/* Sidebar */}
//             <SidebarLayout />

//             {/* Konten utama */}
//             <div className="flex-1 flex flex-col p-6">
//               <NavbarCustMenu />
//               <main className="flex-1 w-full">
//                 {children}
//               </main>
//             </div>
//           </div>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }