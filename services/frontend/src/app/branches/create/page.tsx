"use client";
import TopBar from "@/components/topbar";
import BranchForm from "../../../components/branchform";

export default function Home() {
  return (
    <>
      <TopBar />
      <div className="flex items-center justify-center min-h-screen">
        <BranchForm />
      </div>
    </>
  );
}
