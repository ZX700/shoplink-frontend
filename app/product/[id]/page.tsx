
"use client";
console.log("🔥 BUILD CHECK 123");
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [message, setMessage] = useState("");

  const API_URL = "https://shoplink-backend-eiik.onrender.com"; // 🔥 HARDCODED

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

        console.log("PRODUCT:", found);

        setProduct(found);
      } catch (err) {
        console.log("FETCH ERROR:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // CHECKOUT
  // =========================
  const handleOrder = async () => {
    const storedUser = localStorage.getItem("user");

    console.log("RAW USER:", storedUser);

    if (!storedUser) {
      setMessage("⚠️ Login required");
      return;
    }

    const user = JSON.parse(storedUser);

    console.log("PARSED USER:", user);

    const payload = {
      productId: Number(id),
      paymentMethod: "pay_now",
      userEmail: user.email,
    };

    console.log("PAYLOAD:", payload);

    setMessage("Processing...");

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("SERVER RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Order failed");
        return;
      }

      setMessage("✅ Order placed!");
    } catch (err) {
      console.log("ERROR:", err);
      setMessage("Server error");
    }
  };

  if (!product) return <h1>Loading...</h1>;

  return (
    <div style={{ padding: 20 }}>
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