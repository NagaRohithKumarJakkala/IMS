"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProjectLink({ projectName } :any) {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id") || "";

  return (
    <Link
      href={`/branches?user_id=${encodeURIComponent(userId)}`}
      className=" max-h-[200] border border-stone-600 shadow-xl select-none m-5 text-center flex justify-center items-center text-white bg-gradient-to-r from-slate-200 to-slate-700 text-3xl font-semibold hover:bg-gradient-to-r hover:bg-black  hover:text-white transition hover:shadow-2xl hover:scale-105 duration-300 cursor-pointer p-4 rounded-lg"
    >
      {projectName}
    </Link>
  );
}
