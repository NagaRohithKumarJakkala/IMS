"use client";

import Link from "next/link";

interface NavLinkProps {
  href: string;
  text: string;
}

export default function NavLink({ href, text }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="block border border-white m-6 p-2 rounded select-none hover:bg-gray-800 hover:scale-95 transition duration-300"
    >
      {text}
    </Link>
  );
}
