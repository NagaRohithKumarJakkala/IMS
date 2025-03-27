"use client";
import { useState, useEffect } from "react";

const BranchEntryHistoryForm = ({ branchId }) => {
  const columns = ["Entry ID", "Timestamp", "User ID", "Supplier ID"];
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (branchId) {
      fetch(`http://localhost:8080/history/entries?branch_id=${branchId}`)
        .then((res) => res.json())
        .then((data) => setHistory(data))
        .catch((error) =>
          console.error("Error fetching branch entry history:", error),
        );
    }
  }, [branchId]);

  return (
    <div className="p-4 relative">
      <div className="absolute top-0 right-0 p-2 bg-gray-200 rounded-md shadow-md">
        <span className="font-bold">Branch ID:</span> {branchId}
      </div>
      <h2 className="text-xl font-bold mb-4">Branch Entry History</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col, index) => (
              <th
                key={index}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((record) => (
              <tr key={record.entry_id} className="border-b">
                <td className="border border-gray-300 px-4 py-2">
                  {record.entry_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.timestamp}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.user_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.supplier_id}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No entry history available for this branch
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BranchEntryHistoryForm;
