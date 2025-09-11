import "../globals.css";
import { AuthProvider } from "../context/authContext";
import SidebarLayoutAdmin from "@/components/admin/sidebar";

export default function RootAdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AuthProvider>
          <div className="flex">
            {/* Sidebar */}
            <SidebarLayoutAdmin />

            {/* Konten utama */}
            <div className="flex-1 flex flex-col p-6">
              {/* <NavbarCustMenu /> */}
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