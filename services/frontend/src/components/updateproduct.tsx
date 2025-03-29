"use client";

import { useState, useEffect } from "react";
import { fetchProtectedData } from "@/utils/api";

const ProductUpdateForm = () => {
  const [formData, setFormData] = useState({
    product_id: "",
    product_brand: "",
    product_name: "",
    description: "",
    category: "",
    mrp: "",
    selling_price: "",
  });

  const [isFetched, setIsFetched] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetchProtectedData(`product/${productId}`, "", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.product) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...response.product,
        }));
        setIsFetched(true);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Error fetching product details");
    }
  };

  useEffect(() => {
    if (formData.product_id) {
      setIsFetched(false);
      if (typingTimeout) clearTimeout(typingTimeout);

      const timeout = setTimeout(() => {
        fetchProductDetails(formData.product_id);
      }, 1000);

      setTypingTimeout(timeout);

      return () => clearTimeout(timeout); // Cleanup on unmount or re-run
    }
  }, [formData.product_id]);

  const updateProduct = async (formData) => {
    try {
      const response = await fetchProtectedData(
        `product/${formData.product_id}`,
        "",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      alert("Product updated: " + JSON.stringify(response));
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
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

    await updateProduct(formattedData);
  };

  return (
    <div className="p-5 border rounded-xl shadow-xl bg-white max-w-md mx-auto">
      <h2 className="text-2xl text-slate-900 font-serif font-extrabold mb-4">
        Update Product
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
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
          required
        />
        <label htmlFor="product_brand" className="text-gray-900 font-bold mb-1">
          Product Brand
        </label>
        <input
          type="text"
          name="product_brand"
          placeholder="Product Brand"
          value={formData.product_brand}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
        />
        <label htmlFor="product_name" className="text-gray-900 font-bold mb-1">
          Product Name
        </label>
        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
        />
        <label htmlFor="category" className="text-gray-900 font-bold mb-1">
          Category
        </label>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
        />
        <label htmlFor="description" className="text-gray-900 font-bold mb-1">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans mb-3"
        ></textarea>
        <label htmlFor="mrp" className="text-gray-900 font-bold mb-1">
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
        />
        <label htmlFor="selling_price" className="text-gray-900 font-bold mb-1">
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
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-extrabold py-2 rounded-xl hover:bg-blue-800 hover:scale-105 hover:shadow-2xl transition duration-300"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default ProductUpdateForm;
