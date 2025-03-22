"use client";
import { useState } from "react";

const SellerForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    seller_id: "",
    seller_name: "",
  });

  const handleChange = (e : any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData({ seller_id: "", seller_name: "" });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Seller</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="seller_id"
          placeholder="Seller ID"
          value={formData.seller_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="seller_name"
          placeholder="Seller Name"
          value={formData.seller_name}
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

export default SellerForm;
