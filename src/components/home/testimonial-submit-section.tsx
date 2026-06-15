"use client";

import { useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useHoneypot } from "@/components/forms/honeypot";

export function TestimonialSubmitSection() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { company, honeypotField } = useHoneypot();

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
          company,
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

  return (
    <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-5">
        {/* Left: invitation */}
        <div className="relative overflow-hidden bg-gradient-to-br from-navy to-slate-900 p-8 lg:col-span-2">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-400/20 blur-3xl" />
          <MessageSquareHeart className="h-8 w-8 text-amber-400" />
          <h3 className="mt-4 text-2xl font-extrabold text-white">
            Share your experience
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Studied with us? Your words help other families choose with
            confidence. Approved testimonials appear right here on the
            homepage.
          </p>
        </div>

        {/* Right: form */}
        <div className="p-8 lg:col-span-3">
          {done ? (
            <div className="flex h-full items-center justify-center">
              <p className="rounded-xl bg-emerald-50 p-5 text-sm font-medium text-emerald-800">
                Thank you! We have received your testimonial and will review it
                soon.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              {honeypotField}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Your name
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
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Your experience
                </label>
                <Textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What stood out about learning with SJ Academy?"
                  className="mt-1"
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" loading={loading}>
                Submit for review
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
