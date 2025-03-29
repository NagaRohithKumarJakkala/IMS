"use client";

import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetchProtectedData } from "@/utils/api";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    product_id: "",
    product_brand: "",
    product_name: "",
    description: "",
    category: "",
    mrp: "",
    selling_price: "",
  });

  const [message, setMessage] = useState("");

  const createProduct = async (formData) => {
    try {
      const data = await fetchProtectedData("products", "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setMessage("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      setMessage("Error creating product");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      mrp: parseFloat(formData.mrp),
      selling_price: parseFloat(formData.selling_price),
    };

    await createProduct(formattedData);

    setFormData({
      product_id: "",
      product_brand: "",
      product_name: "",
      description: "",
      category: "",
      mrp: "",
      selling_price: "",
    });
  };

  return (
    <div className="p-5 border rounded-xl shadow-xl bg-white max-w-md mx-auto">
      <h2 className="text-2xl text-slate-900 font-serif font-extrabold mb-4">
        Add Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="product_id" className="text-gray-900 font-bold mb-1">
          Product ID
        </label>
        <input
          type="text"
          name="product_id"
          placeholder="Product ID"
          value={formData.product_id}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-1"
          required
        />

        <label htmlFor="product_name" className="text-gray-900 font-bold my-1">
          Product Name
        </label>
        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
          required
        />

        <label htmlFor="product_brand" className="text-gray-900 font-bold my-1">
          Product Brand
        </label>
        <input
          type="text"
          name="product_brand"
          placeholder="Product Brand"
          value={formData.product_brand}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
          required
        />

        <label htmlFor="category" className="text-gray-900 font-bold my-1">
          Category
        </label>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
          required
        />

        <label htmlFor="description" className="text-gray-900 font-bold my-1">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
          required
        ></textarea>

        <label htmlFor="mrp" className="text-gray-900 font-bold my-1">
          MRP
        </label>
        <input
          type="number"
          step="0.01"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
          required
        />

        <label htmlFor="selling_price" className="text-gray-900 font-bold my-1">
          Selling Price
        </label>
        <input
          type="number"
          step="0.01"
          name="selling_price"
          placeholder="Selling Price (SP)"
          value={formData.selling_price}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
          required
        />

        {message && <p className="text-green-600 font-bold">{message}</p>}

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

export default ProductForm;
