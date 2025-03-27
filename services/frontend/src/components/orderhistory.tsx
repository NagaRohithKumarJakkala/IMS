"use client";
import { useState, useEffect } from "react";

const OrderHistoryForm = ({ branchId }) => {
  const columns = ["Order ID", "Timestamp", "User ID"];
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (branchId) {
      fetch(`http://localhost:8080/history/orders?branch_id=${branchId}`)
        .then((res) => res.json())
        .then((data) => setHistory(data))
        .catch((error) =>
          console.error("Error fetching branch sale history:", error),
        );
    }
  }, [branchId]);

  return (
    <div className="p-5 relative">
      <div className="absolute top-0 right-0 p-1 bg-transparent rounded-md">
      <span className="text-amber-400 font-bold">Branch ID:</span> {branchId}
      </div>
      <h2 className="text-yellow-300 text-xl font-bold mb-4">Branch Sales History</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col, index) => (
              <th
                key={index}
                className="text-indigo-900 border border-gray-300 px-4 py-2 text-left"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((record) => (
              <tr key={record.order_id} className="border-b">
                <td className="border border-gray-300 px-4 py-2">
                  {record.order_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.timestamp}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.user_id}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No sale history available for this branch
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistoryForm;
