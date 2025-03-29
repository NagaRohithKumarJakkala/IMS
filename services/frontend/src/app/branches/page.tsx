"use client";

import Link from "next/link";
import TopBar from "../../components/topbar";
import BranchLink from "./branchlink";
import { useEffect, useState } from "react";
import { fetchProtectedData } from "@/utils/api";
import { getSession } from "next-auth/react";

interface Branch {
  branch_id: string;
  branch_name: string;
}

export default function Home() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<string | null>(null);

  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProtectedData<Branch[]>("branches");
        setBranches(data.length > 0 ? data : []);
      } catch (error: any) {
        console.error("Error fetching branches:", error);
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        setAccessLevel(session.user.level_of_access);
      }
    };

    fetchSession();
    loadBranches();
  }, []);

  return (
    <div className="bg-blue-400 min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-gray-100 to-orange-200 bg-cover">
      <TopBar />
      <div className="border border-white m-4 rounded-xl shadow-2xl bg-white">
        <h2 className="text-3xl font-semibold text-slate-900 font-serif m-4">
          Branches
        </h2>

        {loading ? (
          <p className="text-center text-gray-700">Loading branches...</p>
        ) : (
          <div className="border border-stone-600 grid m-4 min-h-[200px] rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {branches.length > 0 ? (
              branches.map((branch) => (
                <BranchLink
                  branchName={branch.branch_name}
                  branchId={branch.branch_id}
                  key={branch.branch_id}
                />
              ))
            ) : (
              <p className="text-center text-gray-700 col-span-full">
                No branches found.
              </p>
            )}

            {accessLevel === "admin" && (
              <Link
                href="/branches/create"
                // className="border border-stone-600 shadow-xl select-none m-5 text-center flex justify-center items-center text-white bg-gradient-to-r from-slate-200 to-slate-700 text-2xl font-semibold cursor-pointer hover:bg-gradient-to-r hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-2xl transition duration-300 p-4 rounded-lg"
                className="tracking-wider border border-blue-300 shadow-xl select-none m-5 text-center flex justify-center items-center 
                 text-black bg-white text-2xl font-medium p-4 rounded-lg transition ease-in-out duration-300 cursor-pointer  
                 hover:border-4 hover:border-blue-500 hover:bg-blue-300 hover:bg-opacity-50  
                 hover:text-black hover:font-bold hover:scale-105 hover:shadow-2xl"
              >
                + Add New Branch
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
