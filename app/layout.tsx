import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import Providers from "@/components/ProgressBarProvider";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import { Bricolage_Grotesque } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business Clinic Platform",
  description: "Register and track your business issues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.className} antialiased`}>
        <AuthProvider>
          <TooltipProvider>
            <Providers>
              <Header />
              <div className="max-w-7xl mx-auto">{children}</div>
              <Toaster />
            </Providers>
          </TooltipProvider>
        </AuthProvider> 
       
      </body>
    </html>
  );
}
