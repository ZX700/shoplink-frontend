"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerPage() {
  const router = useRouter();

  // =========================
  // PRODUCT FORM ONLY (SIMPLIFIED)
  // =========================
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shoplink-backend-eiik.onrender.com";

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  // =========================
  // UPLOAD PRODUCT (AUTO BECOME SELLER)
  // =========================
  const uploadProduct = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/products/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          image,
          description,
          category,
        }),
      });

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Upload failed");
        return;
      }

      setMessage("Product uploaded successfully!");

      // update local user → becomes seller automatically
      const updatedUser = {
        ...user,
        isSeller: true,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // CLEAR FORM
      setName("");
      setPrice("");
      setImage("");
      setDescription("");
      setCategory("");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <h1>Seller Dashboard</h1>
          <p>
            Welcome {user?.name || user?.email}
          </p>

          {user?.isSeller && (
            <p style={{ color: "green" }}>
              ✔ You are a seller
            </p>
          )}
        </div>

        {/* PRODUCT UPLOAD ONLY */}
        <div className="card">
          <h2>Upload Product</h2>

          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <button onClick={uploadProduct} disabled={loading}>
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </div>

        {/* MESSAGE */}
        {message && <div className="message">{message}</div>}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 40px 20px;
          font-family: Arial;
        }

        .container {
          max-width: 800px;
          margin: auto;
        }

        .header {
          margin-bottom: 20px;
        }

        .card {
          background: white;
          padding: 20px;
          border-radius: 16px;
        }

        input,
        textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 10px;
        }

        button {
          width: 100%;
          padding: 12px;
          background: black;
          color: white;
          border: none;
        }

        .message {
          margin-top: 15px;
          background: white;
          padding: 10px;
        }
      `}</style>
    </div>
  );
}