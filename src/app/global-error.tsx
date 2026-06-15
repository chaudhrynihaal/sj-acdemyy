"use client";

// Root-level error boundary. Renders its own <html>/<body> because it replaces
// the root layout when a top-level render error occurs. Keep it dependency-free.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          background: "#f3f3f3",
          color: "#0f172a",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ marginTop: "0.75rem", maxWidth: "28rem", color: "#475569" }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "2rem",
            borderRadius: "9999px",
            background: "#002b5b",
            color: "#fff",
            padding: "0.75rem 1.75rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
