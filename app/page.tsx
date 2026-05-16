"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";

export default function Home() {
  const [products, setProducts] =
    useState<any[]>([]);

  const [cart, setCart] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const stored =
      localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/products`
      );

      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <div>

      <Navbar
        user={user}
        cartCount={cart.length}
        openCart={() => {}}
      />

      <div className="hero">
        <div className="container">
          <h1>
            Discover Amazing Products
          </h1>

          <p>
            Buy and sell securely on
            ShopLink
          </p>
        </div>
      </div>

      <div className="container section">

        {loading ? (
          <Loader />
        ) : (
          <div className="grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}

      </div>

      <style jsx>{`
        .hero {
          padding: 70px 0;
        }

        .hero h1 {
          font-size: 64px;
          max-width: 700px;
          line-height: 1;
          margin-bottom: 20px;
        }

        .hero p {
          font-size: 20px;
          color: #666;
        }

        .grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(260px, 1fr)
            );
          gap: 24px;
        }

        @media(max-width:768px){
          .hero h1{
            font-size:42px;
          }
        }
      `}</style>
    </div>
  );
}