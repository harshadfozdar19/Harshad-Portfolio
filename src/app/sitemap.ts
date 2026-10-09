import type { MetadataRoute } from "next";
import { isPublicDeployment, siteUrl } from "@/lib/site";

/**
 * Single-page site, so a single entry. Empty until the site is deployed publicly,
 * matching robots.txt. `lastModified` is omitted on purpose: a build-time `new Date()`
 * would change on every deploy without the content changing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicDeployment) return [];

  return [{ url: new URL("/", siteUrl).href, changeFrequency: "monthly", priority: 1 }];
}
