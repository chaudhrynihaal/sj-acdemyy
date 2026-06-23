"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useHoneypot } from "@/components/forms/honeypot";

type EnrolModalProps = {
  open: boolean;
  onClose: () => void;
  subject: string;
};

export function EnrolModal({ open, onClose, subject }: EnrolModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { company, honeypotField } = useHoneypot();

  if (!open) return null;

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
          phone: phone || null,
          message: message || null,
          source: "subject_enrol",
          subject,
          company,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error || "Request failed");
      }
      setDone(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (e) {
      const msg =
        e instanceof Error && e.message
          ? e.message
          : "Could not submit right now. Please email admissions@sjacademy.com.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-navy">Enroll — {subject}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Leave your details and we will get back to you shortly.
        </p>
        {done ? (
          <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            Thank you! We have received your enquiry.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {honeypotField}
            <div>
              <label className="text-xs font-semibold text-slate-600">
                Full name
              </label>
              <Input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Email</label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                The academy is notified straight away. When your request is reviewed in
                the admin portal, the decision is emailed to this address.
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Phone</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1"
              />
            </div>
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}
            <Button type="submit" className="w-full" loading={loading}>
              Submit enquiry
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
