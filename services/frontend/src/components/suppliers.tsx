"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
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
    return <p className="text-center text-gray-600 text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Supplier List
      </h2>
      {suppliers.length > 0 ? (
        <ul className="border border-gray-300 rounded-lg overflow-hidden divide-y divide-gray-300">
          {suppliers.map((supplier) => (
            <li
              key={supplier.supplier_id}
              className="px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition duration-200"
            >
              <span className="text-gray-700 font-medium">
                {supplier.supplier_id} - {supplier.supplier_name}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No suppliers available.
        </p>
      )}
    </div>
  );
}
