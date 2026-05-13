"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // DEBUG
  // =========================
  useEffect(() => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("LOCAL USER:", localStorage.getItem("user"));
  }, []);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    setMessage("Logging in...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        setMessage("API URL not configured");
        return;
      }

      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      // =========================
      // STORE USER (ONLY AUTH YOU HAVE)
      // =========================
      localStorage.setItem("user", JSON.stringify(data.user));

      // IMPORTANT: backend does NOT return token yet
      // so we DO NOT store token to avoid confusion

      console.log("SAVED USER:", localStorage.getItem("user"));

      setMessage("Login successful!");

      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage("Server error");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin}>Login</button>

      <p>{message}</p>
    </div>
  );
}