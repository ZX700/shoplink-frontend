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
  const [loading, setLoading] = useState(false);

  const API_URL = "https://shoplink-backend-eiik.onrender.com";

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("PRODUCT FETCH ERROR:", err);
      }
    };

    load();
  }, []);

  // =========================
  // CART LOGIC
  // =========================
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);

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
    setCart((prev) => prev.filter((p) => p._id !== _id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // =========================
  // CHECKOUT (FIXED)
  // =========================
  const checkout = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        window.location.href = "/login";
        return;
      }

      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      const res = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart, // ✅ FIXED: matches backend
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("CHECKOUT ERROR RESPONSE:", data);
        alert(data.error || "Checkout failed");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Stripe session missing URL");
      }
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      alert("Server error during checkout");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="page">

      {/* NAV */}
      <div className="nav">
        <h1>ShopLink</h1>

        <button onClick={() => setOpenCart(true)}>
          Cart ({cart.length})
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid">
        {products.map((p) => (
          <div key={p._id} className="card">
            <img src={p.image} />

            <h3>{p.name}</h3>
            <p>${p.price}</p>

            <button onClick={() => addToCart(p)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      {openCart && (
        <div className="backdrop" onClick={() => setOpenCart(false)} />
      )}

      <div className={`cart ${openCart ? "show" : ""}`}>
        <h2>Cart</h2>

        {cart.length === 0 ? (
          <p>Empty cart</p>
        ) : (
          cart.map((item) => (
            <div key={item._id}>
              <p>{item.name}</p>
              <p>
                {item.qty} × ${item.price}
              </p>

              <button onClick={() => removeFromCart(item._id)}>
                remove
              </button>
            </div>
          ))
        )}

        <h3>Total: ${total.toFixed(2)}</h3>

        <button onClick={checkout} disabled={loading}>
          {loading ? "Processing..." : "Checkout"}
        </button>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .page { font-family: system-ui; padding: 20px; }

        .nav {
          display: flex;
          justify-content: space-between;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .card {
          padding: 10px;
          border: 1px solid #ddd;
        }

        .card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
        }

        .cart {
          position: fixed;
          right: -400px;
          top: 0;
          width: 300px;
          height: 100%;
          background: white;
          transition: 0.3s;
          padding: 20px;
        }

        .cart.show {
          right: 0;
        }
      `}</style>
    </div>
  );
}