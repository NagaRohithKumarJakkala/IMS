"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BranchLinkProps {
  branchId: string;
  branchName: string;
}

export default function BranchLink({ branchId, branchName }: BranchLinkProps) {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id") || "";

  return (
    <Link
      href={`/dashboard?user_id=${encodeURIComponent(userId)}&branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}`}
      className="border border-stone-600 shadow-xl select-none m-5 text-center flex justify-center items-center text-white bg-gradient-to-r from-slate-200 to-slate-700 text-2xl font-semibold hover:bg-black  hover:text-white hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer p-4 rounded-lg"
    >
      {branchName}
      <br />
      {branchId}
    </Link>
  );
}
