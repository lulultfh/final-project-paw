import { Urbanist } from "next/font/google";
import "./globals.css";
// import type { Metadata } from "next";


const urban = Urbanist({
  variable: "--font-urbanist-sans",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Butter&Bliss",
  description: "Butter & Bliss is a bakery website built with Next.js and Node.js, offering an elegant, responsive platform for browsing menus, placing orders, and exploring seasonal specials",
  icons: {
    icon: "/logo-text.svg",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${urban.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
