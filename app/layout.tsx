import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './results/components/Navbar';
import Footer from './results/components/Footer';
import ChatbotWrapper from './results/components/ChatbotWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "NextPath - Find Your Perfect Career Path",
  description: "Discover the best career options based on your qualifications, marks, interests, skills, and financial condition. AI-powered career guidance to help you make informed decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ChatbotWrapper />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
