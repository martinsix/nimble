import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { TopBar } from "@/components/top-bar";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/config/app-constants";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
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
