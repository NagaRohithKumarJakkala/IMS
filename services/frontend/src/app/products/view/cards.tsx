"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url =
          query.trim() === ""
            ? "http://localhost:8080/products"
            : `http://localhost:8080/products-by-name/${encodeURIComponent(query)}`;

        console.log("Fetching:", url); // Debugging log

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        console.log("Fetched data:", data); // Debugging log

        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Reset products on error
      } finally {
        setLoading(false);
      }
    };

    // Debounce API calls (wait 500ms before making the request)
    const debounceFetch = setTimeout(fetchProducts, 500);

    return () => clearTimeout(debounceFetch);
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Products</h1>
      <input
        type="text"
        placeholder="Search by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0
          ? products.map((product) => (
              <div
                key={product.product_id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h2 className="text-xl font-semibold">
                  {product.product_name}
                </h2>
                <p className="text-gray-500">Brand: {product.product_brand}</p>
                <p className="text-gray-500">Category: {product.category}</p>
                <p className="text-gray-700">{product.description}</p>
                <p className="text-gray-700">MRP: ${product.mrp.toFixed(2)}</p>
                <p className="text-green-600 font-bold">
                  Selling Price: ${product.selling_price.toFixed(2)}
                </p>
              </div>
            ))
          : !loading && (
              <p className="text-center text-gray-600">No products found.</p>
            )}
      </div>
    </div>
  );
}
