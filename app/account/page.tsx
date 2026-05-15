"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  // =========================
  // PRODUCT INFO
  // =========================
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // =========================
  // SELLER INFO
  // =========================
  const [storeName, setStoreName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] =
    useState("");
  const [accountName, setAccountName] =
    useState("");

  // =========================
  // UI STATE
  // =========================
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shoplink-backend-eiik.onrender.com";

  // =========================
  // AUTH GUARD
  // =========================
  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
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

      const res = await fetch(
        `${API_URL}/api/products/upload`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            // product info
            name,
            price: Number(price),
            image,
            description,
            category,

            // seller info
            storeName,
            bankName,
            accountNumber,
            accountName,
          }),
        }
      );

      const data = await res.json();

      console.log("UPLOAD:", data);

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

      // CLEAR FORM
      setName("");
      setPrice("");
      setImage("");
      setDescription("");
      setCategory("");

    } catch (err) {
      console.error(err);

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
          <h1>Account Dashboard</h1>

          <p>
            Upload products to your marketplace
          </p>
        </div>

        {/* SELLER INFO */}
        <div className="card">
          <h2>Seller Information</h2>

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
              setAccountNumber(
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) =>
              setAccountName(
                e.target.value
              )
            }
          />
        </div>

        {/* PRODUCT INFO */}
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
              setDescription(
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
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
          font-family: Arial;
        }

        .container {
          max-width: 850px;
          margin: auto;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 36px;
          margin-bottom: 10px;
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
        }

        input,
        textarea {
          width: 100%;
          padding: 14px;
          margin-bottom: 14px;
          border-radius: 12px;
          border: 1px solid #ddd;
          font-size: 15px;
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
          background: black;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          background: white;
          padding: 18px;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}