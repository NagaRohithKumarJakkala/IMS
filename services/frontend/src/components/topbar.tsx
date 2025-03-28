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
    <div className="flex justify-between border border-l-white bg-gradient-to-r from-pink-200 via-white to-purple-300 m-4 min-w-max rounded-md p-4">
      <a href="./dashboard" className="text-2xl font-bold text-neutral-950">
        IMS
      </a>
      <div className="flex items-center space-x-4">
        <span className="text-neutral-950">{username}</span>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
