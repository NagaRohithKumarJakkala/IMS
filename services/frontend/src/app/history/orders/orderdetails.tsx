"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProtectedData } from "@/utils/api";

const OrderDetails = ({ params }) => {
  const { orderId } = params;
  const columns = ["Product ID", "Product Name"];
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProtectedData(
          "history/order_details",
          `order_id=${orderId}`
        );
        setDetails(data || []);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message);
        setDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="p-5 relative">
      <button onClick={() => router.back()} className="mb-4 text-blue-500 underline">
        &larr; Back to Order History
      </button>
      <h2 className="text-yellow-300 text-xl font-bold mb-4">
        Order Details for Order ID: {orderId}
      </h2>
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col, index) => (
              <th key={index} className="text-indigo-900 border border-gray-300 px-4 py-2 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {details.length > 0
            ? details.map((record, idx) => (
                <tr key={idx} className="border-b">
                  <td className="border border-gray-300 px-4 py-2">{record.product_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{record.product_name}</td>
                </tr>
              ))
            : !loading && (
                <tr>
                  <td colSpan={2} className="text-center p-4">
                    No products found for this order
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetails;
