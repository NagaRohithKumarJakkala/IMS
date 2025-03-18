"use client";

import Link from "next/link";
import { useGlobalContext } from "../../context/GlobalContext";

interface ProjectLinkProps {
  projectName: string;
}

export default function ProjectLink({ projectName }: ProjectLinkProps) {
  const { setProjectName } = useGlobalContext();
  return (
    <Link
      href={`/branches`}
      onClick={() => setProjectName(projectName)}
      className="border border-white select-none m-4 text-center flex justify-center items-center text-xl hover:bg-gray-800 transition duration-300 cursor-pointer p-4 rounded"
    >
      {projectName}
    </Link>
  );
}
