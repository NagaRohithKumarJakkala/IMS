"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProtectedData } from "@/utils/api";
import TopBar from "@/components/topbar";

interface Product {
  product_id: string;
  product_name: string;
  product_brand: string;
  category: string;
  description: string;
  mrp: number;
  quantity: number;
  selling_price: number;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id") || "";
  const branchId = searchParams?.get("branch_id") || "";
  const branchName = searchParams?.get("branch_name") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!branchId) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = [];
        if (query.trim())
          queryParams.push(`query=${encodeURIComponent(query)}`);
        if (category.trim())
          queryParams.push(`category=${encodeURIComponent(category)}`);

        const data = await fetchProtectedData<{ products: Product[] }>(
          queryParams.length > 0 ? "filtered-products" : "products",
          queryParams.length > 0 ? `${queryParams.join("&")}` : "",
        );
        setProducts(data.products || []);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError("No products found.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchProducts, 500);
    return () => clearTimeout(debounceFetch);
  }, [query, category, branchId]);

  return (
    <>
      <TopBar />
      <div className="bg-gradient-to-br from-gray-100 to-green-200 min-h-screen bg-gray-200 p-6">
        <h1 className="font-sans text-black text-2xl font-bold text-center mb-6">
          Products
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
         <input
           type="text"
           placeholder="Search by name..."
           value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-sans text-black w-full p-2 mb-4 border rounded-xl"
          />
          <input
            type="text"
            placeholder="Search by category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="font-sans text-black w-full p-2 mb-4 border rounded-xl"
          />
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0
            ? products.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white shadow-lg rounded-lg p-4"
                >
                  <h2 className="text-slate-500 text-xl font-serif font-semibold">
                    {product.product_name}
                  </h2>
                  <p className="text-gray-500">
                    Product ID: {product.product_id}
                  </p>
                  <p className="text-gray-500">
                    Brand: {product.product_brand}
                  </p>
                  <p className="text-gray-500">Category: {product.category}</p>
                  <p className="text-gray-700">
                    Description: {product.description}
                  </p>
                  <p className="text-gray-700">
                    MRP: ₹{product.mrp.toFixed(2)}
                  </p>
                  <p className="text-green-600 font-bold">
                    Selling Price: ₹{product.selling_price.toFixed(2)}
                  </p>
                </div>
              ))
            : !loading && (
                <p className="text-center text-gray-600">No products found.</p>
              )}
        </div>
      </div>
    </>
  );
}
