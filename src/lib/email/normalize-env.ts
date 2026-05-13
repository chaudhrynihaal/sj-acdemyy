/** Strip BOM, trim, and remove one layer of wrapping quotes from .env values. */
export function stripEnvValue(value: string): string {
  let v = value.replace(/^\uFEFF/, "").trim();
  while (
    v.length >= 2 &&
    ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

/**
 * Single-line "From" / Reply-To safe for Resend. Collapses accidental newlines in .env
 * (or editors wrapping) so the address is never split across lines inside <>.
 */
export function normalizeEmailFromHeader(value: string): string {
  let v = stripEnvValue(value);
  v = v.replace(/\r\n|\r|\n/g, " ").replace(/\s+/g, " ").trim();
  const m = v.match(/^(.*?)\s*<\s*([^>]+?)\s*>$/);
  if (m) {
    const name = m[1].trim();
    const addr = m[2].replace(/\s/g, "");
    return name ? `${name} <${addr}>` : addr;
  }
  return v.replace(/\s/g, "");
}
