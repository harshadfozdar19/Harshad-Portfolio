import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { profile } from "@/content/profile";
import { siteUrl, isPublicDeployment } from "@/lib/site";
import "./globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const description = `${profile.name}: ${profile.role} building cybersecurity, OSINT and AI investigation systems with TypeScript, NestJS, Next.js, LangGraph and Gemini.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description,
  authors: [{ name: profile.name, url: profile.linkedin }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    title: `${profile.name} · ${profile.role}`,
    description,
    url: "/",
    siteName: profile.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.role}`,
    description,
  },
  // Stay out of search engines until the site is deliberately deployed with NEXT_PUBLIC_SITE_URL.
  robots: isPublicDeployment ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2eee5" },
    { media: "(prefers-color-scheme: dark)", color: "#12110e" },
  ],
};

/** Applies a saved theme before first paint so there is no light/dark flash. */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  worksFor: { "@type": "Organization", name: "Frautect Technologies" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Chandigarh University" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  sameAs: [profile.linkedin],
  knowsAbout: [
    "TypeScript",
    "NestJS",
    "Next.js",
    "LangGraph",
    "Gemini",
    "RAG",
    "OSINT",
    "BullMQ",
    "Playwright",
    "PostgreSQL",
    "Prompt Engineering",
    "Context Engineering",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
