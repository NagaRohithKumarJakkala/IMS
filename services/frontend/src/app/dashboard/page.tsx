"use client";

import TopBar from "../../components/topbar";
import NavLink from "../../components/navlink";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const branchId = searchParams?.get("branch_id") || "";
  const branchName = searchParams?.get("branch_name") || "";
  const userId = searchParams?.get("user_id") || "";

  return (
    <>
      <TopBar />
      <div className="border border-white flex flex-col sm:grid sm:grid-cols-2 m-4 rounded">
        <div className="text-2xl m-4 col-span-2">DashBoard</div>
        <div className="border border-white m-4 rounded">
          <NavLink
            href={`/products/view?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
            text="View Products"
          />
          <NavLink
            href={`/products/add?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
            text="Add Products"
          />
          <NavLink
            href={`/products/sell?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
            text="Sell Products"
          />
          <NavLink
            href={`/analysis?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
            text="Analysis"
          />
          <NavLink
            href={`/refill-recommendations?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
            text="Refill Recommendations"
          />
          <NavLink
            href={`/history?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
            text="History"
          />
        </div>
        <div className="border border-white m-4 rounded select-none">
          <h3 className="m-2"> Announcements</h3>
          <div className="border border-white m-4"></div>
        </div>
      </div>
    </>
  );
}
