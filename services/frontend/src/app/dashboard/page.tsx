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
      <div className="bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 min-h-screen p-4 rounded-lg shadow-lg">
        <div className="text-3xl font-serif font-semibold text-white m-4">
          Dashboard
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Side: Navigation */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-md min-h-[600] flex flex-col justify-start">
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
            {accessLevel === "customer" && (
              <p className="text-white text-center mt-2">
                No additional actions available.
              </p>
            )}
          </div>

          {/* Right Side: Announcements */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-md select-none min-h-[300px] flex flex-col">
            <h3 className="text-xl font-semibold text-white">Announcements</h3>
            <div className="border-t border-white mt-2 flex-grow"></div>
          </div>
        </div>
      </div>
    </>
  );
}
