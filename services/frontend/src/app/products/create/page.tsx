import TopBar from "@/components/topbar";
import ProductForm from "../../../components/productform";

export default function Home() {
  return (
    // <div className="flex items-center justify-center min-h-screen">
    <>
      <TopBar />
      <div className="flex items-center justify-center min-h-screen min-w-full bg-gradient-to-br from-gray-100 to-gray-300 bg-cover">
        <ProductForm onSubmit="" />
      </div>
    </>
  );
}
