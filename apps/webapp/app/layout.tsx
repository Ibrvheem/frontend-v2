import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/config";

// Inter is the only font in the app (see DESIGN.md)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Absolute base for OG/Twitter image URLs. Prefers an explicit env var, then the
// Vercel production domain, then a sensible default.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: APP_NAME,
  description: APP_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextTopLoader
          color="#057dcd"
          height={2}
          shadow={false}
          showSpinner={false}
        />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster
          theme="light"
          toastOptions={{
            classNames: {
              toast:
                "bg-card border border-border text-foreground font-sans rounded-lg shadow-lg gap-3 !w-96",
              title: "text-sm font-medium",
              description: "text-xs text-muted-foreground",
              // no icons unless approved, the left border carries the status
              icon: "hidden",
              success: "border-l-4 border-l-success",
              error: "border-l-4 border-l-danger",
              warning: "border-l-4 border-l-warning",
              info: "border-l-4 border-l-info",
            },
          }}
        />
      </body>
    </html>
  );
}
