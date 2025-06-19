import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voicemail Drop - Professional Car Dealership Sales Tool",
  description: "Streamline your car dealership sales with automated, TCPA-compliant voicemail campaigns. Increase outreach efficiency and connect with prospects at scale.",
  keywords: "voicemail campaigns, car dealership, sales automation, TCPA compliant, automotive sales",
  authors: [{ name: "Voicemail Drop" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={4000}
          />
        </Providers>
      </body>
    </html>
  );
}
