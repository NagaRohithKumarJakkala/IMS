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
      // className="border border-stone-600 shadow-xl select-none m-5 text-center flex justify-center items-center 
      //            text-white bg-gradient-to-r from-slate-200 to-slate-700 text-2xl font-semibold hover:bg-black  
      //            hover:text-white hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer p-4 rounded-lg"

      // className="border-double border-stone-300 shadow-xl select-none m-5 text-center flex justify-center items-center 
      //            text-black bg-white text-2xl font-medium hover:border-doube hover:border-blue-500 hover:border-opacity-50 hover:bg-stone-300  
      //            hover:text-black hover:font-bold hover:scale-105 hover:shadow-2xl transition ease-in-out duration-300 cursor-pointer p-4 rounded-lg"

      className="tracking-wider border border-orange-300 shadow-xl select-none m-5 text-center flex justify-center items-center 
                 text-black bg-white text-2xl font-medium p-4 rounded-lg transition ease-in-out duration-300 cursor-pointer  
                 hover:border-4 hover:border-orange-500 hover:bg-orange-300 hover:bg-opacity-50  
                 hover:text-black hover:font-bold hover:scale-105 hover:shadow-2xl"

    >
      {branchName}
      <br />
      Branch ID: {branchId}
    </Link>
  );
}




// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";

// interface BranchLinkProps {
//   branchId: string;
//   branchName: string;
// }

// export default function BranchLink({ branchId, branchName }: BranchLinkProps) {
//   const searchParams = useSearchParams();
//   const userId = searchParams?.get("user_id") || "";

//   return (
//     <Link
//       href={`/dashboard?user_id=${encodeURIComponent(userId)}&branch_id=${encodeURIComponent(branchId)}&branch_name=${encodeURIComponent(branchName)}`}
//       className="relative border border-gray-300 shadow-md select-none text-center flex justify-center items-center 
//                  text-white bg-gradient-to-br from-gray-200 to-gray-500 text-2xl font-semibold  
//                  p-6 rounded-2xl backdrop-blur-xl bg-opacity-80 transition-all duration-300 
//                  hover:bg-opacity-100 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-gray-400"
//     >
//       <span className="drop-shadow-lg">{branchName}</span>
//       <br />
//       <span className="text-lg font-medium opacity-80">{branchId}</span>
//     </Link>
//   );
// }