import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QR Code Store",
  description: "Tag-Based QR Code Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Main navigation tabs
  const navigationTabs = [
    {
      id: "home",
      label: "Home",
      href: "/",
    },
    {
      id: "create",
      label: "Create QR",
      href: "/create",
    },
    {
      id: "templates",
      label: "Templates",
      href: "/templates",
    },
    {
      id: "manage",
      label: "Tags",
      href: "/manage",
    },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header tabs={navigationTabs} />
        <Toaster position="top-right" richColors />
        <main className="min-h-screen px-4 py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-screen-xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
