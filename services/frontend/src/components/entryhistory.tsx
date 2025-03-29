"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import router for navigation
import { fetchProtectedData } from "@/utils/api";

const BranchEntryHistoryForm = ({ branchId }) => {
  const router = useRouter();
  const columns = ["Entry ID", "Timestamp", "User ID", "Supplier ID"];
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!branchId) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProtectedData(
          "history/entries",
          `branch_id=${branchId}`,
        );
        setHistory(data || []);
      } catch (err) {
        console.error("Error fetching branch entry history:", err);
        setError(err.message);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [branchId]);

  const handleRowClick = (entryId) => {
    router.push(`/entry/${entryId}`); // Navigate to entry details page
  };

  return (
    <div className="p-5 relative">
      <div className="absolute top-0 right-0 p-1 bg-transparent rounded-md">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 underline"
      >
        &lArr; Back
      </button>
        <span className="text-amber-400 font-bold pl-4">Branch ID:</span> {branchId}
      </div>
      <h2 className="text-yellow-300 text-xl font-bold mb-4 pt-4">
        Branch Entry History
      </h2>
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
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
          {history.length > 0
            ? history.map((record) => (
                <tr
                  key={record.entry_id}
                  className="border-b cursor-pointer hover:bg-gray-100 transition duration-200"
                  onClick={() => handleRowClick(record.entry_id)}
                >
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
            : !loading && (
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
