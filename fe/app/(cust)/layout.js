import "../globals.css";
import { AuthProvider } from "../context/authContext";
import SidebarLayout from "@/components/cust/sidebar";
import NavbarCustMenu from "@/components/cust/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AuthProvider>
          <div className="flex">
            {/* Sidebar */}
            <SidebarLayout />

            {/* Konten utama */}
            <div className="flex-1 flex flex-col p-5">
              <NavbarCustMenu />
              <main className="flex-1 w-full">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}