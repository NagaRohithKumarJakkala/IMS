"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import { fetchProtectedData } from "@/utils/api";

const OrderForm = () => {
  const searchParams = useSearchParams();
  const branch_id = searchParams.get("branch_id");

  const [order, setOrder] = useState({
    branch_id: branch_id || "",
    user_id: "",
    items: [
      {
        product_id: "",
        product_name: "",
        quantity_of_item: "",
        selling_price: "",
      },
    ],
  });

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session?.user?.id) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          user_id: session.user.id,
        }));
      }
    };
    fetchUser();
  }, []);

  const fetchProductDetails = async (productID, index) => {
    if (!productID) return;

    try {
      const response = await fetch(
        `http://localhost:8080/product/${productID}`,
      );
      if (!response.ok) throw new Error("Product not found");

      const data = await response.json();
      const { product } = data;

      setOrder((prevOrder) => {
        const updatedItems = [...prevOrder.items];
        updatedItems[index].product_name = product.product_name;
        updatedItems[index].selling_price = product.selling_price;
        return { ...prevOrder, items: updatedItems };
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedItems = [...order.items];
      updatedItems[index][name] = value;
      setOrder({ ...order, items: updatedItems });

      if (name === "product_id") {
        if (typingTimeout) clearTimeout(typingTimeout);

        const newTimeout = setTimeout(() => {
          fetchProductDetails(value, index);
        }, 800);

        setTypingTimeout(newTimeout);
      }
    } else {
      setOrder({ ...order, [name]: value });
    }
  };

  const addRow = () => {
    setOrder({
      ...order,
      items: [
        ...order.items,
        {
          product_id: "",
          product_name: "",
          quantity_of_item: "",
          selling_price: "",
        },
      ],
    });
  };

  const removeRow = (index) => {
    setOrder({ ...order, items: order.items.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await fetchProtectedData("order", "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch_id: order.branch_id,
          user_id: parseInt(order.user_id, 10),
          items: order.items.map(({ product_name, ...rest }) => ({
            product_id: rest.product_id,
            quantity_of_item: parseInt(rest.quantity_of_item, 10),
            selling_price: parseFloat(rest.selling_price),
          })),
        }),
      });
      alert("Order placed successfully: " + JSON.stringify(data));
      setOrder({
        branch_id: branch_id || "",
        user_id: order.user_id,
        items: [
          {
            product_id: "",
            product_name: "",
            quantity_of_item: "",
            selling_price: "",
          },
        ],
      });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order, please try again.");
    }
  };

  const totalCost = order.items.reduce((sum, item) => {
    const cost =
      parseFloat(item.selling_price) * parseInt(item.quantity_of_item) || 0;
    return sum + cost;
  }, 0);

  return (
    <div className="p-5 border rounded-xl shadow-xl bg-white max-w-full mx-auto">
      <h2 className="text-2xl text-gray-900 font-serif font-extrabold mb-4">
        Place Order
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="branch_id"
          placeholder="Branch ID"
          value={order.branch_id}
          disabled
          className="border w-full px-3 py-2 rounded-md shadow-md bg-gray-200 text-gray-700"
        />
        <input
          type="text"
          name="user_id"
          placeholder="User ID"
          value={order.user_id}
          disabled
          className="border w-full px-3 py-2 rounded-md shadow-md bg-gray-200 text-gray-700"
        />

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-gray-900">Product ID</th>
              <th className="border px-2 py-1 text-gray-900">Product Name</th>
              <th className="border px-2 py-1 text-gray-900">Quantity</th>
              <th className="border px-2 py-1 text-gray-900">Selling Price</th>
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
                    required
                    className="w-full px-2 py-1 border rounded text-gray-900"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="product_name"
                    value={item.product_name}
                    disabled
                    className="w-full px-2 py-1 border rounded bg-gray-200 text-gray-700"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    name="quantity_of_item"
                    value={item.quantity_of_item}
                    onChange={(e) => handleChange(e, index)}
                    required
                    className="w-full px-2 py-1 border rounded text-gray-900"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    name="selling_price"
                    value={item.selling_price}
                    onChange={(e) => handleChange(e, index)}
                    required
                    className="w-full px-2 py-1 border rounded text-gray-900"
                  />
                </td>
                <td>
                  <button
                    onClick={() => removeRow(index)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-lg font-bold text-gray-900">
          Total Cost: ${totalCost.toFixed(2)}
        </p>
        <button
          type="button"
          onClick={addRow}
          className="w-full bg-green-500 text-white font-extrabold py-2 rounded-xl hover:bg-green-800 hover:scale-95 transition duration-200"
        >
          + Add Item
        </button>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-extrabold py-2 rounded-xl hover:bg-orange-800 hover:scale-95 transition duration-200"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
