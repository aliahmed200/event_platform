import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Weight } from "lucide-react";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Evently",
  description: "Evently is a platform for event managment",
  icons: "/assets/images/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable}  antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
