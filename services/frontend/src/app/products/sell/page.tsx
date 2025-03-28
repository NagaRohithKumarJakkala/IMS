import TopBar from "@/components/topbar";
import OrderForm from "../../../components/orderform";

export default function Home() {
  return (
    <>
      <TopBar />
      <div className="min-h-screen min-w-full bg-gradient-to-br from-gray-100 to-gray-300 bg-cover">
        <OrderForm />
      </div>
    </>
  );
}
