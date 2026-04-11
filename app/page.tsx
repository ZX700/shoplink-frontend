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

  useEffect(() => {
    fetch("https://shoplink-backend-eiik.onrender.com/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);

      if (exists) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

    setOpenCart(true);
  };

  const removeFromCart = (_id: string) => {
    setCart((prev) => prev.filter((p) => p._id !== _id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const checkout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      window.location.href = "/login";
      return;
    }

    const res = await fetch("https://shoplink-backend-eiik.onrender.com/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: cart }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="page">

      {/* TOP NAV */}
      <div className="nav">
        <h1 className="logo">ShopLink</h1>

        <button className="cartBtn" onClick={() => setOpenCart(!openCart)}>
          🛒 Cart ({cart.length})
        </button>
      </div>

      {/* HERO */}
      <div className="hero">
        <h2>Discover Premium Products</h2>
        <p>Quality items at unbeatable prices</p>
      </div>

      {/* PRODUCTS */}
      <div className="grid">
        {products.map((p) => (
          <div key={p._id} className="card">
            <div className="imgWrap">
              <img src={p.image} />
            </div>

            <div className="info">
              <h3>{p.name}</h3>
              <p className="price">${p.price}</p>

              <button onClick={() => addToCart(p)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CART DRAWER */}
      <div className={`cart ${openCart ? "show" : ""}`}>
        <div className="cartHeader">
          <h3>Your Cart</h3>
          <button onClick={() => setOpenCart(false)}>✕</button>
        </div>

        {cart.length === 0 ? (
          <p className="empty">Cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item._id} className="cartItem">
              <div>
                <b>{item.name}</b>
                <p>
                  {item.qty} × ${item.price}
                </p>
              </div>

              <button onClick={() => removeFromCart(item._id)}>
                remove
              </button>
            </div>
          ))
        )}

        <div className="total">
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={checkout} disabled={!cart.length}>
            Checkout
          </button>
        </div>
      </div>

      {/* BACKDROP */}
      {openCart && (
        <div className="backdrop" onClick={() => setOpenCart(false)} />
      )}

      {/* STYLES */}
      <style jsx>{`
        .page {
          font-family: system-ui;
          background: #f6f7fb;
          min-height: 100vh;
        }

        /* NAV */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 25px;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .logo {
          font-size: 20px;
          font-weight: 700;
        }

        .cartBtn {
          background: #111;
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
        }

        /* HERO */
        .hero {
          text-align: center;
          padding: 40px 20px;
        }

        .hero h2 {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .hero p {
          color: #666;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          padding: 20px;
        }

        /* CARD */
        .card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          transition: 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .imgWrap {
          height: 180px;
          overflow: hidden;
        }

        .imgWrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .info {
          padding: 15px;
        }

        .price {
          color: #2563eb;
          font-weight: bold;
          margin: 5px 0;
        }

        .info button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 10px;
          background: #2563eb;
          color: white;
          cursor: pointer;
        }

        /* CART */
        .cart {
          position: fixed;
          right: -400px;
          top: 0;
          width: 320px;
          height: 100%;
          background: white;
          box-shadow: -10px 0 30px rgba(0,0,0,0.1);
          padding: 20px;
          transition: 0.3s ease;
          z-index: 20;
          display: flex;
          flex-direction: column;
        }

        .cart.show {
          right: 0;
        }

        .cartHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cartItem {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }

        .cartItem button {
          background: red;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 5px;
        }

        .total {
          margin-top: auto;
        }

        .total button {
          width: 100%;
          padding: 12px;
          background: black;
          color: white;
          border: none;
          border-radius: 12px;
          margin-top: 10px;
        }

        .empty {
          color: #777;
          margin-top: 20px;
        }

        /* BACKDROP */
        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 15;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .hero h2 {
            font-size: 22px;
          }

          .cart {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}