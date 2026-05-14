"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        setMessage("API URL missing");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${apiUrl}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      // =========================
      // ERROR
      // =========================
      if (!res.ok) {
        setMessage(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // =========================
      // SAVE TOKEN + USER
      // =========================
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("token")
      );

      console.log(
        "USER SAVED:",
        localStorage.getItem("user")
      );

      setMessage("Login successful!");

      // =========================
      // REDIRECT
      // =========================
      setTimeout(() => {
        router.push("/");
      }, 800);

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 350,
          background: "white",
          padding: 30,
          borderRadius: 16,
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 20,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: loading
              ? "#999"
              : "#111",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {message && (
          <p
            style={{
              marginTop: 15,
              textAlign: "center",
              color:
                message.includes("successful")
                  ? "green"
                  : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}