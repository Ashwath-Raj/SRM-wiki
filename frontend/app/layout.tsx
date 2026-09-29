import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "SRM AP Wiki — Everything SRM AP, in one place.",
  description: "Centralized, searchable, verified digital knowledge platform for SRM University-AP students, faculty, and organizations.",
  keywords: ["SRM AP", "SRM University-AP", "Wiki", "Exams", "LMS", "Events", "Notices", "Clubs", "Regulations"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <Header />
        <main className="flex-1 w-full pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
