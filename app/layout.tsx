import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skogstorp-Gunntorp | Vägsamfällighetsförening",
  description:
    "Medlemsportal för Skogstorp-Gunntorps Samfällighetsförening. Nyheter, dokument, problemrapportering och mer.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}