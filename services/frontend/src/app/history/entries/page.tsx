"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import OrderHistoryForm from "../../../components/orderhistory";

export default function Home() {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setQueryParams(router.query); // Store query params when router is ready
    }
  }, [router.isReady, router.query]);

  if (!queryParams) {
    return <p className="text-white text-xl">Loading order data...</p>;
  }

  const { user_id, branch_id, branch_name } = queryParams;

  return (
    <div className="flex justify-center min-h-screen min-w-full bg-gradient-to-br from-violet-500 to-black bg-cover">
      <OrderHistoryForm
        branchId={branch_id}
        branchName={branch_name}
        userId={user_id}
      />
    </div>
  );
}
