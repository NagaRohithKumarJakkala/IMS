import OrderHistoryForm from "../../../components/orderhistory";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen min-w-full bg-gradient-to-br from-violet-500 to-black bg-cover">
      <OrderHistoryForm branchId="1111" />
    </div>
  );
}
