"use client";

import { useState } from "react";
import { getSession } from "next-auth/react";
import { fetchProtectedData } from "@/utils/api";

const EntryForm = () => {
  const [entry, setEntry] = useState({
    supplier_id: "",
    branch_id: "",
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

  const createEntry = async (entryData) => {
    const formattedEntry = {
      supplier_id: parseInt(entryData.supplier_id, 10),
      branch_id: entryData.branch_id,
      user_id: parseInt(entryData.user_id, 10),
      items: entryData.items.map(({ product_name, ...rest }) => ({
        product_id: rest.product_id,
        quantity: parseInt(rest.quantity_of_item, 10),
        cost_of_item: parseFloat(rest.cost_of_item),
      })),
    };
    try {
      const data = await fetchProtectedData("entry", "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedEntry),
      });
      alert("Entry created: " + JSON.stringify(data));
      setEntry({
        supplier_id: "",
        branch_id: "",
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
    } catch (error) {
      console.error("Error creating entry:", error);
      alert("Error creating entry");
    }
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedItems = [...entry.items];
      updatedItems[index][name] = value;
      setEntry({ ...entry, items: updatedItems });
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
    await createEntry(entry);
  };

  const totalCost = entry.items.reduce(
    (sum, item) => sum + (item.quantity_of_item * item.cost_of_item || 0),
    0,
  );

  return (
    <div className="p-5 border rounded-xl shadow-xl bg-white max-w-full mx-auto">
      <h2 className="text-2xl text-slate-900 font-serif font-extrabold mb-4">
        Add Entry Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="supplier_id"
          placeholder="Supplier ID"
          value={entry.supplier_id}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <input
          type="text"
          name="branch_id"
          placeholder="Branch ID"
          value={entry.branch_id}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <input
          type="text"
          name="user_id"
          placeholder="User ID"
          value={entry.user_id}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <div className="overflow-x-auto">
          <table className="min-w-full border border-pink-900">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-gray-300 text-black font-serif px-4 py-2">
                  Product ID
                </th>
                <th className="border border-gray-300 text-black font-serif px-4 py-2">
                  Product Name
                </th>
                <th className="border border-gray-300 text-black font-serif px-4 py-2">
                  Quantity
                </th>
                <th className="border border-gray-300 text-black font-serif px-4 py-2">
                  Cost per Item
                </th>
                <th className="border border-gray-300 text-black font-serif px-4 py-2">
                  Total Cost
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entry.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      name="product_id"
                      value={item.product_id}
                      onChange={(e) => handleChange(e, index)}
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      name="product_name"
                      value={item.product_name}
                      onChange={(e) => handleChange(e, index)}
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      disabled
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      name="quantity_of_item"
                      min="1"
                      value={item.quantity_of_item}
                      onChange={(e) => handleChange(e, index)}
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      name="cost_of_item"
                      min="0"
                      step="0.01"
                      value={item.cost_of_item}
                      onChange={(e) => handleChange(e, index)}
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {(item.quantity_of_item * item.cost_of_item).toFixed(2)}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="4"
                  className="text-black text-right font-bold py-2 px-4 border-t"
                >
                  Total Cost:
                </td>
                <td className="text-black font-mono font-bold py-2 px-4 border-t">
                  {totalCost.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="w-full bg-green-500 text-white font-extrabold py-2 rounded-xl hover:bg-green-800"
        >
          + Add Item
        </button>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-extrabold py-2 rounded-xl hover:bg-orange-800"
        >
          Submit Entry
        </button>
      </form>
    </div>
  );
};

export default EntryForm;
