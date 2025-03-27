"use client";

import TopBar from "../../components/topbar";
import NavLink from "../../components/navlink";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id") || "";
  const branchId = searchParams?.get("branch_id") || "";
  const branchName = searchParams?.get("branch_name") || "";

  return (
    <>
      <TopBar />
      <div className="bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 flex flex-col m-4 rounded">
      {/* </div><div className="bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 min-h-screen flex flex-col sm:grid sm:grid-cols-2 m-4 p-4 rounded-lg shadow-lg"> */}
        <div className="text-3xl font-serif font-semibold text-white m-6 col-span-2">Suppliers</div>
        <div className="border border-white m-4 rounded">
          <NavLink
            href={`/supplier/view?user_id=${encodeURIComponent(userId)}&branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}`}
            text="View Suppliers"
          />
          <NavLink
            href={`/supplier/add?user_id=${encodeURIComponent(userId)}&branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}`}
            text="Add New Supplier"
          />
        </div>
      </div>
    </>
  );
}
