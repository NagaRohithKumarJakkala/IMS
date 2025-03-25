// "use client";
// import { useState } from "react";

// const ExtensibleTable = () => {
//   const columns = ["ID", "Name", "Status", "Actions"];

//   const [rows, setRows] = useState([
//     { id: 1, name: "Project A", status: "Active" },
//     { id: 2, name: "Project B", status: "Inactive" },
//   ]);

//   const addRow = () => {
//     const newRow = {
//       id: rows.length + 1,
//       name: `Project ${String.fromCharCode(65 + rows.length)}`,
//       status: "Pending",
//     };
//     setRows([...rows, newRow]);
//   };

//   const handleEdit = (id, field, value) => {
//     setRows(
//       rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
//     );
//   };

//   return (
//     <div className="p-4">
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200">
//             {columns.map((col, index) => (
//               <th
//                 key={index}
//                 className="border border-gray-300 px-4 py-2 text-left"
//               >
//                 {col}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row) => (
//             <tr key={row.id} className="border-b">
//               <td className="border border-gray-300 px-4 py-2">{row.id}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 <input
//                   type="text"
//                   value={row.name}
//                   onChange={(e) => handleEdit(row.id, "name", e.target.value)}
//                   className="w-full px-2 py-1 border border-gray-300"
//                 />
//               </td>
//               <td className="border border-gray-300 px-4 py-2">
//                 <input
//                   type="text"
//                   value={row.status}
//                   onChange={(e) => handleEdit(row.id, "status", e.target.value)}
//                   className="w-full px-2 py-1 border border-gray-300"
//                 />
//               </td>
//               <td className="border border-gray-300 px-4 py-2">
//                 <button className="px-3 py-1 bg-blue-500 text-white rounded">
//                   Edit
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <button
//         onClick={addRow}
//         className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
//       >
//         + Add Row
//       </button>
//     </div>
//   );
// };

// export default ExtensibleTable;
