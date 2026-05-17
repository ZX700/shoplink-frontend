"use client";

import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Navbar({
  user,
  cartCount,
  openCart,
}: any) {

  // ✅ MUST be inside component
  const router = useRouter();

  // ✅ logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    router.push("/");

    // optional refresh
    window.location.reload();
  };

  return (
    <nav className="nav glass">
      <div className="container navInner">

        <Link href="/">
          <h1 className="logo">
            ShopLink
          </h1>
        </Link>

        <div className="navRight">

          {user ? (
            <>
              <Link href="/seller">
                <button className="sellerBtn">
                  Account
                </button>
              </Link>

              {/* ✅ LOGOUT BUTTON */}
              <button
                className="ghostBtn"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="ghostBtn">
                  Login
                </button>
              </Link>

              <Link href="/signup">
                <button className="authBtn gradientBtn">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {/* CART */}
          <button
            className="cartBtn"
            onClick={openCart}
          >
            <FaShoppingCart />

            <span>
              {cartCount ?? 0}
            </span>
          </button>

        </div>
      </div>

      <style jsx>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 999;
          border-bottom:
            1px solid rgba(0,0,0,0.05);
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
        }

        .navInner {
          height: 75px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-size: 28px;
          font-weight: 800;
          cursor: pointer;
        }

        .navRight {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .ghostBtn,
        .authBtn,
        .sellerBtn {
          height: 44px;
          padding: 0 20px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .ghostBtn {
          background: white;
        }

        .ghostBtn:hover {
          transform: translateY(-2px);
        }

        .sellerBtn {
          background: black;
          color: white;
        }

        .sellerBtn:hover {
          opacity: 0.9;
        }

        .authBtn {
          background: linear-gradient(
            to right,
            #2563eb,
            #7c3aed
          );

          color: white;
        }

        .authBtn:hover {
          opacity: 0.9;
        }

        .cartBtn {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          border: none;
          background: white;
          position: relative;
          font-size: 18px;
          cursor: pointer;
          transition: 0.2s;
        }

        .cartBtn:hover {
          transform: scale(1.05);
        }

        .cartBtn span {
          position: absolute;
          top: -5px;
          right: -5px;
          background: red;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </nav>
  );
}