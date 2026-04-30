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
        console.log("PRODUCT FETCH ERROR:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // -------------------------
  // CHECKOUT FUNCTION (FINAL)
  // -------------------------
  const handleOrder = async () => {
    setMessage("DEBUG TEST");
    const storedUser = localStorage.getItem("user");

    console.log("USER FROM STORAGE:", storedUser);

    if (!storedUser) {
      setMessage("⚠️ You are not logged in");
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch {
      setMessage("⚠️ Session corrupted. Login again.");
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
          },
          body: JSON.stringify({
            productId: Number(id),
            paymentMethod: "pay_now",
            userEmail: user.email,
          }),
        }
      );

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("RESPONSE:", data);

      if (!res.ok) {
        // 🔥 SHOW REAL ERROR (NOT "login required")
        setMessage(`❌ ${data.error || "Order failed"}`);
        return;
      }

      setMessage("✅ Order placed successfully!");
    } catch (error) {
      console.log("ORDER ERROR:", error);
      setMessage("❌ Server connection failed");
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