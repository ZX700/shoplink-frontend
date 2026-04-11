"use client";

import { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    const res = await fetch("https://shoplink-backend-eiik.onrender.com/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- ADD PRODUCT ----------------
  const addProduct = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);

    if (file) {
      formData.append("image", file);
    }

    const res = await fetch("https://shoplink-backend-eiik.onrender.com/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (data._id) {
      setName("");
      setPrice("");
      setFile(null);
      fetchProducts();
    } else {
      alert("Failed (admin only)");
    }
  };

  // ---------------- DELETE PRODUCT ----------------
  const deleteProduct = async (id: string) => {
    const token = localStorage.getItem("token");

    await fetch(`https://shoplink-backend-eiik.onrender.com/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {/* FORM */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* PRODUCT LIST */}
      <div>
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
              border: "1px solid #eee",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <img
              src={p.image}
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />

            <div style={{ flex: 1 }}>
              <b>{p.name}</b>
              <p>${p.price}</p>
            </div>

            <button
              onClick={() => deleteProduct(p._id)}
              style={{ background: "red", color: "white" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}