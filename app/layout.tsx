import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

import { Caveat } from "next/font/google";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shiksha Disha - Academic Excellence Portal",
  description: "Comprehensive educational management system for students, parents, and teachers.",
  keywords: [
    "education",
    "school management",
    "college portal",
    "student portal",
    "teacher portal",
    "academic excellence",
    "learning management system",
    "LMS",
    "Shiksha Disha",
    "Just4students"
  ],
  icons: {
    icon: "/justlogo.png",
    shortcut: "/justlogo.png",
    apple: "/justlogo.png",
  },
  openGraph: {
    title: "Shiksha Disha - Academic Excellence Portal",
    description: "Comprehensive educational management system for students, parents, and teachers.",
    images: ["/justlogo.png"],
  },
};

import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { NotificationProvider } from "../context/NotificationContext";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "../components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <NotificationProvider>
            <ChatProvider>
              <SmoothScroll>
                {children}
              </SmoothScroll>
              <Toaster position="top-right" />
            </ChatProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
