import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import NavbarDesktop from "./(user)/views/navbarDesktop";
import { TanstackQueryProvider } from "@/providers/tanstack-query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TanstackQueryProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background antialiased",
            inter.className,
          )}
        >
          {children}
          <Toaster richColors />
        </body>
      </html>
    </TanstackQueryProvider>
  );
}
