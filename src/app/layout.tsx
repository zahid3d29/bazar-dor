import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { AppProviders } from "@/app/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাজার দর | আজকের বাজারের দাম এক নজরে",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর এবং বাজারভিত্তিক মূল্য তুলনা।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" data-scroll-behavior="smooth">
      <body>
        <AppProviders>
          <Suspense
            fallback={<div className="header-fallback" aria-hidden="true" />}
          >
            <SiteHeader />
          </Suspense>
          <div className="app-content">{children}</div>
          <SiteFooter />
          <Toaster position="top-center" toastOptions={{ duration: 3200 }} />
        </AppProviders>
      </body>
    </html>
  );
}
