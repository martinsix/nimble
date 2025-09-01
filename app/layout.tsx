import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { TopBar } from "@/components/top-bar";
import { BottomTabBar } from "@/components/bottom-tab-bar";

export const metadata: Metadata = {
  title: "Nimble Navigator",
  description:
    "Navigate your adventures with ease - A digital character sheet for Nimble RPG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="antialiased">
        <TopBar />
        {children}
        <Toaster />
        <BottomTabBar />
      </body>
    </html>
  );
}
