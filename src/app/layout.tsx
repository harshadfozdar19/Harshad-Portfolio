import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { profile, skills } from "@/content/profile";
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

const title = `${profile.name} | Full Stack & AI Engineer (Next.js, LangGraph, OSINT)`;
const description = `${profile.name} is a Full Stack & AI Engineer in Jaipur, India, building cybersecurity, OSINT and AI investigation systems with TypeScript, NestJS, Next.js, LangGraph, RAG and Gemini.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    profile.name,
    "Full Stack Developer",
    "AI Engineer",
    "Next.js Developer",
    "LangGraph",
    "RAG",
    "OSINT",
    "Cybersecurity",
    "NestJS",
    "TypeScript",
    "Jaipur",
    "India",
  ],
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: profile.linkedin }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    title,
    description,
    url: "/",
    siteName: profile.name,
    locale: "en_IN",
    firstName: profile.firstName,
    lastName: profile.lastName,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  // Stay out of search engines until the site is deliberately deployed with NEXT_PUBLIC_SITE_URL.
  robots: isPublicDeployment
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2eee5" },
    { media: "(prefers-color-scheme: dark)", color: "#12110e" },
  ],
};

/** Applies a saved theme before first paint so there is no light/dark flash. */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})();`;

const pageUrl = new URL("/", siteUrl).href;
const personId = `${pageUrl}#person`;

/** ProfilePage + Person (Google's profile-page structured data) and WebSite. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${pageUrl}#profile`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "en",
      mainEntity: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: profile.name,
      givenName: profile.firstName,
      familyName: profile.lastName,
      url: pageUrl,
      jobTitle: profile.role,
      description: profile.summary,
      ...(profile.photo ? { image: new URL(profile.photo, siteUrl).href } : {}),
      worksFor: { "@type": "Organization", name: "Frautect Technologies" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Chandigarh University" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
      sameAs: [profile.linkedin, "https://github.com/harshadfozdar19"],
      knowsAbout: skills.flatMap((group) => group.items),
    },
    {
      "@type": "WebSite",
      "@id": `${pageUrl}#website`,
      url: pageUrl,
      name: profile.name,
      publisher: { "@id": personId },
    },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
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
