"use client";

import { useState } from "react";

export default function SellerPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [message, setMessage] = useState("");

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price), category }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to add product");
      } else {
        setMessage("Product uploaded successfully!");
        setName("");
        setPrice("");
      }
    } catch {
      setMessage("Server error");
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Seller Dashboard</h1>

      <form onSubmit={handleAddProduct}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ marginLeft: 10 }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Furniture</option>
        </select>

        <button type="submit" style={{ marginLeft: 10 }}>
          Upload
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
