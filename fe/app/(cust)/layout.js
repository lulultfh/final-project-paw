import "../globals.css";
import { AuthProvider } from "../context/authContext";
import SidebarLayout from "@/components/cust/sidebar";
import NavbarCustMenu from "@/components/cust/navbar";
import UserRoute from '@/components/cust/custRoute';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AuthProvider>
          <UserRoute>
          <div className="flex">
            {/* Sidebar */}
            <SidebarLayout />

            {/* Konten utama */}
            <div className="flex-1 flex flex-col p-6">
              <NavbarCustMenu />
              <main className="flex-1 w-full">
                {children}
              </main>
            </div>
          </div>
          </UserRoute>
        </AuthProvider>
      </body>
    </html>
  );
}