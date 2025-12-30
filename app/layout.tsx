import type { Metadata } from "next";
import { Bakbak_One } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const bakbakOne = Bakbak_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bakbak",
});

export const metadata: Metadata = {
  title: "Sean Hershey",
  description: "Sean Hershey's portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-screen flex flex-col ${bakbakOne.variable}`}
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
