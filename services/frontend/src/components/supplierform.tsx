"use client";
import { useState } from "react";

const SupplierForm = () => {
  const [formData, setFormData] = useState({
    supplier_id: "",
    supplier_name: "",
  });

  const createSupplier = async (supplierData) => {
    try {
      const response = await fetch("http://localhost:8080/supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to create supplier: ${errorMessage}`);
      }

      const data = await response.json();
      alert("Supplier created: " + JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating supplier: " + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      supplier_id: parseInt(formData.supplier_id, 10), // Ensure it's a number
      supplier_name: formData.supplier_name.trim(), // Remove extra spaces
    };
    await createSupplier(formattedData);
    setFormData({ supplier_id: "", supplier_name: "" });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Supplier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="supplier_id"
          placeholder="Supplier ID"
          value={formData.supplier_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="supplier_name"
          placeholder="Supplier Name"
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
