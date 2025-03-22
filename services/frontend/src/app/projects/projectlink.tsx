"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProjectLink({ projectName }) {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id") || "";

  return (
    <Link
      href={`/branches?user_id=${encodeURIComponent(userId)}`}
      className="border border-stone-600 shadow-xl select-none m-4 text-center flex justify-center items-center text-white bg-teal-500 text-xl font-semibold hover:bg-teal-700 hover:text-white transition duration-300 cursor-pointer p-4 rounded-lg"
    >
      {projectName}
    </Link>
  );
}
