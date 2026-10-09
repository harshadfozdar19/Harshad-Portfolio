/**
 * Public URL of the deployed site. Unset during local development, in which case
 * the site is served from localhost and asks search engines not to index it.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const isPublicDeployment = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
