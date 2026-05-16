"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerPage() {
  const router = useRouter();

  // =========================
  // PRODUCT INFO
  // =========================
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // =========================
  // IMAGE
  // =========================
  const [imageFile, setImageFile] = useState<File | null>(null);

  // =========================
  // SELLER INFO
  // =========================
  const [sellerName, setSellerName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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

    const parsedUser = JSON.parse(storedUser);

    setUser(parsedUser);

    // auto-fill existing seller info
    setSellerName(parsedUser.storeName || "");
    setBankName(parsedUser.bankName || "");
    setAccountNumber(parsedUser.accountNumber || "");
    setAccountName(parsedUser.accountName || "");
    setPhoneNumber(parsedUser.phoneNumber || "");
  }, [router]);

  // =========================
  // IMAGE UPLOAD
  // =========================
  const uploadImage = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Image upload failed");
    }

    return data.imageUrl;
  };

  // =========================
  // UPLOAD PRODUCT
  // =========================
  const uploadProduct = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Login required");
        return;
      }

      // upload image first
      const uploadedImage = await uploadImage();

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
            image: uploadedImage,
            description,
            category,

            // seller credentials
            storeName: sellerName,
            sellerName,
            bankName,
            accountNumber,
            accountName,
            phoneNumber,
          }),
        }
      );

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Upload failed");
        return;
      }

      setMessage("Product uploaded successfully!");

      // update local user
      const updatedUser = {
        ...user,
        isSeller: true,
        storeName: sellerName,
        bankName,
        accountNumber,
        accountName,
        phoneNumber,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      // clear product form only
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

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <h1>Seller Dashboard</h1>

          <p>
            Welcome {user?.email}
          </p>

          {user?.isSeller && (
            <div className="sellerBadge">
              Verified Seller
            </div>
          )}
        </div>

        {/* CARD */}
        <div className="card">

          {/* SELLER INFO */}
          <h2>Seller Information</h2>

          <input
            placeholder="Store Name"
            value={sellerName}
            onChange={(e) =>
              setSellerName(e.target.value)
            }
          />

          <input
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value)
            }
          />

          <input
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) =>
              setBankName(e.target.value)
            }
          />

          <input
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(e.target.value)
            }
          />

          <input
            placeholder="Account Name"
            value={accountName}
            onChange={(e) =>
              setAccountName(e.target.value)
            }
          />

          {/* PRODUCT INFO */}
          <h2>Upload Product</h2>

          <input
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

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          />

          {/* IMAGE */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(
                e.target.files?.[0] || null
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

          {message && (
            <div className="message">
              {message}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(
            to bottom right,
            #0f172a,
            #111827
          );
          padding: 40px 20px;
          color: white;
          font-family: Arial;
        }

        .container {
          max-width: 850px;
          margin: auto;
        }

        .header {
          margin-bottom: 25px;
        }

        .header h1 {
          font-size: 38px;
          margin-bottom: 10px;
        }

        .sellerBadge {
          display: inline-block;
          background: #22c55e;
          padding: 8px 14px;
          border-radius: 999px;
          margin-top: 10px;
          font-size: 14px;
          font-weight: bold;
        }

        .card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 22px;
          padding: 30px;
        }

        h2 {
          margin-top: 25px;
          margin-bottom: 15px;
        }

        input,
        textarea {
          width: 100%;
          padding: 14px;
          margin-bottom: 14px;
          border-radius: 14px;
          border: none;
          background: rgba(255,255,255,0.08);
          color: white;
          font-size: 15px;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        button {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(
            to right,
            #2563eb,
            #7c3aed
          );
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.25s;
        }

        button:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          margin-top: 18px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          text-align: center;
        }
      `}</style>
    </div>
  );
}