"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BranchLinkProps {
  branchId: string;
  branchName: string;
}

export default function BranchLink({ branchId, branchName }: BranchLinkProps) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id") || "";

  return (
    <Link
      href={`/dashboard?user_id=${encodeURIComponent(userId)}&branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}`}
      className="border border-white select-none m-4 text-center flex justify-center items-center text-xl hover:bg-gray-800 transition duration-300 cursor-pointer p-4 rounded"
    >
      {branchName}
      <br />
      {branchId}
    </Link>
  );
}
