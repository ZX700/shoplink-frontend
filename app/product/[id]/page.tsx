"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
console.log("USER:", localStorage.getItem("user"));
export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [message, setMessage] = useState("");

  // -------------------------
  // FETCH PRODUCT
  // -------------------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        );

        const data = await res.json();
        const products = Array.isArray(data) ? data : data.products;

        const found = products?.find(
          (p: any) => p.id === Number(id) || p._id === id
        );

        setProduct(found);
      } catch (err) {
        console.log("PRODUCT FETCH ERROR:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // -------------------------
  // CHECKOUT FUNCTION (FIXED)
  // -------------------------
  const handleOrder = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setMessage("⚠️ Login required");
      return;
    }

    const user = JSON.parse(storedUser);

    setMessage("Processing order...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: Number(id), // 🔥 FIXED TYPE ISSUE
            paymentMethod: "pay_now",
            userEmail: user.email,
          }),
        }
      );

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("BAD RESPONSE:", text);
        setMessage("Server error (invalid response)");
        return;
      }

      console.log("ORDER RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Order failed");
        return;
      }

      setMessage("✅ Order placed successfully!");
    } catch (error) {
      console.log("ORDER ERROR:", error);
      setMessage("❌ Server error");
    }
  };

  // -------------------------
  // UI
  // -------------------------
  if (!product) return <h1>Loading...</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>
      <p>{product.category}</p>
      <p>${product.price}</p>

      <button onClick={handleOrder}>
        Confirm Order
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}