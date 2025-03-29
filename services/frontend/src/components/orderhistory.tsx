"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { fetchProtectedData } from "@/utils/api";
import { useRouter } from "next/navigation";

const OrderHistoryForm = ({ branchId }) => {
  const columns = ["Order ID", "Timestamp", "User ID"];
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!branchId) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProtectedData(
          "history/orders",
          `branch_id=${branchId}`,
        );
        setHistory(data || []);
      } catch (err) {
        console.error("Error fetching branch sale history:", err);
        setError(err.message);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [branchId]);

  return (
    <div className="p-5 relative">
      <div className="absolute top-0 right-0 p-1 bg-transparent rounded-md">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 underline pb-3"
      >
        &lArr; Back
      </button>
        <span className="text-amber-400 font-bold pl-4">Branch ID:</span> {branchId}
      </div>
      <h2 className="text-yellow-300 text-xl font-bold mb-4 pt-4">
        Branch Sales History
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
                <tr key={record.order_id} className="border-b">
                  <td
                    className="border border-gray-300 px-4 py-2 text-white cursor-pointer underline"
                    onClick={() => router.push(`/order/${record.order_id}`)}
                  >
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
            : !loading && (
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

// "use client";

// import { useState, useEffect } from "react";
// import { getSession } from "next-auth/react";
// import { fetchProtectedData } from "@/utils/api";

// const OrderHistoryForm = ({ branchId }) => {
//   const columns = ["Order ID", "Timestamp", "User ID"];
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!branchId) return;

//     const fetchHistory = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await fetchProtectedData(
//           "history/orders",
//           `branch_id=${branchId}`,
//         );
//         setHistory(data || []);
//       } catch (err) {
//         console.error("Error fetching branch sale history:", err);
//         setError(err.message);
//         setHistory([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [branchId]);

//   return (
//     <div className="p-5 relative">
//       <div className="absolute top-0 right-0 p-1 bg-transparent rounded-md">
//         <span className="text-amber-400 font-bold">Branch ID:</span> {branchId}
//       </div>
//       <h2 className="text-yellow-300 text-xl font-bold mb-4">
//         Branch Sales History
//       </h2>
//       {loading && <p className="text-center text-gray-600">Loading...</p>}
//       {error && <p className="text-center text-red-500">{error}</p>}
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200">
//             {columns.map((col, index) => (
//               <th
//                 key={index}
//                 className="text-indigo-900 border border-gray-300 px-4 py-2 text-left"
//               >
//                 {col}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {history.length > 0
//             ? history.map((record) => (
//                 <tr key={record.order_id} className="border-b">
//                   <td className="border border-gray-300 px-4 py-2">
//                     {record.order_id}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {record.timestamp}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {record.user_id}
//                   </td>
//                 </tr>
//               ))
//             : !loading && (
//                 <tr>
//                   <td colSpan={3} className="text-center p-4">
//                     No sale history available for this branch
//                   </td>
//                 </tr>
//               )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrderHistoryForm;
