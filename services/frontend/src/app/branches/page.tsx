"use client";
import Link from "next/link";
import TopBar from "../../components/topbar";
import BranchLink from "./branchlink";
import { useEffect, useState } from "react";

interface Branch {
  branch_id: string;
  branch_name: string;
}

export default function Home() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-branches");
        if (!response.ok) throw new Error("Failed to fetch branches");

        const data: Branch[] = await response.json(); // Convert response to Branch[]
        setBranches(data); // Store it in state
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="bg-blue-400 min-h-screen max-h-screen overflow-y-auto bg-[url('/blue.png')] bg-cover">
      <TopBar />
      <div className="border border-white m-4 rounded-xl shadow-2xl bg-white">
      <h2 className="text-3xl font-semibold text-slate-900 font-serif m-4">Branches</h2>
        <div className="border border-stone-600 grid m-4 min-h-[200px] rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {branches.map((branch, index) => (
            <BranchLink
              branchName={branch.branch_name}
              branchId={branch.branch_id}
              key={index}
            />
          ))}
          {/* <Link
            href="/dashboard"
            className="border border-stone-600 shadow-xl select-none m-5 text-center flex justify-center items-center text-white bg-teal-500 text-2xl font-semibold hover:bg-teal-700 hover:text-white hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer p-4 rounded-lg"
          >
            All branches
          </Link> */}
          <Link
            href="/branches/create"
            className="border border-stone-600 shadow-xl select-none m-5 text-center flex justify-center items-center text-white bg-black text-2xl font-semibold cursor-pointer hover:bg-gray-400 hover:text-red-500 hover:scale-105 hover:shadow-2xl transition duration-300 p-4 rounded-lg"
          >
            + Add New Branch
          </Link>
        </div>
      </div>
    </div>
  );
}
