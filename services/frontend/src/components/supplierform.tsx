"use client";

import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetchProtectedData } from "@/utils/api";

const SupplierForm = () => {
  const [formData, setFormData] = useState({
    supplier_id: "",
    supplier_name: "",
  });

  const createSupplier = async (supplierData) => {
    try {
      const data = await fetchProtectedData("supplier", "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      });
      alert("Supplier created: " + JSON.stringify(data));
      setFormData({ supplier_id: "", supplier_name: "" });
    } catch (error) {
      console.error("Error creating supplier:", error);
      alert("Error creating supplier");
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formattedData = {
      supplier_id: parseInt(formData.supplier_id, 10),
      supplier_name: formData.supplier_name.trim(),
    };
    await createSupplier(formattedData);
  };

  return (
    <div className="p-5 border rounded-xl shadow-xl bg-white max-w-md mx-auto">
      <h2 className="text-2xl text-slate-900 font-serif font-extrabold mb-4">
        Add New Supplier
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="supplier_id"
          placeholder="Supplier ID"
          value={formData.supplier_id}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <input
          type="text"
          name="supplier_name"
          placeholder="Supplier Name"
          value={formData.supplier_name}
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
  );
};

export default SupplierForm;
