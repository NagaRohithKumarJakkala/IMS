"use client";
import { useState } from "react";

const DurationForm = () => {
  const [rows, setRows] = useState([
    {
      product_id: "",
      seller_id: "",
      manufactured_date: "",
      duration_value: "",
      duration_unit: "D",
      quantity_of_item: "",
    },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        product_id: "",
        seller_id: "",
        manufactured_date: "",
        duration_value: "",
        duration_unit: "D",
        quantity_of_item: "",
      },
    ]);
  };

  const handleChange = (index: any, field: any, value: any) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(rows);
  };

  return (
    <div className="p-5 border rounded-xl shadow-xl bg-green-200 max-w-full mx-auto">
      <h2 className="text-2xl text-slate-900 font-extrabold mb-4">Add Duration Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-pink-900">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-gray-300 text-black font-serif px-4 py-2">Product ID</th>
                <th className="border border-gray-300 text-black font-serif px-4 py-2">Seller ID</th>
                <th className="border border-gray-300 text-black font-serif px-4 py-2">Manufactured Date</th>
                <th className="border border-gray-300 text-black font-serif px-4 py-2">Duration Value</th>
                <th className="border border-gray-300 text-black font-serif px-4 py-2">Duration Unit</th>
                <th className="border border-gray-300 text-black font-serif px-4 py-2">Quantity of Item</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      value={row.product_id}
                      onChange={(e) =>
                        handleChange(index, "product_id", e.target.value)
                      }
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      value={row.seller_id}
                      onChange={(e) =>
                        handleChange(index, "seller_id", e.target.value)
                      }
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="date"
                      value={row.manufactured_date}
                      onChange={(e) =>
                        handleChange(index, "manufactured_date", e.target.value)
                      }
                      className={`font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg ${
                        row.manufactured_date ? "text-black" : "text-gray-300"
                      }`}
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      value={row.duration_value}
                      onChange={(e) =>
                        handleChange(index, "duration_value", e.target.value)
                      }
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <select
                      value={row.duration_unit}
                      onChange={(e) =>
                        handleChange(index, "duration_unit", e.target.value)
                      }
                      className={`font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg ${
                        row.duration_unit ? "text-black" : "text-gray-300"
                      }`}
                      required
                    >
                      <option value="" className="text-gray-400">Select Duration</option>
                      <option value="D" className="text-black">Days</option>
                      <option value="M" className="text-black">Months</option>
                      <option value="Y" className="text-black">Years</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      value={row.quantity_of_item}
                      onChange={(e) =>
                        handleChange(index, "quantity_of_item", e.target.value)
                      }
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="w-full bg-green-500 text-white font-extrabold py-2 rounded-xl hover:bg-green-800"
        >
          + Add Row
        </button>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-extrabold py-2 rounded-xl hover:bg-orange-800 hover:shadow-2xl"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DurationForm;
