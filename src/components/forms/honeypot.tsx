"use client";

import { useState } from "react";

/**
 * Anti-spam honeypot. Renders an off-screen text field that real users never
 * see or fill. Bots that auto-fill every input populate `company`; the server
 * silently drops any submission where it is non-empty.
 *
 * Usage:
 *   const { company, honeypotField } = useHoneypot();
 *   // include `company` in the POST body, and render {honeypotField} in the form
 */
export function useHoneypot() {
  const [company, setCompany] = useState("");

  const honeypotField = (
    <input
      type="text"
      name="company"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        opacity: 0,
      }}
    />
  );

  return { company, honeypotField };
}
