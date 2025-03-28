"use client";

import TopBar from "../../components/topbar";
import NavLink from "../../components/navlink";
import { useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const branchId = searchParams?.get("branch_id") || "";
  const branchName = searchParams?.get("branch_name") || "";
  const userId = searchParams?.get("user_id") || "";
  const [accessLevel, setAccessLevel] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        setAccessLevel(session.user.level_of_access);
      }
    };
    fetchSession();
  }, []);

  return (
    <>
      <TopBar />
      <div className="bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 min-h-screen flex flex-col sm:grid sm:grid-cols-2 m-4 p-4 rounded-lg shadow-lg">
        <div className="text-3xl font-serif font-semibold text-white m-4 col-span-2">
          Dashboard
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-md">
          <NavLink
            href={`/products/view?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
            text="Stock details"
          />
          {(accessLevel === "admin" || accessLevel === "staff") && (
            <>
              <NavLink
                href={`/products/create?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
                text="Add Product"
              />
              <NavLink
                href={`/products/add?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
                text="New Entry"
              />
              <NavLink
                href={`/products/sell?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
                text="New Order"
              />

              <NavLink
                href={`/refill-recommendations?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
                text="Refill Recommendations"
              />
            </>
          )}
          {(accessLevel === "admin" || accessLevel === "auditor") && (
            <>
              <NavLink
                href={`/analysis?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
                text="Analysis"
              />
              <NavLink
                href={`/supplier?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
                text="Supplier Details"
              />
              <NavLink
                href={`/history?branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}&user_id=${encodeURIComponent(userId)}`}
                text="History"
              />
            </>
          )}
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-md select-none">
          <h3 className="text-xl font-semibold text-white">Announcements</h3>
          <div className="border-t border-white mt-2"></div>
        </div>
      </div>
    </>
  );
}
