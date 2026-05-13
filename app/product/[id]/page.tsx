"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = "https://shoplink-backend-eiik.onrender.com";

  // =========================
  // FETCH PRODUCT
  // =========================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();

        const products = Array.isArray(data)
          ? data
          : data.products || [];

        const found = products.find((p: any) => {
          return (
            String(p.id) === String(id) ||
            String(p._id) === String(id)
          );
        });

        console.log("🔎 FOUND PRODUCT:", found);

        setProduct(found || null);
      } catch (err) {
        console.log("FETCH ERROR:", err);
        setMessage("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // CHECKOUT
  // =========================
  const handleCheckout = async () => {
    if (!product) {
      setMessage("Product not available");
      return;
    }

    setMessage("Redirecting to payment...");

    try {
      const payload = {
        product: {
          id: product.id || product._id,
          name: product.name,
          price: product.price,
          category: product.category,
        },
        userEmail:
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")?.email
            : null,
      };

      console.log("📦 CHECKOUT PAYLOAD:", payload);

      const res = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("📨 CHECKOUT RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Checkout failed");
        return;
      }

      if (!data.url) {
        setMessage("No checkout URL returned");
        return;
      }

      // 🔥 Redirect to Stripe
      window.location.href = data.url;
    } catch (err) {
      console.log("CHECKOUT ERROR:", err);
      setMessage("Server error");
    }
  };

  // =========================
  // UI STATES
  // =========================
  if (loading) return <h1>Loading...</h1>;

  if (!product)
    return <h1 style={{ padding: 20 }}>Product not found</h1>;

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