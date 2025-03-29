"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const [username, setUsername] = useState("Loading...");
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.username) {
        setUsername(session.user.username);
      } else {
        setUsername("Guest");
      }
    };
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Prevent NextAuth default redirect
    router.replace("/"); // Ensure navigation to homepage
  };

  return (
    <div className="flex justify-between border border-transparent bg-[url('/space.webp')] bg-opacity-50 shadow-md m-4 min-w-max rounded-lg p-4 sticky top-0 z-50">
      <a href="./dashboard" className="font-extrabold text-3xl font-sans tracking-wide text-white drop-shadow-md hover:text-violet-400 transition duration-200">
        IMS
      </a>
      <div className="flex items-center space-x-6">
        <button
          onClick={() => router.back()}
          className="text-blue-400 underline hover:text-blue-300 transition duration-200"
        >
          &lArr; Back
        </button>
        <span className="text-white font-medium">{username}</span>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white text-center px-5 py-2 rounded-xl shadow-lg hover:bg-red-800 hover:scale-95 transition duration-200"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default TopBar;






// "use client";
// import { getSession, signOut } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const TopBar = () => {
//   const [username, setUsername] = useState("Loading...");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchSession = async () => {
//       const session = await getSession();
//       if (session?.user?.username) {
//         setUsername(session.user.username);
//       } else {
//         setUsername("Guest");
//       }
//     };
//     fetchSession();
//   }, []);

//   const handleSignOut = async () => {
//     await signOut({ redirect: false }); // Prevent NextAuth default redirect
//     router.replace("/"); // Ensure navigation to homepage
//   };

//   return (
//     <div className="flex justify-between border border-l-white bg-gradient-to-r from-pink-200 via-white to-purple-300 m-4 min-w-max rounded-md p-4 sticky top-0 z-50">
//       <a href="./dashboard" className="font-extrabold text-2xl font-sans tracking-wider text-neutral-950">
//         IMS
//       </a>
//       <div className="flex items-center space-x-4">
//       <button
//         onClick={() => router.back()}
//         className="text-blue-500 underline"
//       >
//         &larr; Back
//       </button>
//         <span className="text-neutral-950">{username}</span>
//         <button
//           onClick={handleSignOut}
//           className="bg-red-500 text-white text-center px-4 py-1 rounded-lg hover:bg-red-700 hover:scale-95 transition duration-200"
//         >
//           Log Out
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TopBar;
