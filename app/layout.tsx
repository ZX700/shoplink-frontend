"use client";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
        >
          <Toaster position="top-right" />

          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}