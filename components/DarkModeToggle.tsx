"use client";

import { useTheme } from "next-themes";

export default function DarkModeToggle() {
  const { theme, setTheme } =
    useTheme();

  return (
    <button
      onClick={() =>
        setTheme(
          theme === "dark"
            ? "light"
            : "dark"
        )
      }
      style={{
        width: 45,
        height: 45,
        borderRadius: 12,
        border: "none",
      }}
    >
      {theme === "dark"
        ? "☀️"
        : "🌙"}
    </button>
  );
}