"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";

export default function CartDrawer({
  open,
  cart,
  closeCart,
  removeFromCart,
  checkout,
  loading,
}: any) {
  const total = cart.reduce(
    (sum: number, item: any) =>
      sum + item.price,
    0
  );

  return (
    <AnimatePresence>

      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="backdrop"
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{
              type: "spring",
              damping: 25,
            }}
            className="drawer"
          >
            <div className="header">
              <h2>Your Cart</h2>

              <button onClick={closeCart}>
                ✕
              </button>
            </div>

            <div className="items">
              {cart.length === 0 ? (
                <p>Cart is empty</p>
              ) : (
                cart.map((item: any) => (
                  <div
                    key={item._id}
                    className="item"
                  >
                    <img src={item.image} />

                    <div className="info">
                      <h4>{item.name}</h4>

                      <p>
                        ${item.price}
                      </p>
                    </div>

                    <button
                      className="deleteBtn"
                      onClick={() =>
                        removeFromCart(
                          item._id
                        )
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="footer">
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
          </motion.div>

          <style jsx>{`
            .backdrop {
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.5);
              z-index: 999;
            }

            .drawer {
              position: fixed;
              top: 0;
              right: 0;
              width: 400px;
              max-width: 100%;
              height: 100vh;
              background: white;
              z-index: 1000;
              display: flex;
              flex-direction: column;
              padding: 20px;
              box-shadow:
                -10px 0 30px rgba(0,0,0,0.1);
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }

            .header button {
              border: none;
              background: none;
              font-size: 22px;
            }

            .items {
              flex: 1;
              overflow-y: auto;
            }

            .item {
              display: flex;
              gap: 15px;
              margin-bottom: 18px;
              align-items: center;
            }

            .item img {
              width: 80px;
              height: 80px;
              object-fit: cover;
              border-radius: 12px;
            }

            .info {
              flex: 1;
            }

            .deleteBtn {
              border: none;
              background: #fee2e2;
              color: red;
              width: 40px;
              height: 40px;
              border-radius: 10px;
            }

            .footer {
              border-top: 1px solid #eee;
              padding-top: 20px;
            }

            .checkoutBtn {
              width: 100%;
              height: 52px;
              border: none;
              border-radius: 14px;
              background: linear-gradient(
                135deg,
                #2563eb,
                #7c3aed
              );
              color: white;
              font-weight: 700;
              margin-top: 15px;
            }
          `}</style>
        </>
      )}

    </AnimatePresence>
  );
}