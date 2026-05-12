"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // DEBUG
  useEffect(() => {
    console.log(
      "SIGNUP API URL:",
      process.env.NEXT_PUBLIC_API_URL
    );
  }, []);

  const handleSignup = async () => {
    setMessage("Creating account...");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      console.log("USING API:", apiUrl);

      const res = await fetch(
        `${apiUrl}/api/auth/signup`,
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

      console.log("SIGNUP RESPONSE:", res);

      const data = await res.json();

      console.log("SIGNUP DATA:", data);

      if (!res.ok) {
        setMessage(data.error || "Signup failed");
        return;
      }

      setMessage("Signup successful!");

      setTimeout(() => {
        router.push("/login");
      }, 1000);

    } catch (err) {
      console.error("SIGNUP ERROR:", err);

      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Sign Up</h1>

      <input
        id="email"
        name="email"
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
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={handleSignup}>
        Sign Up
      </button>

      <p>{message}</p>
    </div>
  );
}