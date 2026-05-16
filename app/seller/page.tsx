"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Package, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function SellerPage() {
  const router = useRouter();

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
  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);

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
  // IMAGE UPLOAD
  // =========================
  const uploadImage = async (
    file: File
  ) => {
    try {
      setUploadingImage(true);
      setMessage("");

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const res = await fetch(
        `${API_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        setMessage(
          data.error ||
            "Image upload failed"
        );

        return;
      }

      setImage(data.imageUrl);

      setMessage(
        "Image uploaded successfully"
      );

    } catch (err) {
      console.log(err);

      setMessage(
        "Image upload failed"
      );
    } finally {
      setUploadingImage(false);
    }
  };

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
            name,
            price: Number(price),
            image,
            description,
            category,
          }),
        }
      );

      const data =
        await res.json();

      console.log(
        "UPLOAD RESPONSE:",
        data
      );

      if (!res.ok) {
        setMessage(
          data.error ||
            "Upload failed"
        );

        return;
      }

      setMessage(
        "Product uploaded successfully!"
      );

      // AUTO SELLER
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
      setImage("");
      setDescription("");
      setCategory("");

    } catch (err) {
      console.error(
        "UPLOAD ERROR:",
        err
      );

      setMessage(
        "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <motion.div
        className="container"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        {/* HEADER */}
        <div className="header">
          <div>
            <h1>
              Seller Dashboard
            </h1>

            <p>
              Welcome{" "}
              {user?.name ||
                user?.email}
            </p>

            {user?.isSeller && (
              <div className="sellerBadge">
                ✔ Verified Seller
              </div>
            )}
          </div>
        </div>

        {/* CARD */}
        <motion.div
          className="card"
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
        >
          <div className="titleRow">
            <Package size={24} />

            <h2>
              Upload Product
            </h2>
          </div>

          {/* NAME */}
          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          {/* PRICE */}
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
          />

          {/* IMAGE */}
          <div className="uploadBox">
            <label>
              <ImageIcon size={18} />
              Upload Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={async (
                e
              ) => {
                const file =
                  e.target
                    .files?.[0];

                if (!file)
                  return;

                await uploadImage(
                  file
                );
              }}
            />

            {uploadingImage && (
              <p>
                Uploading image...
              </p>
            )}

            {image && (
              <img
                src={image}
                alt="preview"
                className="preview"
              />
            )}
          </div>

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          {/* CATEGORY */}
          <input
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          />

          {/* BUTTON */}
          <button
            onClick={
              uploadProduct
            }
            disabled={
              loading ||
              uploadingImage
            }
          >
            <Upload size={18} />

            {loading
              ? "Uploading..."
              : "Upload Product"}
          </button>
        </motion.div>

        {/* MESSAGE */}
        {message && (
          <motion.div
            className="message"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >
            {message}
          </motion.div>
        )}
      </motion.div>

      {/* STYLES */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 40px 20px;

          background:
            linear-gradient(
              to bottom right,
              #f8fafc,
              #eef2ff
            );

          font-family:
            Inter,
            sans-serif;
        }

        .container {
          max-width: 850px;
          margin: auto;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 42px;
          margin-bottom: 8px;
          font-weight: 800;
          color: #111827;
        }

        .header p {
          color: #6b7280;
          font-size: 15px;
        }

        .sellerBadge {
          margin-top: 10px;
          display: inline-block;
          background: #dcfce7;
          color: #166534;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
        }

        .card {
          background: white;
          border-radius: 28px;
          padding: 28px;

          box-shadow:
            0 20px 50px
            rgba(0,0,0,0.08);
        }

        .titleRow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .titleRow h2 {
          font-size: 24px;
          color: #111827;
        }

        input,
        textarea {
          width: 100%;
          padding: 15px;
          margin-bottom: 16px;

          border-radius: 16px;
          border: 1px solid #e5e7eb;

          font-size: 15px;
          outline: none;

          transition: 0.2s;
        }

        input:focus,
        textarea:focus {
          border-color: #6366f1;
          box-shadow:
            0 0 0 4px
            rgba(99,102,241,0.1);
        }

        textarea {
          min-height: 140px;
          resize: vertical;
        }

        .uploadBox {
          border: 2px dashed #d1d5db;
          padding: 20px;
          border-radius: 18px;
          margin-bottom: 20px;
          background: #fafafa;
        }

        .uploadBox label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .preview {
          width: 100%;
          margin-top: 14px;
          border-radius: 16px;
          max-height: 320px;
          object-fit: cover;
        }

        button {
          width: 100%;
          padding: 16px;

          border: none;
          border-radius: 18px;

          background: linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );

          color: white;
          font-size: 16px;
          font-weight: 700;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          transition: 0.25s;
        }

        button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 10px 25px
            rgba(79,70,229,0.3);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          margin-top: 20px;

          background: white;
          padding: 18px;

          border-radius: 18px;

          font-weight: 600;

          box-shadow:
            0 10px 30px
            rgba(0,0,0,0.06);
        }

        @media (
          max-width: 768px
        ) {
          .header h1 {
            font-size: 32px;
          }

          .card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}