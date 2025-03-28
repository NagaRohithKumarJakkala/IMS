import TopBar from "@/components/topbar";
import SupplierForm from "../../../components/supplierform";

export default function Home() {
  return (
    <>
      <TopBar />
      <div className="flex justify-center items-center min-h-screen min-w-full bg-gradient-to-br from-gray-100 to-gray-300 bg-cover">
        <SupplierForm />
      </div>
    </>
  );
}
