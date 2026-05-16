"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] =
    useState<any[]>([]);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token =
      localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/api/orders/my-orders`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    setOrders(data);
  };

  return (
    <div className="container section">

      <h1>Payment History</h1>

      <div className="grid">
        {orders.map((order) => (
          <div
            key={order._id}
            className="card"
          >
            <h3>
              $
              {order.amount}
            </h3>

            <p>
              {order.paymentStatus}
            </p>

            <p>
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .grid {
          display: grid;
          gap: 20px;
          margin-top: 20px;
        }

        .card {
          background: white;
          padding: 20px;
          border-radius: 18px;
        }
      `}</style>
    </div>
  );
}