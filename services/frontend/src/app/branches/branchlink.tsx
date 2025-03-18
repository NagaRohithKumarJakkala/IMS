"use client";

import Link from "next/link";
import { useGlobalContext } from "../../context/GlobalContext";

interface BranchLinkProps {
  branchId: string;
  branchName: string;
}

export default function BranchLink({ branchId, branchName }: BranchLinkProps) {
  const { setBranchName, setBranchId } = useGlobalContext();
  return (
    <Link
      href={`/dashboard`}
      onClick={() => {
        setBranchName(branchName);
        setBranchId(branchId);
      }}
      className="border border-white select-none m-4 text-center flex justify-center items-center text-xl hover:bg-gray-800 transition duration-300 cursor-pointer p-4 rounded"
    >
      {branchName}
      <br />
      {branchId}
    </Link>
  );
}
