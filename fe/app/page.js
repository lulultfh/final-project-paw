// import Navbar from "../components/navbar";
import SidebarLayout from "@/components/cust/sidebar";

export default function HomePage() {
  return (
    <div style={{ display: "flex" }}>
      <SidebarLayout />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* <Navbar /> */}
      </div>
    </div>
  );
}