// import Navbar from "../components/navbar";
import SidebarLayout from "@/components/cust/sidebar";
import Carousel from "@/components/cust/ui/carousel";
import ProductPage from "./(shop)/product/page";
import NavbarCustMenu from "@/components/cust/navbar";

export default function HomePage() {
  return (
    <div style={{ display: "flex" }}>
      <SidebarLayout />
      <div className="flex-1 flex flex-col justify-start items-center p-6">
        <NavbarCustMenu />
        {/* <ProductPage /> */}
      </div>
    </div>
  );
}