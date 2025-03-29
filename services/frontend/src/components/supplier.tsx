"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchProtectedData } from "@/utils/api";
import Link from "next/link";
const SupplierEntryHistory = ({ supplierId }) => {
  const columns = [
    "Entry ID",
    "Timestamp",
    "User ID",
    "Branch ID",
    "Total Cost",
  ];
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!supplierId) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProtectedData(
          "supplier",
          `supplier_id=${supplierId}`,
        );
        setHistory(data || []);
      } catch (err) {
        console.error("Error fetching supplier entry history:", err);
        setError(err.message);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [supplierId]);

  return (
    <div className="p-5 relative min-h-screen bg-gradient-to-br from-black to-violet-500 bg-cover">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 underline"
      >
        &larr; Back to Supplier List
      </button>

      {/* <div className="absolute top-0 right-0 p-1 bg-transparent rounded-md">
        <span className="text-amber-400 font-bold">Supplier ID:</span>{" "}
        {supplierId}
      </div> */}

      <h2 className="text-yellow-300 text-xl font-bold mb-4">
        Supplier Entry History for Supplier ID: {supplierId}
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
                <tr key={record.entry_id} className="border-b">
                  <td className="border border-gray-300 px-4 py-2">
                    <Link
                      href={`/entry/${record.entry_id}`}>
                    {record.entry_id}
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.timestamp}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.user_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.branch_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₹{record.total_cost}
                  </td>
                </tr>
              ))
            : !loading && (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    No entry history available for this supplier
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierEntryHistory;
