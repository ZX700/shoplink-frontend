"use client";

import { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

type CartItem = Product & {
  qty: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openCart, setOpenCart] = useState(false);

  const API_URL =
    "https://shoplink-backend-eiik.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.log);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find(
        (p) => p._id === product._id
      );

      if (exists) {
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

    setOpenCart(true);
  };

  const removeFromCart = (_id: string) => {
    setCart((prev) =>
      prev.filter((p) => p._id !== _id)
    );
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const checkout = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      window.location.href = "/login";
      return;
    }

    const product = {
      name: cart
        .map((i) => i.name)
        .join(", "),
      price: total,
      category: "Cart Order",
    };

    const res = await fetch(
      `${API_URL}/api/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product }),
      }
    );

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(
        data.error || "Checkout failed"
      );
    }
  };

  return (
    <div className="page">
      {/* NAV */}
      <div className="nav">
        <h1 className="logo">
          ShopLink
        </h1>

        <button
          className="cartBtn"
          onClick={() =>
            setOpenCart(true)
          }
        >
          🛒 Cart ({cart.length})
        </button>
      </div>

      {/* HERO */}
      <div className="hero">
        <h2>
          Discover Premium Products
        </h2>
      </div>

      {/* PRODUCTS */}
      <div className="grid">
        {products.map((p) => (
          <div
            key={p._id}
            className="card"
          >
            <img src={p.image} />

            <div className="info">
              <h3>{p.name}</h3>
              <p>${p.price}</p>

              <button
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

      {/* BACKDROP (FIXED LAYERING) */}
      {openCart && (
        <div
          className="backdrop"
          onClick={() =>
            setOpenCart(false)
          }
        />
      )}

      {/* CART (FIXED Z-INDEX + CLICKABILITY) */}
      <div
        className={`cart ${
          openCart ? "show" : ""
        }`}
      >
        <div className="cartHeader">
          <h3>Your Cart</h3>
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
          cart.map((item) => (
            <div
              key={item._id}
              className="cartItem"
            >
              <div>
                <b>{item.name}</b>
                <p>
                  {item.qty} × $
                  {item.price}
                </p>
              </div>

              <button
                onClick={() =>
                  removeFromCart(
                    item._id
                  )
                }
              >
                remove
              </button>
            </div>
          ))
        )}

        <div className="total">
          <h3>
            Total: ${total.toFixed(2)}
          </h3>

          <button
            onClick={checkout}
            disabled={!cart.length}
          >
            Checkout
          </button>
        </div>
      </div>

      {/* STYLES (FIXED Z-INDEX SYSTEM) */}
      <style jsx>{`
        .page {
          font-family: system-ui;
          background: #f6f7fb;
          min-height: 100vh;
        }

        .nav {
          display: flex;
          justify-content: space-between;
          padding: 18px;
          background: white;
          position: sticky;
          top: 0;
          z-index: 5;
        }

        .cartBtn {
          background: black;
          color: white;
          padding: 10px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(220px, 1fr)
          );
          gap: 20px;
          padding: 20px;
        }

        .card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }

        .card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .info {
          padding: 12px;
        }

        .info button {
          width: 100%;
          padding: 10px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        /* BACKDROP (LOWER THAN CART) */
        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 20;
        }

        /* CART (HIGHER THAN EVERYTHING) */
        .cart {
          position: fixed;
          right: -380px;
          top: 0;
          width: 340px;
          height: 100%;
          background: white;
          transition: 0.3s ease;
          z-index: 30;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
        }

        .cart.show {
          right: 0;
        }

        .cartHeader {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          border-bottom: 1px solid #eee;
        }

        .cartItem {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        .cartItem button {
          background: red;
          color: white;
          border: none;
          padding: 5px;
          border-radius: 6px;
          cursor: pointer;
        }

        .total {
          margin-top: auto;
          padding: 15px;
        }

        .total button {
          width: 100%;
          padding: 12px;
          background: black;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }

        .empty {
          padding: 20px;
          color: #777;
        }
      `}</style>
    </div>
  );
}