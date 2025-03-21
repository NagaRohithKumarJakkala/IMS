"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProjectLink({ projectName }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id") || "";

  return (
    <Link
      href={`/branches?user_id=${encodeURIComponent(userId)}`}
      className="border border-white select-none m-4 text-center flex justify-center items-center text-xl hover:bg-gray-800 transition duration-300 cursor-pointer p-4 rounded"
    >
      {projectName}
    </Link>
  );
}
