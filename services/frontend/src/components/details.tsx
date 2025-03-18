"use client";
import { useGlobalContext } from "../context/GlobalContext";
const Details = () => {
  const { projectName, branchName, branchId, username } = useGlobalContext();
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 border border-white bg-black m-4">
      <div className="m-4">Project Name: {projectName}</div>
      <div className="m-4">Branch Name: {branchName}</div>
      <div className="m-4">Branch Id:{branchId}</div>
      <div className="m-4">User Name:{username}</div>
    </div>
  );
};
export default Details;
