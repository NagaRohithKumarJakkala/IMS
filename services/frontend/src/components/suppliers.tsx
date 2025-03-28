"use client";

import { useEffect, useState } from "react";
import { fetchProtectedData } from "@/utils/api";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProtectedData("get-suppliers");
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError("Failed to load suppliers");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  if (loading)
    return <p className="text-center text-gray-800 text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-700 text-xl">{error}</p>;

  return (
    <div className="p-4 min-h-screen max-w-full mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-left mt-2 mb-4 text-gray-900">
        Supplier List
      </h2>
      <div className="overflow-auto">
        <table className="w-full bg-white border border-gray-300 rounded-lg text-base">
          <thead>
            <tr className="bg-gray-300">
              <th className="py-2 px-4 border-b text-gray-900">Supplier ID</th>
              <th className="py-2 px-4 border-b text-gray-900">
                Supplier Name
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr key={supplier.supplier_id} className="hover:bg-gray-200">
                  <td className="py-2 px-4 border-b text-center text-gray-900">
                    {supplier.supplier_id}
                  </td>
                  <td className="py-2 px-4 border-b text-center text-gray-900">
                    {supplier.supplier_name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-4 px-4 text-center text-gray-900">
                  No suppliers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
