"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // DEBUG
  useEffect(() => {
    console.log(
      "API URL:",
      process.env.NEXT_PUBLIC_API_URL
    );

    console.log(
      "LOCAL USER:",
      localStorage.getItem("user")
    );
  }, []);

  const handleLogin = async () => {
    setMessage("Logging in...");

    try {
      console.log("LOGIN START");

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      console.log("API URL USED:", apiUrl);

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

      console.log("RAW RESPONSE:", res);

      const data = await res.json();

      console.log("LOGIN DATA:", data);

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      console.log(
        "SAVED USER:",
        localStorage.getItem("user")
      );

      setMessage("Login successful!");

      setTimeout(() => {
        router.push("/");
      }, 1000);

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <input
        name="email"
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        name="password"
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>

      <p>{message}</p>
    </div>
  );
}