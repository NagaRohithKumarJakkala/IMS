"use client";

import TopBar from "../../../components/topbar";
import NavLink from "../../../components/navlink";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id") || "";
  const branchId = searchParams.get("branch_id") || "";
  const branchName = searchParams.get("branch_name") || "";

  return (
    <>
      <TopBar />
      <div className="bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 flex flex-col m-4 rounded">
        <div className="text-3xl font-serif font-semibold text-white m-6 col-span-2">Stocks</div>
        <div className="border border-white m-4 rounded">
          <NavLink
            href={`/products/view/branch?user_id=${encodeURIComponent(userId)}&branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}`}
            text="View Product & Quantities in Branch"
          />
          <NavLink
            href={`/products/view/all?user_id=${encodeURIComponent(userId)}&branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}`}
            text="View All Products"
          />
        </div>
      </div>
    </>
  );
}
