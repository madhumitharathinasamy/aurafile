import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { themeConfig } from "@/config/theme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ClientToaster } from "@/components/ui/ClientToaster";
import { CookieConsent } from "@/components/layout/CookieConsent";
import Script from "next/script";


export const dynamic = "force-static";
export const revalidate = 86400;


export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  alternates: {
    canonical: `https://${siteConfig.domain}`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `https://${siteConfig.domain}`,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@aurafile",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate CSS variables from themeConfig
  const themeVariables = {
    "--background": themeConfig.colors.background,
    "--foreground": themeConfig.colors.foreground,
    "--primary": themeConfig.colors.primary,
    "--primary-foreground": themeConfig.colors.primaryForeground,
    "--secondary": themeConfig.colors.secondary,
    "--secondary-foreground": themeConfig.colors.secondaryForeground,
    "--accent": themeConfig.colors.accent,
    "--border": themeConfig.colors.border,
    "--input": themeConfig.colors.input,
    "--surface": themeConfig.colors.surface,
    "--text-secondary": themeConfig.colors.textSecondary,
    "--text-muted": themeConfig.colors.textMuted,
    "--divider": themeConfig.colors.divider,
    "--ring": themeConfig.colors.ring,
    "--radius-sm": themeConfig.borderRadius.sm,
    "--radius-md": themeConfig.borderRadius.md,
    "--radius-lg": themeConfig.borderRadius.lg,
    "--container-width": themeConfig.spacing.container,
    "--section-spacing": themeConfig.spacing.section,
  } as React.CSSProperties;

  return (
    <html lang="en">
      <body className="font-sans antialiased" style={themeVariables} suppressHydrationWarning>
        {/* Placeholder AdSense Script: Replace with actual Publisher ID once approved */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000" 
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Global Schema.org Structured Data */}
        <Script
          id="global-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": siteConfig.name,
              "description": siteConfig.description,
              "url": `https://${siteConfig.domain}/`,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `https://${siteConfig.domain}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        <Header />
        {children}
        <Footer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-0000000000"} />
        <ClientToaster />
        <CookieConsent />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
