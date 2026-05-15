"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;

  // seller info
  sellerName?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
};

type CartItem = Product & {
  qty: number;
};

export default function Home() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openCart, setOpenCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<any>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shoplink-backend-eiik.onrender.com";

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/products`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error(
          "PRODUCT FETCH ERROR:",
          err
        );
      }
    };

    loadProducts();
  }, [API_URL]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find(
        (p) => p._id === product._id
      );

      if (exists) {
        return prev.map((p) =>
          p._id === product._id
            ? {
                ...p,
                qty: p.qty + 1,
              }
            : p
        );
      }

      return [
        ...prev,
        {
          ...product,
          qty: 1,
        },
      ];
    });

    setOpenCart(true);
  };

  // =========================
  // REMOVE FROM CART
  // =========================
  const removeFromCart = (_id: string) => {
    setCart((prev) =>
      prev.filter((p) => p._id !== _id)
    );
  };

  // =========================
  // TOTAL
  // =========================
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  // =========================
  // CHECKOUT
  // =========================
  const checkout = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Login required");

        router.push("/login");
        return;
      }

      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/checkout`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items: cart,
          }),
        }
      );

      const data = await res.json();

      console.log("CHECKOUT:", data);

      if (!res.ok) {
        alert(
          data.error || "Checkout failed"
        );

        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Stripe URL missing");
      }
    } catch (err) {
      console.error(
        "CHECKOUT ERROR:",
        err
      );

      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <div className="page">

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}
      <div className="nav">
        <h1 className="logo">
          ShopLink
        </h1>

        <div className="navRight">

          {/* USER */}
          {user ? (
            <>
              <button
                className="navBtn"
                onClick={() =>
                  router.push("/seller")
                }
              >
                Account
              </button>

              <button
                className="logoutBtn"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="navBtn"
                onClick={() =>
                  router.push("/login")
                }
              >
                Login
              </button>

              <button
                className="navBtn"
                onClick={() =>
                  router.push("/signup")
                }
              >
                Signup
              </button>
            </>
          )}

          {/* CART */}
          <button
            className="cartBtn"
            onClick={() =>
              setOpenCart(true)
            }
          >
            🛒 {cart.length}
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}
      <div className="hero">
        <h2>
          Discover Products From Sellers
        </h2>

        <p>
          Upload, sell and shop instantly
        </p>
      </div>

      {/* ========================= */}
      {/* PRODUCTS */}
      {/* ========================= */}
      <div className="grid">
        {products.map((p) => (
          <div
            key={p._id}
            className="card"
          >
            <img
              src={p.image}
              alt={p.name}
            />

            <div className="info">

              <h3>{p.name}</h3>

              <p className="price">
                ${p.price}
              </p>

              {p.description && (
                <p className="desc">
                  {p.description}
                </p>
              )}

              {p.category && (
                <p className="category">
                  {p.category}
                </p>
              )}

              {/* SELLER DETAILS */}
              <div className="sellerBox">
                <h4>Seller Info</h4>

                <p>
                  <b>Store:</b>{" "}
                  {p.sellerName ||
                    "Unknown"}
                </p>

                <p>
                  <b>Bank:</b>{" "}
                  {p.bankName || "N/A"}
                </p>

                <p>
                  <b>Account:</b>{" "}
                  {p.accountNumber ||
                    "N/A"}
                </p>

                <p>
                  <b>Name:</b>{" "}
                  {p.accountName ||
                    "N/A"}
                </p>
              </div>

              <button
                className="addBtn"
                onClick={() =>
                  addToCart(p)
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================= */}
      {/* BACKDROP */}
      {/* ========================= */}
      {openCart && (
        <div
          className="backdrop"
          onClick={() =>
            setOpenCart(false)
          }
        />
      )}

      {/* ========================= */}
      {/* CART */}
      {/* ========================= */}
      <div
        className={`cart ${
          openCart ? "show" : ""
        }`}
      >
        <div className="cartHeader">
          <h2>Your Cart</h2>

          <button
            onClick={() =>
              setOpenCart(false)
            }
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="empty">
            Cart is empty
          </p>
        ) : (
          <>
            <div className="cartItems">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="cartItem"
                >
                  <div>
                    <h4>{item.name}</h4>

                    <p>
                      {item.qty} × $
                      {item.price}
                    </p>
                  </div>

                  <button
                    className="removeBtn"
                    onClick={() =>
                      removeFromCart(
                        item._id
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cartBottom">
              <h3>
                Total: $
                {total.toFixed(2)}
              </h3>

              <button
                className="checkoutBtn"
                onClick={checkout}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ========================= */}
      {/* STYLES */}
      {/* ========================= */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f4f6fb;
          font-family: Arial, sans-serif;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 10;

          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 18px 24px;

          background: white;

          box-shadow:
            0 2px 10px rgba(0,0,0,0.05);
        }

        .logo {
          font-size: 28px;
          font-weight: bold;
        }

        .navRight {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .navBtn,
        .cartBtn,
        .logoutBtn {
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .navBtn {
          background: #2563eb;
          color: white;
        }

        .logoutBtn {
          background: #ef4444;
          color: white;
        }

        .cartBtn {
          background: black;
          color: white;
        }

        .hero {
          text-align: center;
          padding: 50px 20px 20px;
        }

        .hero h2 {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .hero p {
          color: #666;
        }

        .grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(260px, 1fr)
            );

          gap: 20px;

          padding: 20px;
        }

        .card {
          background: white;
          border-radius: 18px;
          overflow: hidden;

          box-shadow:
            0 10px 25px rgba(0,0,0,0.06);

          transition: 0.2s;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .card img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }

        .info {
          padding: 16px;
        }

        .price {
          font-size: 22px;
          font-weight: bold;
          margin: 10px 0;
        }

        .desc {
          color: #666;
          margin-bottom: 10px;
        }

        .category {
          display: inline-block;
          background: #eef2ff;
          color: #4338ca;

          padding: 6px 10px;

          border-radius: 8px;

          font-size: 13px;

          margin-bottom: 15px;
        }

        .sellerBox {
          background: #f9fafb;

          padding: 12px;

          border-radius: 12px;

          margin-bottom: 15px;

          border: 1px solid #eee;
        }

        .sellerBox h4 {
          margin-bottom: 8px;
        }

        .sellerBox p {
          font-size: 14px;
          margin: 4px 0;
        }

        .addBtn {
          width: 100%;
          padding: 12px;

          border: none;
          border-radius: 12px;

          background: black;
          color: white;

          cursor: pointer;
          font-weight: bold;
        }

        .backdrop {
          position: fixed;
          inset: 0;

          background: rgba(0,0,0,0.4);

          z-index: 30;
        }

        .cart {
          position: fixed;

          top: 0;
          right: -400px;

          width: 350px;
          height: 100%;

          background: white;

          z-index: 40;

          transition: 0.3s ease;

          display: flex;
          flex-direction: column;

          box-shadow:
            -10px 0 30px rgba(0,0,0,0.2);
        }

        .cart.show {
          right: 0;
        }

        .cartHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 20px;

          border-bottom: 1px solid #eee;
        }

        .cartHeader button {
          border: none;
          background: none;
          font-size: 20px;
          cursor: pointer;
        }

        .cartItems {
          flex: 1;
          overflow-y: auto;
        }

        .cartItem {
          display: flex;
          justify-content: space-between;

          padding: 15px;

          border-bottom: 1px solid #eee;
        }

        .removeBtn {
          background: #ef4444;
          color: white;

          border: none;

          padding: 8px 10px;

          border-radius: 8px;

          cursor: pointer;
        }

        .cartBottom {
          padding: 20px;
          border-top: 1px solid #eee;
        }

        .checkoutBtn {
          width: 100%;

          padding: 14px;

          border: none;
          border-radius: 12px;

          background: black;
          color: white;

          font-weight: bold;

          cursor: pointer;

          margin-top: 10px;
        }

        .checkoutBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty {
          padding: 20px;
          color: #666;
        }

        @media (max-width: 768px) {
          .hero h2 {
            font-size: 28px;
          }

          .cart {
            width: 100%;
          }

          .nav {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
}