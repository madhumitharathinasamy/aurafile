import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import { themeConfig } from "@/config/theme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ClientToaster } from "@/components/ui/ClientToaster";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { InteractionWrapper } from "@/components/analytics/InteractionWrapper";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});


export const dynamic = "force-static";
export const revalidate = 86400;


export const metadata: Metadata = {
  metadataBase: new URL("https://aurafile.net"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  alternates: {
    canonical: "https://aurafile.net",
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
    <html lang="en" className={inter.variable}>
      <head>
        {/* Resource Hints — resolve DNS before scripts fire */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} font-sans antialiased`} style={themeVariables} suppressHydrationWarning>
        {/* AdSense verification and ad delivery - Deferred until interaction */}
        <InteractionWrapper>
          <Script 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6779576782536943" 
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        </InteractionWrapper>

        {/* Global Schema.org Structured Data — plain script tag, no runtime overhead */}
        <script
          type="application/ld+json"
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
        <InteractionWrapper>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-0000000000"} />
        </InteractionWrapper>
        <ClientToaster />
        <CookieConsent />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
