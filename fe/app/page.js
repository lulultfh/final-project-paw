// import Navbar from "../components/navbar";
import SidebarLayout from "@/components/cust/sidebar";
import Carousel from "@/components/cust/ui/carousel";

export default function HomePage() {
  return (
    <div style={{ display: "flex" }}>
      <SidebarLayout />
      <div className="flex-1 flex justify-center items-start p-6">
        <Carousel />
      </div>
    </div>
  );
}