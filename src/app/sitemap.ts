import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { isPublicDeployment, siteUrl } from "@/lib/site";

/**
 * Home page plus the résumé PDF. Empty until the site is deployed publicly,
 * matching robots.txt. `lastModified` is omitted on purpose: a build-time `new Date()`
 * would change on every deploy without the content changing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicDeployment) return [];

  const home = {
    url: new URL("/", siteUrl).href,
    changeFrequency: "monthly" as const,
    priority: 1,
    ...(profile.photo ? { images: [new URL(profile.photo, siteUrl).href] } : {}),
  };
  // Google indexes PDFs, so the résumé can surface in search on its own.
  const resume = profile.resume
    ? [{ url: new URL(profile.resume, siteUrl).href, changeFrequency: "monthly" as const, priority: 0.8 }]
    : [];
  return [home, ...resume];
}
