/** Base site URL for links in emails (no trailing slash). */
export function siteUrl() {
  const u = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (u) return u;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
