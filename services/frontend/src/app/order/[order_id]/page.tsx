"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchProtectedData } from "@/utils/api";

const OrderDetails = () => {
  const { order_id } = useParams();
  const columns = ["Product ID", "Product Name", "Quantity", "Selling Price"];
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!order_id) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProtectedData(`order?order_id=${order_id}`);
        setDetails(data?.products || []);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message);
        setDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order_id]);

  const totalCost = details.reduce(
    (sum, record) => sum + record.quantity * record.selling_price,
    0,
  );

  return (
    <div className="p-5 relative min-h-screen bg-gradient-to-br from-black to-violet-500 bg-cover">
      {/* <div className="flex justify-center min-h-screen min-w-full bg-gradient-to-br from-violet-500 to-black bg-cover"></div> */}
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 underline"
      >
        &larr; Back to Order History
      </button>
      <h2 className="text-yellow-300 text-xl font-bold mb-4">
        Order Details for Order ID: {order_id}
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
          {details.length > 0
            ? details.map((record, idx) => (
                <tr key={idx} className="border-b">
                  <td className="border border-gray-300 px-4 py-2">
                    {record.product_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.product_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${record.selling_price.toFixed(2)}
                  </td>
                </tr>
              ))
            : !loading && (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    No products found for this order
                  </td>
                </tr>
              )}
        </tbody>
        {details.length > 0 && (
          <tfoot>
            <tr className="font-bold">
              <td colSpan={3} className="text-right px-4 py-2 border-t">
                Total Cost:
              </td>
              <td className="px-4 py-2 border-t">₹{totalCost.toFixed(2)}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default OrderDetails;
