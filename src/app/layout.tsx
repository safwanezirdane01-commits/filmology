import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FilmologyX | Watch Movies Free",
  description: "The ultimate platform for streaming the best movies. Watch high-quality animation, sci-fi, horror, and action films for free on FilmologyX.",
  keywords: ["streaming", "movies", "watch free", "filmologyx", "cinema"],
  openGraph: {
    title: "FilmologyX",
    description: "The ultimate platform for streaming the best movies.",
    siteName: "FilmologyX",
    type: "website",
  },
  verification: {
    google: "BjT37pboaQsm68KPq3wiRCm1gq7EmuX7c5IPaxVASaE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-rose-500/30 selection:text-rose-200`}>
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
