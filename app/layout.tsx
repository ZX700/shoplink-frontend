"use client";

import { useEffect, useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/";
  };

  return (
    <html lang="en">
      <body>
        {/* GLOBAL HEADER */}
       <nav style={{
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 24px",
  borderBottom: "1px solid #eee"
}}>
  <div>
    <a href="/" style={{ fontWeight: "bold", fontSize: "18px" }}>
      ShopLink
    </a>
  </div>

  <div style={{ display: "flex", gap: "16px" }}>
    <a href="/login">Login</a>
    <a href="/signup">Sign Up</a>
    <a href="/orders">Orders</a>
  </div>
</nav>

        {/* PAGE CONTENT */}
        {children}
      </body>
    </html>
  );
}