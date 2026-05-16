"use client";

import "./globals.css";
import { Toaster } from "react-hot-toast";

import { ThemeProvider }
from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
  <button
  onClick={() => {
    document.documentElement.classList.toggle(
      "dark"
    );
  }}
>
  Toggle Dark Mode
</button>
}
