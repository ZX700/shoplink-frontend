"use client";

import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  router.push("/");
};

export default function Navbar({
  user,
  cartCount,
  openCart,
}: any) {
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

   <button 
   className="ghostBtn" onClick={logout}>
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
          <button
            className="cartBtn"
            onClick={openCart}
          >
            <FaShoppingCart />
           <span>{cartCount ?? 0}</span>
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
        }

        .ghostBtn {
          background: white;
        }

        .sellerBtn {
          background: black;
          color: white;
        }

        .cartBtn {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          border: none;
          background: white;
          position: relative;
          font-size: 18px;
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