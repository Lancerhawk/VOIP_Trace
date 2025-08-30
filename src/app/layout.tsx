import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import NotificationManager from "@/components/NotificationManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoIP Trace - Advanced VoIP Call Log Monitoring System",
  description: "Detect suspicious activities and fraudulent communication patterns in VoIP call logs. Built for law enforcement and telecom administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <NotificationProvider>
            <LoadingOverlay />
            <NotificationManager />
            {children}
          </NotificationProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
