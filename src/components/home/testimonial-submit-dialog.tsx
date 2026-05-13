"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TestimonialSubmitDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          content: content.trim(),
          role: role.trim() || null,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error || "Request failed");
      }
      setDone(true);
      setName("");
      setRole("");
      setContent("");
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Could not submit. Please try again or email admissions@sjacademy.com.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setDone(false);
    setError(null);
  }

  return (
    <>
      <div className="mt-10 flex justify-center">
        <Button
          type="button"
          variant="secondary"
          className="border-2 border-amber-500 bg-white px-6 text-navy shadow-sm hover:bg-amber-50"
          onClick={() => setOpen(true)}
        >
          Share your experience
        </Button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            aria-label="Close dialog"
            onClick={handleClose}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-navy">Share a testimonial</h2>
            <p className="mt-1 text-sm text-slate-600">
              Your message is sent to our team for review. Approved quotes appear in
              &ldquo;What families say&rdquo; on the homepage.
            </p>
            {done ? (
              <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                Thank you! We have received your testimonial and will review it soon.
              </p>
            ) : (
              <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Your name (as you would like it shown)
                  </label>
                  <Input
                    required
                    minLength={2}
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amina R."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Label (optional)
                  </label>
                  <Input
                    maxLength={80}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. A-Level student, Parent"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Your experience
                  </label>
                  <Textarea
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What stood out about learning with SJ Academy?"
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {content.length}/2000 — at least 10 characters
                  </p>
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <Button type="submit" className="w-full" loading={loading}>
                  Submit for review
                </Button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
