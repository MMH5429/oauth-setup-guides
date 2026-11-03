import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OAuth Setup Guides — Composio",
  description: "Know what it takes to set up OAuth and get your integration ready to ship.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
