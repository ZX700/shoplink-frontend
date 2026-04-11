"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://shoplink-backend-eiik.onrender.com/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const addToCart = (product: any) => {
    setCart([...cart, { ...product, qty: 1 }]);
  };

  const checkout = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://shoplink-backend-eiik.onrender.com/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: cart }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Checkout failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Shoplink Store</h1>

      <h2>Products</h2>
      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          <p>
            {p.name} - ${p.price}
          </p>
          <button onClick={() => addToCart(p)}>Add to Cart</button>
        </div>
      ))}

      <hr />

      <h2>Cart ({cart.length})</h2>
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}