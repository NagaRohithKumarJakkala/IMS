"use client";
import { useState } from "react";

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
  const createProduct = async (formData : any) => {
    const response = await fetch("http://localhost:8080/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return response.json();
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

    try {
      const data = await createProduct(formattedData);
      alert("Product created: " + JSON.stringify(data));
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }

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
    <div className="p-5 border rounded-xl shadow-xl bg-green-200 max-w-md mx-auto">
      <h2 className="text-2xl text-slate-900 font-serif font-extrabold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="product_id"
          placeholder="Product ID"
          value={formData.product_id}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <input
          type="text"
          name="product_brand"
          placeholder="Product Brand"
          value={formData.product_brand}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        ></textarea>
        <input
          type="number"
          step="0.01"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <input
          type="number"
          step="0.01"
          name="selling_price"
          placeholder="Selling Price (SP)"
          value={formData.selling_price}
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

export default ProductForm;
