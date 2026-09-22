import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/providers/AuthProvider";
import { QueryProvider } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RecySmart | Admin Dashboard",
  description:
    "Panel de administración central para la plataforma RecySmart: Gestión de basureros IoT, gamificación y usuarios en Lima Metropolitana.",
  applicationName: "RecySmart Admin",
  authors: [{ name: "RecySmart Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
        <Toaster position="top-center" richColors={true} expand={true} />
      </body>
    </html>
  );
}
