import SidebarLayout from "@/components/cust/sidebar";

export default function TransactionPage() {
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