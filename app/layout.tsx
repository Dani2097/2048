import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gioco 2048 - Divertiti e sfida i tuoi amici!",
  description: "Gioca a 2048, il famoso gioco di combinazione di numeri. Muovi le tessere, somma i numeri e raggiungi il numero 2048 per vincere!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
