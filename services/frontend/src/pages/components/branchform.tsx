"use client";
import { useState } from "react";

const BranchForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    branch_id: "",
    branch_name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData({ branch_id: "", branch_name: "" });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Branch Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="branch_id"
          placeholder="Branch ID"
          value={formData.branch_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="branch_name"
          placeholder="Branch Name"
          value={formData.branch_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BranchForm;
