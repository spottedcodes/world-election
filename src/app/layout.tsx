import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteConfig } from "@/lib/data";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#12112a" },
    { media: "(prefers-color-scheme: light)", color: "#f6f5ff" },
  ],
};

export function generateMetadata(): Metadata {
  const siteConfig = getSiteConfig();
  return {
    title: {
      default: `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
      template: `%s`,
    },
    description: siteConfig.brand.description,
  };
}

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('we-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const siteConfig = getSiteConfig();

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${bricolage.variable} ${instrument.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-contrast"
        >
          Skip to main content
        </a>
        <SiteHeader config={siteConfig} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter config={siteConfig} />
      </body>
    </html>
  );
}
