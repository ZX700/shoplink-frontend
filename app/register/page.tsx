"use client";

import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const res = await fetch("https://shoplink-backend-eiik.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.userId) {
      alert("Account created");
      window.location.href = "/login";
    } else {
      alert("Failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>

      <input placeholder="name" onChange={(e) => setName(e.target.value)} />
      <br />
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <button onClick={register}>Create Account</button>
    </div>
  );
}