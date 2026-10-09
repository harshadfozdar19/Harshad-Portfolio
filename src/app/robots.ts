import type { MetadataRoute } from "next";
import { isPublicDeployment, siteUrl } from "@/lib/site";

/** Crawlers are only welcome once the site is deployed with NEXT_PUBLIC_SITE_URL set. */
export default function robots(): MetadataRoute.Robots {
  if (!isPublicDeployment) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
