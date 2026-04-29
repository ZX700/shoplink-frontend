"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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
        console.log("PRODUCT ERROR:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // -------------------------
  // HANDLE ORDER (FINAL FIXED VERSION)
  // -------------------------
  const handleOrder = async () => {
    const storedUser = localStorage.getItem("user");

    console.log("USER FROM STORAGE:", storedUser);

    // ❌ Not logged in
    if (!storedUser) {
      setMessage("⚠️ Login required to place order");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (err) {
      console.log("PARSE ERROR:", err);
      setMessage("Session error. Please login again.");
      return;
    }

    if (!user?.email) {
      setMessage("⚠️ Invalid session. Please login again.");
      return;
    }

    setMessage("Processing order...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            // 🔥 IMPORTANT: backend may expect auth header
            Authorization: `Bearer ${user.email}`,
          },
          body: JSON.stringify({
            productId: id,
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
        console.log("INVALID RESPONSE:", text);
        setMessage("Server error (invalid response)");
        return;
      }

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