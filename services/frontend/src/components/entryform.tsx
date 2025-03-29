"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import { fetchProtectedData } from "@/utils/api";

const EntryForm = () => {
  const searchParams = useSearchParams();
  const branch_id = searchParams.get("branch_id");

  const [entry, setEntry] = useState({
    supplier_id: "",
    branch_id: branch_id || "",
    user_id: "",
    items: [
      {
        product_id: "",
        product_name: "",
        quantity_of_item: "",
        cost_of_item: "",
      },
    ],
  });

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session?.user?.id) {
        setEntry((prevEntry) => ({
          ...prevEntry,
          user_id: session.user.id,
        }));
      }
    };
    fetchUser();
  }, []);

  // Fetch product details from backend when product_id is entered
  const fetchProductDetails = async (productID, index) => {
    if (!productID) return;

    try {
      const response = await fetch(
        `http://localhost:8080/product/${productID}`,
      );
      if (!response.ok) throw new Error("Product not found");

      const data = await response.json();
      const { product } = data;

      setEntry((prevEntry) => {
        const updatedItems = [...prevEntry.items];
        updatedItems[index].product_name = product.product_name; // Auto-fill product name
        return { ...prevEntry, items: updatedItems };
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // Debounce API calls to prevent multiple requests while typing
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedItems = [...entry.items];
      updatedItems[index][name] = value;
      setEntry({ ...entry, items: updatedItems });

      // Fetch product name only when product_id is entered
      if (name === "product_id") {
        if (typingTimeout) clearTimeout(typingTimeout);

        const newTimeout = setTimeout(() => {
          fetchProductDetails(value, index);
        }, 800); // 800ms delay before making the API call

        setTypingTimeout(newTimeout);
      }
    } else {
      setEntry({ ...entry, [name]: value });
    }
  };

  const addRow = () => {
    setEntry({
      ...entry,
      items: [
        ...entry.items,
        {
          product_id: "",
          product_name: "",
          quantity_of_item: "",
          cost_of_item: "",
        },
      ],
    });
  };

  const removeRow = (index) => {
    setEntry({ ...entry, items: entry.items.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await fetchProtectedData("entry", "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplier_id: parseInt(entry.supplier_id, 10),
          branch_id: entry.branch_id,
          user_id: parseInt(entry.user_id, 10),
          items: entry.items.map(({ product_name, ...rest }) => ({
            product_id: rest.product_id,
            quantity_of_item: parseInt(rest.quantity_of_item, 10),
            cost_of_item: parseFloat(rest.cost_of_item),
          })),
        }),
      });
      alert("Entry created successfully: " + JSON.stringify(data));
      setEntry({
        supplier_id: "",
        branch_id: branch_id || "",
        user_id: entry.user_id,
        items: [
          {
            product_id: "",
            product_name: "",
            quantity_of_item: "",
            cost_of_item: "",
          },
        ],
      });
    } catch (error) {
      console.error("Error submitting entry:", error);
      alert("Error creating entry, please try again.");
    }
  };

  const totalCost = entry.items.reduce((sum, item) => {
    const cost =
      parseFloat(item.cost_of_item) * parseInt(item.quantity_of_item) || 0;
    return sum + cost;
  }, 0);

  return (
    <div className="p-5 border rounded-xl shadow-xl bg-white max-w-full mx-auto">
      <h2 className="text-2xl text-gray-900 font-serif font-extrabold mb-4">
        Add Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="supplier_id"
          placeholder="Supplier ID"
          value={entry.supplier_id}
          onChange={handleChange}
          required
          className="border w-full px-3 py-2 rounded-md shadow-md text-gray-900"
        />
        <input
          type="text"
          name="branch_id"
          placeholder="Branch ID"
          value={entry.branch_id}
          disabled
          className="border w-full px-3 py-2 rounded-md shadow-md bg-gray-200 text-gray-700"
        />
        <input
          type="text"
          name="user_id"
          placeholder="User ID"
          value={entry.user_id}
          disabled
          className="border w-full px-3 py-2 rounded-md shadow-md bg-gray-200 text-gray-700"
        />

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-gray-900">Product ID</th>
              <th className="border px-2 py-1 text-gray-900">Product Name</th>
              <th className="border px-2 py-1 text-gray-900">Quantity</th>
              <th className="border px-2 py-1 text-gray-900">Selling Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entry.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="product_id"
                    value={item.product_id}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full px-2 py-1 border rounded text-gray-900"
                    required
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="product_name"
                    value={item.product_name}
                    disabled
                    className="w-full px-2 py-1 border rounded bg-gray-200 text-gray-700"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    name="quantity_of_item"
                    min="1"
                    value={item.quantity_of_item}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full px-2 py-1 border rounded text-gray-900"
                    required
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    name="cost_of_item"
                    onChange={(e) => handleChange(e, index)}
                    value={item.cost_of_item}
                    className="w-full px-2 py-1 border rounded text-gray-900"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-lg font-bold text-gray-900">
          Total Cost: ${totalCost.toFixed(2)}
        </p>

        <button
          type="button"
          onClick={addRow}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          + Add Item
        </button>
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
        >
          Submit Entry
        </button>
      </form>
    </div>
  );
};

export default EntryForm;
