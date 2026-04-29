"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  // ✅ Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        );

        const data = await res.json();

        const found = data.find(
          (p: any) => p.id === Number(id) || p._id === id
        );

        setProduct(found);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ FIXED CHECKOUT LOGIC
  const handleOrder = async () => {
    // 🔐 Check if user is logged in
    if (!user) {
      setMessage("⚠️ Login required to place order");
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
            userEmail: user.email, // optional but useful
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Order failed");
      } else {
        setMessage("✅ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Server error. Try again later.");
    }
  };

  if (!product) return <h1>Loading...</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p>

      <button onClick={handleOrder}>
        Confirm Order
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}