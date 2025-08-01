import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "./navbar";
import { UserProvider } from '@/context/UserContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NotificationProvider } from '@/context/NotificationContext';
import Footer from "./footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Knowledge",
  description: "Scrape comments to instantly know your market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 112px)", marginTop: "7rem" }}
        >
          <UserProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
          </UserProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
