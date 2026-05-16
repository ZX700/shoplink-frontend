"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserType = {
  name?: string;
  email?: string;
  isSeller?: boolean;
};

export default function SellerPage() {
  const router = useRouter();

  // =========================
  // PRODUCT FORM
  // =========================
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // 🔥 REAL IMAGE FILE
  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [user, setUser] =
    useState<UserType | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shoplink-backend-eiik.onrender.com";

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    const token =
      localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  // =========================
  // UPLOAD PRODUCT
  // =========================
  const uploadProduct = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token =
        localStorage.getItem("token");

      if (!imageFile) {
        setMessage("Please select an image");
        setLoading(false);
        return;
      }

      // 🔥 FORMDATA
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append(
        "description",
        description
      );
      formData.append("category", category);

      // 🔥 FILE
      formData.append("image", imageFile);

      const res = await fetch(
        `${API_URL}/api/products/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      if (!res.ok) {
        setMessage(
          data.error || "Upload failed"
        );
        setLoading(false);
        return;
      }

      setMessage(
        "Product uploaded successfully!"
      );

      // AUTO SELLER UPDATE
      const updatedUser = {
        ...user,
        isSeller: true,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      // CLEAR FORM
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImageFile(null);

    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <h1>Seller Dashboard</h1>

          <p>
            Welcome{" "}
            {user?.name || user?.email}
          </p>

          {user?.isSeller && (
            <p className="sellerBadge">
              ✔ Seller Active
            </p>
          )}
        </div>

        {/* UPLOAD CARD */}
        <div className="card">
          <h2>Upload Product</h2>

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
          />

          {/* 🔥 REAL FILE INPUT */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(
                e.target.files?.[0] || null
              )
            }
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          />

          <button
            onClick={uploadProduct}
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload Product"}
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="message">
            {message}
          </div>
        )}
      </div>

      {/* STYLES */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 40px 20px;
          font-family: Arial, sans-serif;
        }

        .container {
          max-width: 800px;
          margin: auto;
        }

        .header {
          margin-bottom: 25px;
        }

        .header h1 {
          font-size: 36px;
          margin-bottom: 8px;
        }

        .sellerBadge {
          color: green;
          font-weight: bold;
        }

        .card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.05);
        }

        .card h2 {
          margin-bottom: 20px;
        }

        input,
        textarea {
          width: 100%;
          padding: 14px;
          margin-bottom: 14px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 15px;
        }

        textarea {
          min-height: 120px;
        }

        button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 10px;
          background: black;
          color: white;
          font-size: 15px;
          cursor: pointer;
        }

        button:disabled {
          background: #888;
        }

        .message {
          margin-top: 20px;
          background: white;
          padding: 15px;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}