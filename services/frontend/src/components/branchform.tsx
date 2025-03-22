"use client";
import { useState } from "react";

const BranchForm = () => {
  const [formData, setFormData] = useState({
    branch_id: "",
    branch_name: "",
  });

  const handleChange = (e : any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    const response = await fetch("http://localhost:8080/branches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch_id: formData.branch_id,
        branch_name: formData.branch_name,
      }),
    });

    if (response.ok) {
      alert("Branch added successfully!");
    } else {
      alert("Failed to add branch");
    }
  };

  return (
    <div className="flex justify-center items-center min-w-full min-h-screen bg-[url('/dino-green.png')] bg-cover"> 
      <div className="p-5 border rounded-xl shadow-xl bg-green-200 max-w-md mx-auto">
        <h2 className="text-2xl text-slate-900 font-extrabold mb-4">Add Branch Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="branch_id"
            placeholder="Branch ID"
            value={formData.branch_id}
            onChange={handleChange}
            className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
            required
          />
          <input
            type="text"
            name="branch_name"
            placeholder="Branch Name"
            value={formData.branch_name}
            onChange={handleChange}
            className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-extrabold py-2 rounded-xl hover:bg-orange-800 hover:shadow-2xl"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;
