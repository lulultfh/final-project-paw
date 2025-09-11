import { Urbanist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/authContext";

const urban = Urbanist({
  variable: "--font-urbanist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Butter&Bliss",
  description:
    "Butter & Bliss is a bakery website built with Next.js and Node.js, offering an elegant, responsive platform for browsing menus, placing orders, and exploring seasonal specials",
  icons: {
    icon: "/logo-text.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${urban.variable} antialiased`}>
        <AuthProvider>
          <main className="flex-1 w-full p-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
