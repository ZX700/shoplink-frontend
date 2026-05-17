"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shoplink-backend-eiik.onrender.com";

  // =========================
  // STATE
  // =========================
  const [product, setProduct] =
    useState<any>(null);

  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [review, setReview] =
    useState("");

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [comments, setComments] =
    useState<any[]>([]);

  const [comment, setComment] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState("");

  const [editing, setEditing] =
    useState(false);

  const [editData, setEditData] =
    useState<any>({});

  // =========================
  // USER
  // =========================
  const user =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") ||
            "null"
        )
      : null;

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/products`
        );

        const data = await res.json();

        const allProducts =
          Array.isArray(data)
            ? data
            : data.products || [];

        setProducts(allProducts);

        const found = allProducts.find(
          (p: any) =>
            String(p._id) === String(id)
        );

        setProduct(found);

        setSelectedImage(found?.image);

        setEditData({
          name: found?.name,
          price: found?.price,
          description:
            found?.description,
          category: found?.category,
          image: found?.image,
          stock: found?.stock || 1,
        });

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // RELATED PRODUCTS
  // =========================
  const relatedProducts =
    products.filter(
      (p) =>
        p.category ===
          product?.category &&
        p._id !== product?._id
    );

  // =========================
  // BUY NOW
  // =========================
  const handleCheckout = async () => {
  try {
    setMessage("Redirecting to payment...");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const res = await fetch(`${API_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
        },

        userEmail: user?.email || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("CHECKOUT ERROR:", data);
      setMessage(data.error || "Checkout failed");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      setMessage("No checkout URL returned");
    }
  } catch (err) {
    console.log(err);
    setMessage("Server error");
  }
};
  // =========================
  // REVIEW
  // =========================
  const addReview = () => {
    if (!review) return;

    const newReview = {
      user:
        user?.name ||
        user?.email ||
        "Anonymous",

      text: review,
    };

    setReviews((prev) => [
      newReview,
      ...prev,
    ]);

    setReview("");
  };

  // =========================
  // COMMENT
  // =========================
  const addComment = () => {
    if (!comment) return;

    const newComment = {
      user:
        user?.name ||
        user?.email ||
        "Anonymous",

      text: comment,
    };

    setComments((prev) => [
      newComment,
      ...prev,
    ]);

    setComment("");
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async () => {
    const confirmed = confirm(
      "Delete this product?"
    );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/products/${product._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Delete failed"
        );

        return;
      }

      alert("Product deleted");

      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const saveEdit = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/products/${product._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(editData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Update failed"
        );

        return;
      }

      setProduct(data.product);

      setEditing(false);

      alert("Updated");
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading)
    return (
      <div className="loading">
        Loading...
      </div>
    );

  if (!product)
    return (
      <div className="loading">
        Product not found
      </div>
    );

  // =========================
  // OWNER CHECK
  // =========================
  const isOwner =
  user &&
  String(user._id || user.id) ===
    String(product.sellerId);

  // =========================
  // UI
  // =========================
  return (
    <div className="page">

      {/* TOP */}
      <div className="topSection">

        {/* IMAGE GALLERY */}
        <div className="gallery">

          <img
            src={selectedImage}
            className="mainImage"
          />

          <div className="thumbs">

            {[product.image]
              .filter(Boolean)
              .map(
                (
                  img: string,
                  index: number
                ) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() =>
                      setSelectedImage(
                        img
                      )
                    }
                    className="thumb"
                  />
                )
              )}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="details">

          {!editing ? (
            <>
              <h1>{product.name}</h1>

              <p className="price">
                ${product.price}
              </p>

              <p className="category">
                {product.category}
              </p>

              <p className="desc">
                {
                  product.description
                }
              </p>
            </>
          ) : (
            <>
              <input
                value={
                  editData.name
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name:
                      e.target
                        .value,
                  })
                }
              />

              <input
                value={
                  editData.price
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    price:
                      e.target
                        .value,
                  })
                }
              />

              <textarea
                value={
                  editData.description
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    description:
                      e.target
                        .value,
                  })
                }
              />

              <button
                onClick={saveEdit}
              >
                Save
              </button>
            </>
          )}

          {/* STOCK */}
          <div className="stock">
            {product.stock > 0 ? (
              <span className="inStock">
                In Stock
              </span>
            ) : (
              <span className="outStock">
                Out of Stock
              </span>
            )}
          </div>

          {/* QUANTITY */}
          <div className="qtyBox">
            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.max(
                    1,
                    q - 1
                  )
                )
              }
            >
              -
            </button>

            <span>
              {quantity}
            </span>

            <button
              onClick={() =>
                setQuantity((q) =>
                  q + 1
                )
              }
            >
              +
            </button>
          </div>

          {/* ACTIONS */}
          <div className="actions">

            <button
              className="buyBtn"
              onClick={
                handleCheckout
              }
            >
              Buy Now
            </button>

            {/* WHATSAPP */}
            <a
              href={`https://wa.me/${product.phoneNumber}`}
              target="_blank"
            >
              <button className="waBtn">
                Contact Seller
              </button>
            </a>

            {/* OWNER */}
            {isOwner && (
              <>
                <button
                  className="editBtn"
                  onClick={() =>
                    setEditing(
                      !editing
                    )
                  }
                >
                  Edit Product
                </button>

                <button
                  className="deleteBtn"
                  onClick={
                    deleteProduct
                  }
                >
                  Delete Product
                </button>
              </>
            )}
          </div>

          {/* SELLER INFO */}
          <div className="sellerCard">

            <h3>Seller Details</h3>

            <p>
  <b>Store:</b>{" "}
  {product.storeName || product.sellerName}
