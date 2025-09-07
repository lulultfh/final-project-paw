// app/page.js
// This should be your main home page file

// import Navbar from "../components/navbar"; // Ini bisa dihapus jika tidak digunakan
import SidebarLayout from "@/components/cust/sidebar";
import Carousel from "@/components/cust/ui/carousel";
import ProductPage from "@/app/(shop)/product/page";

export default function HomePage() {
  return (
    <div style={{ display: "flex" }}>
      <SidebarLayout />
      <div className="flex-1 flex flex-col justify-start items-start p-6">
        <Carousel />
        <ProductPage limit={12} title="Customers Also Purchased" />
      </div>
    </div>
  );
}