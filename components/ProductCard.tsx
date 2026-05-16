"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductCard({
  product,
  addToCart,
}: any) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="card cardShadow"
    >
      <Link href={`/product/${product._id}`}>
        <img
          src={product.image}
          className="image"
        />
      </Link>

      <div className="content">
        <h3>{product.name}</h3>

        <p className="price">
          ${product.price}
        </p>

        <p className="seller">
          {product.sellerName}
        </p>

        <button
          className="gradientBtn addBtn"
          onClick={() =>
            addToCart(product)
          }
        >
          Add to Cart
        </button>
      </div>

      <style jsx>{`
        .card {
          background: white;
          border-radius: 22px;
          overflow: hidden;
        }

        .image {
          height: 240px;
          object-fit: cover;
        }

        .content {
          padding: 18px;
        }

        h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .price {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .seller {
          color: #666;
          margin-bottom: 18px;
        }

        .addBtn {
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 14px;
          font-weight: 700;
        }
      `}</style>
    </motion.div>
  );
}