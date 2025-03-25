"use client";
import { useState } from "react";

const CostForm = ({ onSubmit  }) => {
  const [formData, setFormData] = useState({
    branch_id: "",
    product_id: "",
    cost_of_item: "",
    mrp: "",
    SP: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData({
      branch_id: "",
      product_id: "",
      cost_of_item: "",
      mrp: "",
      SP: "",
    });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Cost Details</h2>
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
          name="product_id"
          placeholder="Product ID"
          value={formData.product_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          name="cost_of_item"
          placeholder="Cost of Item"
          value={formData.cost_of_item}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          name="SP"
          placeholder="Selling Price (SP)"
          value={formData.SP}
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

export default CostForm;
