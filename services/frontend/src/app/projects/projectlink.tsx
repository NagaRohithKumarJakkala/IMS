"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProjectLink({ projectName } :any) {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id") || "";

  return (
    <Link
      href={`/branches?user_id=${encodeURIComponent(userId)}`}
      
      className="max-h-[180] border border-orange-300 shadow-xl select-none m-5 text-center flex justify-center items-center
                 text-black bg-white text-3xl font-medium hover:border-4 hover:border-orange-500 hover:bg-orange-300 hover:bg-opacity-50  
                hover:text-black hover:font-bold hover:scale-95 duration-300 cursor-pointer p-4 rounded-lg"

      // className="max-h-[180] border border-orange-300 shadow-xl select-none m-5 text-center flex justify-center items-center
      //            text-black bg-white text-3xl font-medium hover:bg-gradient-to-r hover:bg-black  hover:text-white transition hover:shadow-2xl 
      //             hover:scale-105 duration-300 cursor-pointer p-4 rounded-lg"
    >
      {projectName}
    </Link>
  );
}
