"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
  sellerName?: string;
  stock?: number;
};

type CartItem = Product & {
  qty: number;
};

export default function Home() {
  const router = useRouter();

  // =========================
  // STATE
  // =========================
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [openCart, setOpenCart] = useState(false);

  const [loading, setLoading] = useState(false);

  // SEARCH + FILTER
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // USER
  const [user, setUser] = useState<any>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shoplink-backend-eiik.onrender.com";

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/products`
        );

        const data = await res.json();

        const productList = Array.isArray(data)
          ? data
          : data.products || [];

        setProducts(productList);
        setFilteredProducts(productList);
      } catch (err) {
        console.log("PRODUCT FETCH ERROR:", err);
      }
    };

    fetchProducts();

    // LOAD USER
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // =========================
  // FILTER PRODUCTS
  // =========================
  useEffect(() => {
    let updated = [...products];

    // SEARCH
    if (search.trim()) {
      updated = updated.filter((p) =>
        p.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // CATEGORY
    if (category !== "All") {
      updated = updated.filter(
        (p) => p.category === category
      );
    }

    setFilteredProducts(updated);
  }, [search, category, products]);

  // =========================
  // UNIQUE CATEGORIES
  // =========================
  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category)
      .filter(Boolean);

    return ["All", ...new Set(cats)];
  }, [products]);

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
  // REMOVE CART ITEM
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

      if (!res.ok) {
        alert(
          data.error || "Checkout failed"
        );
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.log(
        "CHECKOUT ERROR:",
        err
      );

      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="page">
      {/* NAVBAR */}
      <div className="nav">
        <div className="leftNav">
          <h1
            className="logo"
            onClick={() => router.push("/")}
          >
            ShopLink
          </h1>
        </div>

        <div className="rightNav">
          {user ? (
            <button
              className="accountBtn"
              onClick={() =>
                router.push("/seller")
              }
            >
              Account
            </button>
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
                className="navBtn dark"
                onClick={() =>
                  router.push("/signup")
                }
              >
                Sign Up
              </button>
            </>
          )}

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

      {/* HERO */}
      <div className="hero">
        <h2>
          Discover Amazing Products
        </h2>

        <p>
          Buy and sell products easily
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          {categories.map((cat, index) => (
            <option
              key={index}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCTS */}
      <div className="grid">
        {filteredProducts.length === 0 ? (
          <div className="emptyProducts">
            No products found
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p._id}
              className="card"
            >
              <img
                src={
                  p.image ||
                  "https://via.placeholder.com/300"
                }
                alt={p.name}
                onClick={() =>
                  router.push(
                    `/product/${p._id}`
                  )
                }
              />

              <div className="info">
                <h3>{p.name}</h3>

                <p className="price">
                  ${p.price}
                </p>

                <p className="category">
                  {p.category}
                </p>

                {p.sellerName && (
                  <p className="seller">
                    Seller: {p.sellerName}
                  </p>
                )}

                <div className="actions">
                  <button
                    className="viewBtn"
                    onClick={() =>
                      router.push(
                        `/product/${p._id}`
                      )
                    }
                  >
                    View
                  </button>

                  <button
                    className="cartAddBtn"
                    onClick={() =>
                      addToCart(p)
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BACKDROP */}
      {openCart && (
        <div
          className="backdrop"
          onClick={() =>
            setOpenCart(false)
          }
        />
      )}

      {/* CART */}
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

        <div className="cartItems">
          {cart.length === 0 ? (
            <p className="empty">
              Cart is empty
            </p>
          ) : (
            cart.map((item) => (
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
            ))
          )}
        </div>

        <div className="checkoutBox">
          <h3>
            Total: $
            {total.toFixed(2)}
          </h3>

          <button
            className="checkoutBtn"
            onClick={checkout}
            disabled={
              loading || cart.length === 0
            }
          >
            {loading
              ? "Processing..."
              : "Checkout"}
          </button>
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f7fb;
          font-family: Arial, sans-serif;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 10;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .logo {
          cursor: pointer;
          font-size: 28px;
        }

        .rightNav {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .navBtn,
        .accountBtn,
        .cartBtn {
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .navBtn {
          background: #eee;
        }

        .dark,
        .accountBtn,
        .cartBtn {
          background: black;
          color: white;
        }

        .hero {
          text-align: center;
          padding: 60px 20px 30px;
        }

        .hero h2 {
          font-size: 42px;
          margin-bottom: 10px;
        }

        .hero p {
          color: #666;
        }

        .controls {
          max-width: 1200px;
          margin: auto;
          padding: 0 20px 20px;
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .controls input,
        .controls select {
          flex: 1;
          min-width: 200px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid #ddd;
          font-size: 15px;
          outline: none;
          background: white;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(240px, 1fr)
          );
          gap: 24px;
          padding: 20px;
        }

        .card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          transition: 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .card img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          cursor: pointer;
        }

        .info {
          padding: 16px;
        }

        .info h3 {
          margin-bottom: 8px;
        }

        .price {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .category,
        .seller {
          color: #666;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .viewBtn,
        .cartAddBtn {
          flex: 1;
          border: none;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .viewBtn {
          background: #eee;
        }

        .cartAddBtn {
          background: black;
          color: white;
        }

        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 20;
        }

        .cart {
          position: fixed;
          top: 0;
          right: -420px;
          width: 380px;
          height: 100%;
          background: white;
          z-index: 30;
          transition: 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0,0,0,0.15);
        }

        .cart.show {
          right: 0;
        }

        .cartHeader {
          padding: 20px;
          display: flex;
          justify-content: space-between;
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
          padding: 18px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .removeBtn {
          background: crimson;
          color: white;
          border: none;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .checkoutBox {
          padding: 20px;
          border-top: 1px solid #eee;
        }

        .checkoutBtn {
          width: 100%;
          padding: 14px;
          margin-top: 12px;
          border: none;
          background: black;
          color: white;
          border-radius: 12px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
        }

        .checkoutBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty {
          padding: 20px;
          color: #666;
        }

        .emptyProducts {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 18px;
        }

        @media (max-width: 768px) {
          .hero h2 {
            font-size: 30px;
          }

          .cart {
            width: 100%;
            right: -100%;
          }

          .nav {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}