"use client";

import TopBar from "../../components/topbar";
import NavLink from "../../components/navlink";
import { useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchProtectedData } from "@/utils/api";

export default function Home() {
  const searchParams = useSearchParams();
  const branchId = searchParams?.get("branch_id") || "";
  const branchName = searchParams?.get("branch_name") || "";
  const userId = searchParams?.get("user_id") || "";
  const [accessLevel, setAccessLevel] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        setAccessLevel(session.user.level_of_access);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProtectedData("announcements");
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
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
                  href={`/products/create?branch_id=${branchId}&branch_name=${branchName}&user_id=${userId}`}
                  text="Add Product"
                />
                <NavLink
                  href={`/products/update?branch_id=${branchId}&branch_name=${branchName}&user_id=${userId}`}
                  text="Update Product"
                />
                <NavLink
                  href={`/products/add?branch_id=${branchId}&branch_name=${branchName}&user_id=${userId}`}
                  text="New Entry"
                />
                <NavLink
                  href={`/products/sell?branch_id=${branchId}&branch_name=${branchName}&user_id=${userId}`}
                  text="New Order"
                />
                {/*<NavLink
                  href={`/refill-recommendations?branch_id=${branchId}&branch_name=${branchName}&user_id=${userId}`}
                  text="Refill Recommendations"
                />
                */}
              </>
            )}
            {(accessLevel === "admin" ||
              accessLevel === "auditor" ||
              accessLevel === "staff") && (
              <>
                {/*<NavLink
                  href={`/analysis?branch_id=${branchId}&branch_name=${branchName}&user_id=${userId}`}
                  text="Analysis"
                />
                */}
                <NavLink
                  href={`/supplier?branch_id=${branchId}&branch_name=${branchName}&user_id=${userId}`}
                  text="Supplier Details"
                />
                <NavLink
                  href={`/history?branch_id=${branchId}&branch_name=${branchName}&user_id=${userId}`}
                  text="History"
                />
              </>
            )}
            {accessLevel === "admin" && (
              <>
                <NavLink
                  href={`/add-employees?branch_id=${branchId}&branch_name=${branchName}&user_id=${userId}`}
                  text="add employees"
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
            <div className="border-t border-white mt-2 flex-grow overflow-y-auto max-h-64">
              {loading ? (
                <p className="text-white">Loading announcements...</p>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : announcements.length === 0 ? (
                <p className="text-white">No announcements available</p>
              ) : (
                <ul className="text-white list-disc pl-4">
                  {announcements.map((announcement) => (
                    <li key={announcement.announcement_id} className="mt-1">
                      {announcement.announcement_text} (
                      {announcement.announcement_time})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
