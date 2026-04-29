"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [message, setMessage] = useState("");

  // 🔍 FETCH PRODUCT
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
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔐 CHECKOUT (CLEAN VERSION)
  const handleOrder = async () => {
    const storedUser = localStorage.getItem("user");

    console.log("STORED USER:", storedUser);

    if (!storedUser) {
      setMessage("⚠️ Login required");
      return;
    }

    const user = JSON.parse(storedUser);

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
          },
          body: JSON.stringify({
            productId: id,
            paymentMethod: "pay_now",
            userEmail: user.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Order failed");
      } else {
        setMessage("✅ Order placed successfully!");
      }
    } catch (error) {
      console.log("ORDER ERROR:", error);
      setMessage("❌ Server error");
    }
  };

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