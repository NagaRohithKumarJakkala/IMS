"use client";
import { useRouter } from "next/navigation"; // Use next/navigation in App Router (Next.js 13+)
import { useEffect, useState } from "react";
import EntryHistoryForm from "../../../components/entryhistory";

export default function Home() {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState(null);

  useEffect(() => {
    if (router) {
      const urlParams = new URLSearchParams(window.location.search);
      setQueryParams({
        user_id: urlParams.get("user_id"),
        branch_id: urlParams.get("branch_id"),
        branch_name: urlParams.get("branch_name"),
      });
    }
  }, [router]);

  if (!queryParams) {
    return <p className="text-white text-xl">Loading order history...</p>;
  }

  const { branch_id } = queryParams;

  return (
    <div className="flex justify-center min-h-screen min-w-full bg-gradient-to-br from-violet-500 to-black bg-cover">
      <EntryHistoryForm branchId={branch_id} />
    </div>
  );
}
