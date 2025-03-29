"use client";

import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetchProtectedData } from "@/utils/api";

const BranchForm = () => {
  const [formData, setFormData] = useState({
    branch_id: "",
    branch_name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const data = await fetchProtectedData("branches", "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch_id: formData.branch_id,
          branch_name: formData.branch_name,
        }),
      });
      alert("Branch added successfully: " + JSON.stringify(data));
      setFormData({ branch_id: "", branch_name: "" });
    } catch (error) {
      console.error("Error adding branch:", error);
      alert("Failed to add branch");
    }
  };

  return (
    <div className="flex justify-center items-center min-w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 bg-cover">
      <div className="p-5 border rounded-xl shadow-xl bg-white max-w-md mx-auto">
        <h2 className="text-2xl text-slate-900 font-serif font-extrabold mb-4">
          Add Branch Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="branch_id" className="text-gray-900 font-bold mb-1">
          Branch ID
        </label>
          <input
            type="text"
            name="branch_id"
            placeholder="Branch ID"
            value={formData.branch_id}
            onChange={handleChange}
            className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
            required
          />
          <label htmlFor="branch_name" className="text-gray-900 font-bold mb-1">
          Branch Name
        </label>
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
            className="w-full bg-orange-500 text-white font-extrabold py-2 rounded-xl hover:bg-orange-800 hover:scale-105 hover:shadow-2xl transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;
