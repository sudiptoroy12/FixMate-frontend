import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/theme/ThemeProvider";
import { Suspense } from "react";
import Navbar from "./components/shared/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import Footer from "./components/shared/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "FixMate",
  description: "Book trusted technicians for device and home appliance repairs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full ">
        <ThemeProvider>
         
          <main className="mx-auto w-full">
            {children}
          </main>
          <Footer/>

          <ToastContainer />

     
        </ThemeProvider>
      </body>
    </html>
  );
}
