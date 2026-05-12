"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [message, setMessage] = useState("");

  const API_URL = "https://shoplink-backend-eiik.onrender.com";

  // =========================
  // FETCH PRODUCT
  // =========================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();

        const products = Array.isArray(data) ? data : data.products;

        const found = products?.find(
          (p: any) => p.id === Number(id) || p._id === id
        );

        setProduct(found);
      } catch (err) {
        console.log("FETCH ERROR:", err);
        setMessage("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // STRIPE CHECKOUT (STEP 4 FIX)
  // =========================
  const handleCheckout = async () => {
    if (!product) {
      setMessage("Product not loaded");
      return;
    }

    setMessage("Redirecting to payment...");

    try {
      const res = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });

      const data = await res.json();

      console.log("CHECKOUT RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Checkout failed");
        return;
      }

      // 🔥 Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.log("CHECKOUT ERROR:", err);
      setMessage("Server error");
    }
  };

  if (!product) return <h1>Loading...</h1>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.name}</h1>
      <p>{product.category}</p>
      <p>${product.price}</p>

      <button
        onClick={handleCheckout}
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Checkout
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}