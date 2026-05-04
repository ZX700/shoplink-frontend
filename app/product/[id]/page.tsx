"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null); // ✅ NEW

  // =========================
  // LOAD USER FROM LOCALSTORAGE
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        console.log("USER LOADED:", parsed);
      } catch (err) {
        console.log("USER PARSE ERROR:", err);
      }
    } else {
      console.log("NO USER FOUND");
    }
  }, []);

  // =========================
  // FETCH PRODUCT
  // =========================
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

  // =========================
  // FINAL CHECKOUT FIX
  // =========================
  const handleOrder = async () => {
    console.log("USER STATE:", user);

    if (!user || !user.email) {
      setMessage("⚠️ Login required");
      return;
    }

    const bodyData = {
      productId: Number(id),
      paymentMethod: "pay_now",
      userEmail: user.email,
    };

    console.log("SENDING:", bodyData);

    setMessage("Processing order...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      const data = await res.json();

      console.log("RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Order failed");
        return;
      }

      setMessage("✅ Order placed successfully!");
    } catch (err) {
      console.log("ORDER ERROR:", err);
      setMessage("❌ Server error");
    }
  };

  // =========================
  // UI
  // =========================
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