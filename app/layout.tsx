import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "FoodSwap AI — Find Healthier Food Alternatives",
    template: "%s | FoodSwap AI",
  },
  description:
    "Analyze any food, get instant nutrition facts, and discover healthier alternatives powered by AI.",
  keywords: [
    "food nutrition",
    "healthy eating",
    "food alternatives",
    "AI nutrition",
    "diet",
    "calories",
  ],
  authors: [{ name: "FoodSwap AI" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "14px",
              background: "#ffffff",
              color: "#111827",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        />
      </body>
    </html>
  );
}
