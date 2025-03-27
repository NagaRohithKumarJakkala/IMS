"use client";
import Link from "next/link";
import TopBar from "../../components/topbar";
import BranchLink from "./branchlink";
import { useEffect, useState } from "react";
import { fetchProtectedData } from "@/utils/api"; // Importing the protected fetch function

interface Branch {
  branch_id: string;
  branch_name: string;
}

export default function Home() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProtectedData<Branch[]>("get-branches");
        setBranches(data);
      } catch (error: any) {
        console.error("Error fetching branches:", error);
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  return (
    <div className="bg-blue-400 min-h-screen max-h-screen overflow-y-auto bg-[url('/blue.png')] bg-cover">
      <TopBar />
      <div className="border border-white m-4 rounded-xl shadow-2xl bg-white">
        <h2 className="text-3xl font-semibold text-slate-900 font-serif m-4">
          Branches
        </h2>

        {loading ? (
          <p className="text-center text-gray-700">Loading branches...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="border border-stone-600 grid m-4 min-h-[200px] rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {branches.map((branch) => (
              <BranchLink
                branchName={branch.branch_name}
                branchId={branch.branch_id}
                key={branch.branch_id}
              />
            ))}

            <Link
              href="/branches/create"
              className="border border-stone-600 shadow-xl select-none m-5 text-center flex justify-center items-center text-white bg-black text-2xl font-semibold cursor-pointer hover:bg-gray-400 hover:text-red-500 hover:scale-105 hover:shadow-2xl transition duration-300 p-4 rounded-lg"
            >
              + Add New Branch
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
