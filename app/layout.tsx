import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Missions",
  description: "A lightweight personal life operating system for daily missions.",
};

const navItems = [
  { href: "/", label: "Today" },
  { href: "/check-in", label: "Check-in" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="mission-panel mb-6 flex flex-col gap-4 rounded-sm p-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="min-w-0">
              <p className="micro-label text-[10px] font-medium">
                Daily Missions
              </p>
              <h1 className="forged-title mt-1 text-2xl text-[#f2f0e8]">
                Still Being Forged
              </h1>
            </Link>
            <nav className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-sm border border-white/15 bg-white/[0.04] px-4 py-2 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-white/70 transition hover:border-white/50 hover:bg-white/[0.08] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