</p>

            <p>
              <b>Bank:</b>{" "}
              {
                product.bankName
              }
            </p>

            <p>
              <b>Account:</b>{" "}
              {
                product.accountNumber
              }
            </p>

            <p>
              <b>Name:</b>{" "}
              {
                product.accountName
              }
              <p>
  <b>Phone:</b>{" "}
  {product.phoneNumber}
</p>
            </p>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="section">

        <h2>Reviews</h2>

        <textarea
          placeholder="Write review..."
          value={review}
          onChange={(e) =>
            setReview(
              e.target.value
            )
          }
        />

        <button
          onClick={addReview}
        >
          Submit Review
        </button>

        {reviews.map(
          (r, index) => (
            <div
              key={index}
              className="review"
            >
              <b>{r.user}</b>
              <p>{r.text}</p>
            </div>
          )
        )}
      </div>

      {/* COMMENTS */}
      <div className="section">

        <h2>Comments / Chat</h2>

        <textarea
          placeholder="Write comment..."
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
        />

        <button
          onClick={addComment}
        >
          Send
        </button>

        {comments.map(
          (c, index) => (
            <div
              key={index}
              className="review"
            >
              <b>{c.user}</b>
              <p>{c.text}</p>
            </div>
          )
        )}
      </div>

      {/* RELATED PRODUCTS */}
      <div className="section">

        <h2>Related Products</h2>

        <div className="relatedGrid">
          {relatedProducts.map(
            (p) => (
              <div
                key={p._id}
                className="relatedCard"
                onClick={() =>
                  router.push(
                    `/product/${p._id}`
                  )
                }
              >
                <img
                  src={p.image}
                />

                <h4>{p.name}</h4>

                <p>
                  ${p.price}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* STYLES */}
      <style jsx>{`
        .page {
          padding: 30px;
          background: #f5f7fb;
          min-height: 100vh;
          font-family: Arial;
        }

        .topSection {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .mainImage {
          width: 100%;
          height: 500px;
          object-fit: cover;
          border-radius: 20px;
          background: white;
        }

        .thumbs {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .thumb {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 10px;
          cursor: pointer;
        }

        .details {
          background: white;
          padding: 25px;
          border-radius: 20px;
        }

        .price {
          font-size: 34px;
          font-weight: bold;
        }

        .category {
          color: #666;
          margin-bottom: 20px;
        }

        .desc {
          line-height: 1.7;
        }

        .stock {
          margin: 20px 0;
        }

        .inStock {
          color: green;
          font-weight: bold;
        }

        .outStock {
          color: red;
          font-weight: bold;
        }

        .qtyBox {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .qtyBox button {
          width: 40px;
          height: 40px;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 25px;
        }

        .buyBtn,
        .waBtn,
        .editBtn,
        .deleteBtn {
          padding: 14px 18px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          color: white;
          font-weight: bold;
        }

        .buyBtn {
          background: black;
        }

        .waBtn {
          background: green;
        }

        .editBtn {
          background: #2563eb;
        }

        .deleteBtn {
          background: #ef4444;
        }

        .sellerCard,
        .section {
          background: white;
          padding: 25px;
          border-radius: 20px;
          margin-bottom: 30px;
        }

        textarea,
        input {
          width: 100%;
          padding: 14px;
          margin: 10px 0;
          border-radius: 12px;
          border: 1px solid #ddd;
        }

        .review {
          padding: 15px;
          border-bottom: 1px solid #eee;
        }

        .relatedGrid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(200px, 1fr)
            );
          gap: 20px;
        }

        .relatedCard {
          background: #fafafa;
          padding: 15px;
          border-radius: 16px;
          cursor: pointer;
        }

        .relatedCard img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 12px;
        }

        .message {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: black;
          color: white;
          padding: 14px 18px;
          border-radius: 12px;
        }

        .loading {
          padding: 50px;
          font-size: 24px;
        }

        @media (max-width: 900px) {
          .topSection {
            grid-template-columns: 1fr;
          }

          .mainImage {
            height: 350px;
          }
        }
          .relatedCard {
  transition: 0.25s ease;
}

.relatedCard:hover {
  transform: translateY(-5px);
}

.buyBtn:hover,
.waBtn:hover,
.editBtn:hover,
.deleteBtn:hover {
  transform: translateY(-2px);
  opacity: 0.92;
}
      `}</style>
    </div>
  );
}