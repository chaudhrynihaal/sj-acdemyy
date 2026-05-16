"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onClose: () => void;
  workshopName: string;
  workshopId: string;
};

export function WorkshopEnrolModal({ open, onClose, workshopName }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleBackdropClick() {
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone: phone || undefined,
          message: message || undefined,
          source: "workshop_enrol",
          subject: workshopName,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
        setFullName("");
        setEmail("");
        setPhone("");
        setMessage("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="max-w-md w-full rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative border-b border-slate-100 px-6 py-5">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Workshop Enrolment
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-navy">{workshopName}</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {success ? (
            <div className="rounded-xl bg-emerald-50 p-5 text-center">
              <p className="font-semibold text-emerald-700">
                You&rsquo;re enrolled! We&rsquo;ll be in touch soon.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Phone <span className="text-slate-400">(optional)</span>
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Message <span className="text-slate-400">(optional)</span>
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any questions or notes..."
                  className="mt-1 min-h-[80px]"
                />
              </div>
              {error ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              ) : null}
              <Button type="submit" loading={loading} className="w-full">
                Submit Enrolment
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
