import SidebarLayout from "@/components/cust/sidebar";
import Carousel from "@/components/cust/ui/carousel";

export default function AboutPage() {
  return (
    <div style={{ display: "flex" }}>
      <SidebarLayout />
      {/* Konten utama */}
      <div className="flex-1 flex justify-center items-start p-6">
        {/* <Carousel /> */}
      </div>
    </div>
  );
}