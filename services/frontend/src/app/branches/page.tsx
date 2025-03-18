"use client";
import Link from "next/link";
import TopBar from "../../components/topbar";
import Details from "../../components/details";
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
    <>
      <TopBar />
      <Details />
      <div className="border border-white m-4 rounded">
        <h2 className="text-2xl m-4">Branches</h2>
        <div className="border border-white grid m-4 min-h-[200px] rounded sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {branches.map((branch, index) => (
            <BranchLink
              branchName={branch.branch_name}
              branchId={branch.branch_id}
              key={index}
            />
          ))}
          <Link
            href="/dashboard"
            className="border border-white select-none m-4 text-center flex justify-center items-center text-xl hover:bg-gray-700 transition duration-300 cursor-pointer p-4 rounded"
          >
            All branches
          </Link>
          <Link
            href="/branches/create"
            className="border border-white select-none m-4 text-center flex justify-center items-center text-xl cursor-pointer hover:bg-gray-700 transition duration-300 p-4 rounded"
          >
            + New Branch
          </Link>
        </div>
      </div>
    </>
  );
}
