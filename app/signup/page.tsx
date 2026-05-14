"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shoplink-backend-eiik.onrender.com";

  const handleSignup = async () => {
    setMessage("Creating account...");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed");
        return;
      }

      // OPTIONAL: store token immediately
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage("Account created successfully");

      setTimeout(() => router.push("/login"), 800);
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Sign Up</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSignup}>
        Create Account
      </button>

      <p>{message}</p>
    </div>
  );
}