import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/providers/sessionProvider";
import ToastContainerWrapper from "@/common/components/ToastContainer";
import ReactQueryProvider from "@/providers/reactQueryProvider";
import SessionGuard from "@/libs/sessionGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Interview Agent",
  description: "A platform to review and improve your interviews using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <SessionProviderWrapper>
            <SessionGuard>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </SessionGuard>
          </SessionProviderWrapper>
          <ToastContainerWrapper />
      </body>
    </html>
  );
}
