"use client";

import TopBar from "../../components/topbar";
import NavLink from "../../components/navlink";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id") || "";
  const branchId = searchParams.get("branch_id") || "";
  const branchName = searchParams.get("branch_name") || "";

  return (
    <>
      <TopBar />
      <div className="border border-white flex flex-col m-4 rounded">
        <div className="text-2xl m-4 col-span-2">Suppliers</div>
        <div className="border border-white m-4 rounded">
          <NavLink
            href={`/supplier/view?user_id=${encodeURIComponent(userId)}&branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}`}
            text="View suppliers"
          />
          <NavLink
            href={`/supplier/add?user_id=${encodeURIComponent(userId)}&branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}`}
            text="Add new Supplier"
          />
        </div>
      </div>
    </>
  );
}
