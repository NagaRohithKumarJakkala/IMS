"use client";
import { useState } from "react";

const SupplierForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    supplier_id: "",
    supplier_name: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData({ supplier_id: "", supplier_name: "" });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New supplier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="supplier_id"
          placeholder="supplier ID"
          value={formData.supplier_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="supplier_name"
          placeholder="supplier Name"
          value={formData.supplier_name}
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

export default SupplierForm;
