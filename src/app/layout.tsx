import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Each page sets its own `title`, e.g. "All Books" -> "BookNook | All Books"
export const metadata: Metadata = {
  title: {
    default: "BookNook | Home",
    template: "BookNook | %s",
  },
  icons: { icon: "/logo.svg" },
  description:
    "BookNook is a cozy little online library. Add a book, borrow a book, return a book.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex w-full flex-1 flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
