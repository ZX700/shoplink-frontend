"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // ✅ FIXED LOGIN HANDLER
  const handleLogin = async () => {
    setMessage("Logging in...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Invalid response from server:", text);
        setMessage("Server error: invalid response");
        return;
      }

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      // ✅ SAVE USER SESSION
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");

      // ✅ REDIRECT AFTER LOGIN
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleLogin}>Login</button>

      <p>{message}</p>
    </div>
  );
}