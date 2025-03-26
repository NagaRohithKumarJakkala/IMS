"use client";
import { useState, useEffect } from "react";

const BranchHistoryForm = ({ branchId }) => {
  const columns = ["Order ID", "Timestamp", "User ID"];
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (branchId) {
      fetch(`/api/branch-sale-history/${branchId}`)
        .then((res) => res.json())
        .then((data) => setHistory(data))
        .catch((error) => console.error("Error fetching branch sale history:", error));
    }
  }, [branchId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Branch Sales History (Branch ID: {branchId})</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((record) => (
              <tr key={record.order_id} className="border-b">
                <td className="border border-gray-300 px-4 py-2">{record.order_id}</td>
                <td className="border border-gray-300 px-4 py-2">{record.timestamp}</td>
                <td className="border border-gray-300 px-4 py-2">{record.user_id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">No sale history available for this branch</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BranchHistoryForm;
