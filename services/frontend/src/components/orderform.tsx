"use client";
import { useState } from "react";

type OrderItem = {
  product_id: string;
  quantity_of_item: number;
  selling_price: number;
};

type OrderData = {
  branch_id: string;
  user_id: string;
  items: OrderItem[];
};

const OrderForm = () => {
  const [order, setOrder] = useState<OrderData>({
    branch_id: "",
    user_id: "",
    items: [{ product_id: "", quantity_of_item: 1, selling_price: 0 }],
  });

  const addRow = () => {
    setOrder({
      ...order,
      items: [
        ...order.items,
        { product_id: "", quantity_of_item: 1, selling_price: 0 },
      ],
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number | null = null,
  ) => {
    const { name, value } = e.target;

    if (index !== null) {
      const updatedItems = [...order.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]:
          name === "quantity_of_item" || name === "selling_price"
            ? value === ""
              ? 0
              : Number(value) // Ensures numeric values
            : value,
      };
      setOrder({ ...order, items: updatedItems });
    } else {
      setOrder({
        ...order,
        [name]: name === "user_id" ? value.replace(/\D/g, "") : value, // Ensures user_id remains numeric
      });
    }
  };

  const removeRow = (index: number) => {
    setOrder({ ...order, items: order.items.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedOrder = {
      ...order,
      user_id: parseInt(order.user_id, 10), // Ensure user_id is an integer
      items: order.items.map((item) => ({
        ...item,
        quantity_of_item: parseInt(item.quantity_of_item.toString(), 10),
        selling_price: parseFloat(item.selling_price.toString()),
      })),
    };

    try {
      const response = await fetch("http://localhost:8080/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedOrder),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const data = await response.json();
      alert("Order submitted successfully: " + JSON.stringify(data));

      // Reset form after submission
      setOrder({
        branch_id: "",
        user_id: "",
        items: [{ product_id: "", quantity_of_item: 1, selling_price: 0 }],
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting order");
    }
  };

  return (
    <div className="p-5 border rounded-xl shadow-xl bg-white max-w-full mx-auto">
      <h2 className="text-2xl text-slate-900 font-serif font-extrabold mb-4">
        Place New Order
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="branch_id"
          placeholder="Branch ID"
          value={order.branch_id}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <input
          type="text"
          name="user_id"
          placeholder="User ID"
          value={order.user_id}
          onChange={handleChange}
          className="border-gray-500 w-full px-3 py-2 border rounded-md shadow-md text-black font-sans"
          required
        />
        <div className="overflow-x-auto">
          <table className="min-w-full border border-pink-900">
            <thead>
              <tr className="bg-gray-200">
              <th className="border border-gray-300 text-black font-serif px-4 py-2">Product ID</th>
              <th className="border border-gray-300 text-black font-serif px-4 py-2">Quantity</th>
              <th className="border border-gray-300 text-black font-serif px-4 py-2">Selling Price</th>
              <th className="border border-gray-300 text-black font-serif px-4 py-2">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="product_id"
                      value={item.product_id}
                      onChange={(e) => handleChange(e, index)}
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      name="quantity_of_item"
                      min="1"
                      value={item.quantity_of_item}
                      onChange={(e) => handleChange(e, index)}
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      name="selling_price"
                      min="0"
                      step="0.01"
                      value={item.selling_price}
                      onChange={(e) => handleChange(e, index)}
                      className="text-black font-sans w-full px-2 py-1 border-gray-500 shadow-md rounded-lg"
                      required
                    />
                  </td>
                  <td className="border px-2 py-1">
                    {(item.quantity_of_item * item.selling_price).toFixed(2)}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="w-full bg-green-500 text-white font-extrabold py-2 rounded-xl hover:bg-green-800"
        >
          + Add Item
        </button>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-extrabold py-2 rounded-xl hover:bg-orange-800 hover:scale-y-110 hover:shadow-2xl transition duration-300"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
