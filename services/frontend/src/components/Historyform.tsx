"use client";
import { useState, useEffect } from "react";

const HistoryForm = () => {
  const columns = ["Order ID", "Timestamp", "User ID", "Branch ID"];
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/sale-history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error("Error fetching sale history:", error));
  }, []);

  return (
    <div className="p-4">
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
                <td className="border border-gray-300 px-4 py-2">{record.branch_id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">No sale history available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryForm;
