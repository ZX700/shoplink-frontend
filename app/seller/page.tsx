"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerPage() {
  const router = useRouter();

  // =========================
  // SELLER FORM
  // =========================
  const [storeName, setStoreName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  // =========================
  // PRODUCT FORM
  // =========================
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // =========================
  // STATE
  // =========================
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
  // CREATE SELLER ACCOUNT
  // =========================
  const setupSeller = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/seller/setup`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            storeName,
            bankName,
            accountNumber,
            accountName,
          }),
        }
      );

      const data = await res.json();

      console.log("SELLER RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Seller setup failed");
        setLoading(false);
        return;
      }

      setMessage("Seller account created successfully!");

    } catch (err) {
      console.error("SELLER ERROR:", err);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPLOAD PRODUCT
  // =========================
  const uploadProduct = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/products/upload`,
        {
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
        }
      );

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Upload failed");
        setLoading(false);
        return;
      }

      setMessage("Product uploaded successfully!");

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
          <div>
            <h1>Seller Dashboard</h1>
            <p>
              Welcome {user?.name || user?.email}
            </p>
          </div>
        </div>

        {/* SELLER SETUP */}
        <div className="card">
          <h2>Become a Seller</h2>

          <input
            type="text"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) =>
              setStoreName(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) =>
              setBankName(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) =>
              setAccountName(e.target.value)
            }
          />

          <button
            onClick={setupSeller}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Create Seller Account"}
          </button>
        </div>

        {/* PRODUCT UPLOAD */}
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

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
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

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 40px 20px;
          font-family: Arial, sans-serif;
        }

        .container {
          max-width: 900px;
          margin: auto;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 36px;
          margin-bottom: 8px;
          color: #111;
        }

        .header p {
          color: #666;
        }

        .card {
          background: white;
          padding: 25px;
          border-radius: 18px;
          margin-bottom: 25px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06);
        }

        .card h2 {
          margin-bottom: 20px;
          color: #111;
        }

        input,
        textarea {
          width: 100%;
          padding: 14px;
          margin-bottom: 15px;
          border-radius: 12px;
          border: 1px solid #ddd;
          font-size: 15px;
          outline: none;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: #111;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        button:hover {
          opacity: 0.9;
        }

        button:disabled {
          background: #999;
          cursor: not-allowed;
        }

        .message {
          background: white;
          padding: 18px;
          border-radius: 14px;
          text-align: center;
          font-weight: 600;
          box-shadow:
            0 10px 25px rgba(0,0,0,0.05);
        }

        @media (max-width: 768px) {
          .page {
            padding: 20px 12px;
          }

          .header h1 {
            font-size: 28px;
          }

          .card {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
}
