"use client";
import { useState } from "react";

const SellingForm = () => {
  const [rows, setRows] = useState([
    { product_id: "", quantity_of_item: "", SP: "" },
  ]);

  const addRow = () => {
    setRows([...rows, { product_id: "", quantity_of_item: "", SP: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(rows);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-full mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Selling Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Product ID</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">
                  Selling Price
                </th>
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
                      className="w-full px-2 py-1 border rounded"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      value={row.quantity_of_item}
                      onChange={(e) =>
                        handleChange(index, "quantity_of_item", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      step="0.01"
                      value={row.SP}
                      onChange={(e) =>
                        handleChange(index, "SP", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded"
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
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          + Add Row
        </button>
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

export default SellingForm;
