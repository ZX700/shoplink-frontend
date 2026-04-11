"use client";

import { useEffect, useState } from "react";

type Order = {
  _id: string;
  items: {
    name: string;
    qty: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("https://shoplink-backend-eiik.onrender.com/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError(data.error || "Failed to load orders");
        }
      })
      .catch(() => setError("Network error"));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "paid":
        return "#3b82f6";
      case "shipped":
        return "#8b5cf6";
      case "delivered":
        return "#10b981";
      default:
        return "#999";
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>My Orders 📦</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #eee",
              padding: 15,
              marginBottom: 15,
              borderRadius: 10,
              background: "white",
            }}
          >
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>Total: ${order.total}</b>

              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  color: "white",
                  background: getStatusColor(order.status),
                  fontSize: 12,
                }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <p style={{ color: "#666" }}>
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* ITEMS */}
            <div>
              {order.items.map((item, i) => (
                <p key={i}>
                  {item.name} × {item.qty} (${item.price})
                </p>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}