import TopBar from "@/components/topbar";
import SupplierList from "../../../components/suppliers";

export default function Home() {
  return (
    <div className="min-h-screen min-w-full bg-gradient-to-br from-gray-100 to-gray-300 bg-cover">
      <TopBar />

      <SupplierList />
    </div>
  );
}
