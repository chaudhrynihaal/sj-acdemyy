"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Pencil, Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { slugify } from "@/lib/slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Tab =
  | "resources"
  | "blogs"
  | "testimonials"
  | "demo_requests"
  | "enrol_requests"
  | "workshops";

type PendingTestimonial = {
  id: string;
  name: string;
  content: string;
  role: string | null;
  created_at: string;
};

const DEMO_SOURCE = "demo_session";
const ENROL_SOURCE = "subject_enrol";
const WORKSHOP_SOURCE = "workshop_enrol";

type EnrollmentRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string;
  subject: string | null;
  created_at: string;
};

type WorkshopRow = {
  id: string;
  name: string;
  date_time: string;
  details: string | null;
  description: string | null;
  course: string;
  is_active: boolean;
  created_at: string;
};

type ResourceRow = {
  id: string;
  name: string;
  subject: string;
  file_url: string;
  created_at: string;
};

type BlogRow = {
  id: string;
  title: string;
  author: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  file_url: string | null;
  published_at: string;
};

function safeStorageName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1) : "";
  const safeBase =
    base
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "file";
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return safeExt ? `${safeBase}.${safeExt}` : safeBase;
}

function errorMessage(err: unknown): string {
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return String(err);
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

type SbInit =
  | { kind: "ok"; client: SupabaseClient }
  | { kind: "missing" };

export function AdminDashboard() {
  const router = useRouter();

  const [init] = useState<SbInit>(() => {
    try {
      return { kind: "ok", client: createClient() };
    } catch {
      return { kind: "missing" };
    }
  });

  const [tab, setTab] = useState<Tab>("resources");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [resName, setResName] = useState("");
  const [resSubject, setResSubject] = useState("English");
  const [resFile, setResFile] = useState<File | null>(null);
  const [resLoading, setResLoading] = useState(false);
  const [resMsg, setResMsg] = useState<string | null>(null);
  const [resList, setResList] = useState<ResourceRow[]>([]);
  const [resListBusy, setResListBusy] = useState(false);
  const [resDeletingId, setResDeletingId] = useState<string | null>(null);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogBody, setBlogBody] = useState("");
  const [blogCover, setBlogCover] = useState<File | null>(null);
  const [blogFile, setBlogFile] = useState<File | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogMsg, setBlogMsg] = useState<string | null>(null);
  const [blogList, setBlogList] = useState<BlogRow[]>([]);
  const [blogListBusy, setBlogListBusy] = useState(false);
  const [blogDeletingId, setBlogDeletingId] = useState<string | null>(null);
  const [blogEditingId, setBlogEditingId] = useState<string | null>(null);

  const [pending, setPending] = useState<PendingTestimonial[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  const [tName, setTName] = useState("");
  const [tRole, setTRole] = useState("");
  const [tContent, setTContent] = useState("");
  const [tAddLoading, setTAddLoading] = useState(false);
  const [tAddMsg, setTAddMsg] = useState<string | null>(null);
  const [approvedT, setApprovedT] = useState<PendingTestimonial[]>([]);
  const [approvedTBusy, setApprovedTBusy] = useState(false);
  const [tEditingId, setTEditingId] = useState<string | null>(null);
  const [tDeletingId, setTDeletingId] = useState<string | null>(null);

  const [demoRequests, setDemoRequests] = useState<EnrollmentRequest[]>([]);
  const [demoBusy, setDemoBusy] = useState(false);
  const [enrolRequests, setEnrolRequests] = useState<EnrollmentRequest[]>([]);
  const [enrolBusy, setEnrolBusy] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState<EnrollmentRequest[]>([]);
  const [enrolledBusy, setEnrolledBusy] = useState(false);

  // Workshops tab state
  const [workshopName, setWorkshopName] = useState("");
  const [workshopDateTime, setWorkshopDateTime] = useState("");
  const [workshopDetails, setWorkshopDetails] = useState("");
  const [workshopDescription, setWorkshopDescription] = useState("");
  const [workshopCourse, setWorkshopCourse] = useState("English");
  const [workshopLoading, setWorkshopLoading] = useState(false);
  const [workshopMsg, setWorkshopMsg] = useState<string | null>(null);
  const [workshopList, setWorkshopList] = useState<WorkshopRow[]>([]);
  const [workshopListBusy, setWorkshopListBusy] = useState(false);
  const [workshopEnrolRequests, setWorkshopEnrolRequests] = useState<EnrollmentRequest[]>([]);
  const [workshopEnrolBusy, setWorkshopEnrolBusy] = useState(false);
  const [workshopEnrolledStudents, setWorkshopEnrolledStudents] = useState<EnrollmentRequest[]>([]);
  const [workshopEnrolledBusy, setWorkshopEnrolledBusy] = useState(false);

  const db = init.kind === "ok" ? init.client : null;

  useEffect(() => {
    if (!db) return;
    let cancelled = false;
    db.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      startTransition(() => {
        setUserEmail(data.user?.email ?? null);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [db]);

  const loadResources = useCallback(async () => {
    if (!db) return;
    setResListBusy(true);
    const { data, error } = await db
      .from("resources")
      .select("id,name,subject,file_url,created_at")
      .order("created_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setResList(data as ResourceRow[]);
      setResListBusy(false);
    });
  }, [db]);

  const loadBlogs = useCallback(async () => {
    if (!db) return;
    setBlogListBusy(true);
    const { data, error } = await db
      .from("blogs")
      .select("id,title,author,slug,excerpt,body,cover_url,file_url,published_at")
      .order("published_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setBlogList(data as BlogRow[]);
      setBlogListBusy(false);
    });
  }, [db]);

  const loadPending = useCallback(async () => {
    if (!db) return;
    setTestLoading(true);
    const { data, error } = await db
      .from("testimonials")
      .select("id,name,content,role,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setPending(data as PendingTestimonial[]);
      setTestLoading(false);
    });
  }, [db]);

  const loadApprovedTestimonials = useCallback(async () => {
    if (!db) return;
    setApprovedTBusy(true);
    const { data, error } = await db
      .from("testimonials")
      .select("id,name,content,role,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setApprovedT(data as PendingTestimonial[]);
      setApprovedTBusy(false);
    });
  }, [db]);

  const loadDemoRequests = useCallback(async () => {
    if (!db) return;
    setDemoBusy(true);
    const { data, error } = await db
      .from("enrollments")
      .select("id,full_name,email,phone,message,source,subject,created_at")
      .eq("source", DEMO_SOURCE)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setDemoRequests(data as EnrollmentRequest[]);
      setDemoBusy(false);
    });
  }, [db]);

  const loadEnrolRequests = useCallback(async () => {
    if (!db) return;
    setEnrolBusy(true);
    const { data, error } = await db
      .from("enrollments")
      .select("id,full_name,email,phone,message,source,subject,created_at")
      .eq("source", ENROL_SOURCE)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setEnrolRequests(data as EnrollmentRequest[]);
      setEnrolBusy(false);
    });
  }, [db]);

  const loadWorkshopList = useCallback(async () => {
    if (!db) return;
    setWorkshopListBusy(true);
    const { data, error } = await db
      .from("workshops")
      .select("id,name,date_time,details,description,course,is_active,created_at")
      .order("created_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setWorkshopList(data as WorkshopRow[]);
      setWorkshopListBusy(false);
    });
  }, [db]);

  const loadWorkshopEnrolRequests = useCallback(async () => {
    if (!db) return;
    setWorkshopEnrolBusy(true);
    const { data, error } = await db
      .from("enrollments")
      .select("id,full_name,email,phone,message,source,subject,created_at")
      .eq("source", WORKSHOP_SOURCE)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setWorkshopEnrolRequests(data as EnrollmentRequest[]);
      setWorkshopEnrolBusy(false);
    });
  }, [db]);

  const loadEnrolledStudents = useCallback(async () => {
    if (!db) return;
    setEnrolledBusy(true);
    const { data, error } = await db
      .from("enrollments")
      .select("id,full_name,email,phone,subject,created_at")
      .eq("source", ENROL_SOURCE)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setEnrolledStudents(data as EnrollmentRequest[]);
      setEnrolledBusy(false);
    });
  }, [db]);

  const loadWorkshopEnrolledStudents = useCallback(async () => {
    if (!db) return;
    setWorkshopEnrolledBusy(true);
    const { data, error } = await db
      .from("enrollments")
      .select("id,full_name,email,phone,subject,created_at")
      .eq("source", WORKSHOP_SOURCE)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    startTransition(() => {
      if (!error && data) setWorkshopEnrolledStudents(data as EnrollmentRequest[]);
      setWorkshopEnrolledBusy(false);
    });
  }, [db]);

  useEffect(() => {
    if (!db || tab !== "resources") return;
    void loadResources();
  }, [db, tab, loadResources]);

  useEffect(() => {
    if (!db || tab !== "blogs") return;
    void loadBlogs();
  }, [db, tab, loadBlogs]);

  useEffect(() => {
    if (!db || tab !== "testimonials") return;
    let cancelled = false;
    db.from("testimonials")
      .select("id,name,content,role,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        startTransition(() => {
          if (!error && data) setPending(data as PendingTestimonial[]);
        });
      });
    void loadApprovedTestimonials();
    return () => {
      cancelled = true;
    };
  }, [db, tab, loadApprovedTestimonials]);

  useEffect(() => {
    if (!db || tab !== "demo_requests") return;
    let cancelled = false;
    db.from("enrollments")
      .select("id,full_name,email,phone,message,source,subject,created_at")
      .eq("source", DEMO_SOURCE)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        startTransition(() => {
          if (!error && data) setDemoRequests(data as EnrollmentRequest[]);
        });
      });
    return () => {
      cancelled = true;
    };
  }, [db, tab]);

  useEffect(() => {
    if (!db || tab !== "enrol_requests") return;
    let cancelled = false;
    db.from("enrollments")
      .select("id,full_name,email,phone,message,source,subject,created_at")
      .eq("source", ENROL_SOURCE)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        startTransition(() => {
          if (!error && data) setEnrolRequests(data as EnrollmentRequest[]);
        });
      });
    void loadEnrolledStudents();
    return () => {
      cancelled = true;
    };
  }, [db, tab, loadEnrolledStudents]);

  useEffect(() => {
    if (!db || tab !== "workshops") return;
    let cancelled = false;
    Promise.all([
      db
        .from("workshops")
        .select("id,name,date_time,details,description,course,is_active,created_at")
        .order("created_at", { ascending: false }),
      db
        .from("enrollments")
        .select("id,full_name,email,phone,message,source,subject,created_at")
        .eq("source", WORKSHOP_SOURCE)
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
    ]).then(([wRes, eRes]) => {
      if (cancelled) return;
      startTransition(() => {
        if (!wRes.error && wRes.data) setWorkshopList(wRes.data as WorkshopRow[]);
        if (!eRes.error && eRes.data)
          setWorkshopEnrolRequests(eRes.data as EnrollmentRequest[]);
      });
    });
    void loadWorkshopEnrolledStudents();
    return () => {
      cancelled = true;
    };
  }, [db, tab, loadWorkshopEnrolledStudents]);

  async function handleLogout() {
    if (db) await db.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function handleResourceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!db || !resFile) return;
    if (resFile.size === 0) {
      setResMsg("Selected file is empty (0 bytes). Re-select the PDF and try again.");
      return;
    }
    setResLoading(true);
    setResMsg(null);
    try {
      const path = `uploads/${Date.now()}-${safeStorageName(resFile.name)}`;
      const { error: upErr } = await db.storage
        .from("resources-bucket")
        .upload(path, resFile, { upsert: false });
      if (upErr) throw upErr;
      const {
        data: { publicUrl },
      } = db.storage.from("resources-bucket").getPublicUrl(path);
      const { error: insErr } = await db.from("resources").insert({
        name: resName,
        subject: resSubject,
        file_url: publicUrl,
      });
      if (insErr) throw insErr;
      setResMsg("Resource published.");
      setResName("");
      setResFile(null);
      void loadResources();
    } catch (err) {
      setResMsg(`Upload failed: ${errorMessage(err)}`);
    } finally {
      setResLoading(false);
    }
  }

  async function handleResourceDelete(r: ResourceRow) {
    if (!db) return;
    setResDeletingId(r.id);
    try {
      const marker = "/object/public/resources-bucket/";
      const idx = r.file_url.indexOf(marker);
      if (idx !== -1) {
        const path = decodeURIComponent(
          r.file_url.slice(idx + marker.length).split("?")[0],
        );
        await db.storage.from("resources-bucket").remove([path]);
      }
      const { error } = await db.from("resources").delete().eq("id", r.id);
      if (error) throw error;
      setResList((prev) => prev.filter((x) => x.id !== r.id));
    } catch (err) {
      setResMsg(`Could not delete resource: ${errorMessage(err)}`);
    } finally {
      setResDeletingId(null);
    }
  }

  async function handleBlogSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!db) return;
    if ((blogCover && blogCover.size === 0) || (blogFile && blogFile.size === 0)) {
      setBlogMsg("Selected file is empty (0 bytes). Re-select it and try again.");
      return;
    }
    setBlogLoading(true);
    setBlogMsg(null);
    try {
      let coverUrl: string | null = null;
      if (blogCover) {
        const path = `covers/${Date.now()}-${safeStorageName(blogCover.name)}`;
        const { error: upErr } = await db.storage
          .from("blogs-bucket")
          .upload(path, blogCover, { upsert: false });
        if (upErr) throw upErr;
        const {
          data: { publicUrl },
        } = db.storage.from("blogs-bucket").getPublicUrl(path);
        coverUrl = publicUrl;
      }
      let fileUrl: string | null = null;
      if (blogFile) {
        const path = `uploads/${Date.now()}-${safeStorageName(blogFile.name)}`;
        const { error: upErr } = await db.storage
          .from("blogs-bucket")
          .upload(path, blogFile, { upsert: false });
        if (upErr) throw upErr;
        const {
          data: { publicUrl },
        } = db.storage.from("blogs-bucket").getPublicUrl(path);
        fileUrl = publicUrl;
      }
      const slug = (blogSlug.trim() || slugify(blogTitle)).trim();
      if (blogEditingId) {
        const update: {
          title: string;
          author: string;
          slug: string;
          excerpt: string | null;
          body: string | null;
          cover_url?: string;
          file_url?: string;
        } = {
          title: blogTitle,
          author: blogAuthor,
          slug,
          excerpt: blogExcerpt || null,
          body: blogBody || null,
        };
        if (coverUrl) update.cover_url = coverUrl;
        if (fileUrl) update.file_url = fileUrl;
        const { error: updErr } = await db
          .from("blogs")
          .update(update)
          .eq("id", blogEditingId);
        if (updErr) throw updErr;
        setBlogMsg("Blog post updated.");
      } else {
        const { error: insErr } = await db.from("blogs").insert({
          title: blogTitle,
          author: blogAuthor,
          slug,
          excerpt: blogExcerpt || null,
          body: blogBody || null,
          cover_url: coverUrl,
          file_url: fileUrl,
        });
        if (insErr) throw insErr;
        setBlogMsg("Blog post created.");
      }
      setBlogEditingId(null);
      setBlogTitle("");
      setBlogAuthor("");
      setBlogSlug("");
      setBlogExcerpt("");
      setBlogBody("");
      setBlogCover(null);
      setBlogFile(null);
      void loadBlogs();
    } catch (err) {
      setBlogMsg(`Could not save blog: ${errorMessage(err)}`);
    } finally {
      setBlogLoading(false);
    }
  }

  function startBlogEdit(b: BlogRow) {
    setBlogEditingId(b.id);
    setBlogTitle(b.title);
    setBlogAuthor(b.author);
    setBlogSlug(b.slug);
    setBlogExcerpt(b.excerpt ?? "");
    setBlogBody(b.body ?? "");
    setBlogCover(null);
    setBlogFile(null);
    setBlogMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelBlogEdit() {
    setBlogEditingId(null);
    setBlogTitle("");
    setBlogAuthor("");
    setBlogSlug("");
    setBlogExcerpt("");
    setBlogBody("");
    setBlogCover(null);
    setBlogFile(null);
    setBlogMsg(null);
  }

  async function handleBlogDelete(b: BlogRow) {
    if (!db) return;
    setBlogDeletingId(b.id);
    try {
      const marker = "/object/public/blogs-bucket/";
      const paths: string[] = [];
      for (const url of [b.cover_url, b.file_url]) {
        if (!url) continue;
        const idx = url.indexOf(marker);
        if (idx !== -1) {
          paths.push(decodeURIComponent(url.slice(idx + marker.length).split("?")[0]));
        }
      }
      if (paths.length > 0) {
        await db.storage.from("blogs-bucket").remove(paths);
      }
      const { error } = await db.from("blogs").delete().eq("id", b.id);
      if (error) throw error;
      setBlogList((prev) => prev.filter((x) => x.id !== b.id));
    } catch (err) {
      setBlogMsg(`Could not delete blog: ${errorMessage(err)}`);
    } finally {
      setBlogDeletingId(null);
    }
  }

  async function handleTestimonialAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!db) return;
    setTAddLoading(true);
    setTAddMsg(null);
    try {
      if (tEditingId) {
        const { error } = await db
          .from("testimonials")
          .update({
            name: tName.trim(),
            role: tRole.trim() || null,
            content: tContent.trim(),
          })
          .eq("id", tEditingId);
        if (error) throw error;
        setTAddMsg("Testimonial updated.");
      } else {
        const { error } = await db.from("testimonials").insert({
          name: tName.trim(),
          role: tRole.trim() || null,
          content: tContent.trim(),
          status: "approved",
        });
        if (error) throw error;
        setTAddMsg("Testimonial added — it is live on the site.");
      }
      setTEditingId(null);
      setTName("");
      setTRole("");
      setTContent("");
      void loadApprovedTestimonials();
    } catch (err) {
      setTAddMsg(`Could not save testimonial: ${errorMessage(err)}`);
    } finally {
      setTAddLoading(false);
    }
  }

  function startTestimonialEdit(t: PendingTestimonial) {
    setTEditingId(t.id);
    setTName(t.name);
    setTRole(t.role ?? "");
    setTContent(t.content);
    setTAddMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelTestimonialEdit() {
    setTEditingId(null);
    setTName("");
    setTRole("");
    setTContent("");
    setTAddMsg(null);
  }

  async function handleApprovedTestimonialDelete(id: string) {
    if (!db) return;
    setTDeletingId(id);
    try {
      const { error } = await db.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      setApprovedT((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      setTAddMsg(`Could not delete testimonial: ${errorMessage(err)}`);
    } finally {
      setTDeletingId(null);
    }
  }

  async function approveTestimonial(id: string) {
    if (!db) return;
    const { error } = await db
      .from("testimonials")
      .update({ status: "approved" })
      .eq("id", id);
    if (!error) {
      void loadPending();
      void loadApprovedTestimonials();
    }
  }

  async function rejectTestimonial(id: string) {
    if (!db) return;
    const { error } = await db
      .from("testimonials")
      .update({ status: "rejected" })
      .eq("id", id);
    if (!error) void loadPending();
  }

  async function removeTestimonial(id: string) {
    if (!db) return;
    const { error } = await db.from("testimonials").delete().eq("id", id);
    if (!error) void loadPending();
  }

  async function setEnrollmentStatus(
    id: string,
    status: "approved" | "rejected",
    list: "demo" | "enrol" | "workshop",
  ) {
    const res = await fetch(`/api/enrollments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      console.error("[enrollment update]", payload.error ?? res.status);
      return;
    }
    if (list === "demo") void loadDemoRequests();
    else if (list === "enrol") {
      void loadEnrolRequests();
      void loadEnrolledStudents();
    } else {
      void loadWorkshopEnrolRequests();
      void loadWorkshopEnrolledStudents();
    }
  }

  async function handleWorkshopSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!db) return;
    setWorkshopLoading(true);
    setWorkshopMsg(null);
    try {
      const { error } = await db.from("workshops").insert({
        name: workshopName.trim(),
        date_time: workshopDateTime,
        details: workshopDetails.trim() || null,
        description: workshopDescription.trim() || null,
        course: workshopCourse,
        is_active: true,
      });
      if (error) throw error;
      setWorkshopMsg("Workshop created.");
      setWorkshopName("");
      setWorkshopDateTime("");
      setWorkshopDetails("");
      setWorkshopDescription("");
      setWorkshopCourse("English");
      void loadWorkshopList();
    } catch {
      setWorkshopMsg("Could not create workshop.");
    } finally {
      setWorkshopLoading(false);
    }
  }

  async function toggleWorkshopActive(id: string, current: boolean) {
    if (!db) return;
    await db.from("workshops").update({ is_active: !current }).eq("id", id);
    void loadWorkshopList();
  }

  async function deleteWorkshop(id: string) {
    if (!db) return;
    await db.from("workshops").delete().eq("id", id);
    void loadWorkshopList();
  }

  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        tab === id
          ? "bg-navy text-white shadow-md"
          : "text-slate-600 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );

  if (init.kind === "missing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted px-6 text-center">
        <p className="max-w-md text-slate-700">
          Add{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">.env.local</code>{" "}
          to use the admin dashboard.
        </p>
        <Link
          href="/"
          className="font-semibold text-amber-600 hover:text-amber-700"
        >
          ← Back to site
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link href="/" className="text-xs font-semibold text-amber-600 hover:underline">
              View site
            </Link>
            <p className="text-lg font-extrabold text-navy">Admin dashboard</p>
            {userEmail ? (
              <p className="text-xs text-slate-500">{userEmail}</p>
            ) : null}
          </div>
          <Button type="button" variant="secondary" onClick={() => void handleLogout()}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-4 sm:px-6">
          {tabBtn("resources", "Resources")}
          {tabBtn("blogs", "Blogs")}
          {tabBtn("testimonials", "Testimonials")}
          {tabBtn("demo_requests", "Demo sessions")}
          {tabBtn("enrol_requests", "Course enrolments")}
          {tabBtn("workshops", "Workshops")}
        </div>
      </header>

      <div
        className={`mx-auto px-4 py-10 sm:px-6 ${
          tab === "demo_requests" || tab === "enrol_requests" || tab === "workshops"
            ? "max-w-4xl"
            : "max-w-3xl"
        }`}
      >
        {tab === "resources" ? (
          <div className="space-y-8">
            <form
              onSubmit={(e) => void handleResourceSubmit(e)}
              className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-navy">Upload resource</h2>
              <div>
                <label className="text-xs font-semibold text-slate-600">Name</label>
                <Input
                  required
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Subject</label>
                <select
                  value={resSubject}
                  onChange={(e) => setResSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option>English</option>
                  <option>Sociology</option>
                  <option>General</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">File</label>
                <input
                  required
                  id="resource-file"
                  type="file"
                  onChange={(e) => setResFile(e.target.files?.[0] ?? null)}
                  className="sr-only"
                />
                <div className="mt-2 flex items-center gap-3">
                  <label
                    htmlFor="resource-file"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-slate-800"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload file
                  </label>
                  {resFile ? (
                    <span className="truncate text-sm text-slate-500">
                      {resFile.name}
                    </span>
                  ) : null}
                </div>
              </div>
              {resMsg ? (
                <p
                  className={`text-sm ${
                    /published|created|updated/i.test(resMsg)
                      ? "text-emerald-700"
                      : "text-red-600"
                  }`}
                >
                  {resMsg}
                </p>
              ) : null}
              <Button type="submit" loading={resLoading}>
                Publish resource
              </Button>
            </form>

            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-navy">Uploaded resources</h2>
              {resListBusy ? (
                <p className="mt-4 text-sm text-slate-500">Loading…</p>
              ) : resList.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No resources uploaded yet.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {resList.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <a
                          href={r.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-sm font-semibold text-navy hover:underline"
                        >
                          {r.name}
                        </a>
                        <p className="text-xs text-slate-500">
                          {r.subject} · {formatDateTime(r.created_at)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleResourceDelete(r)}
                        disabled={resDeletingId === r.id}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {resDeletingId === r.id ? "Deleting…" : "Delete"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : null}

        {tab === "blogs" ? (
          <div className="space-y-8">
          <form
            onSubmit={(e) => void handleBlogSubmit(e)}
            className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-navy">
              {blogEditingId ? "Edit blog post" : "Create blog post"}
            </h2>
            <div>
              <label className="text-xs font-semibold text-slate-600">Title</label>
              <Input
                required
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Author</label>
              <Input
                required
                value={blogAuthor}
                onChange={(e) => setBlogAuthor(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Slug</label>
              <Input
                value={blogSlug}
                onChange={(e) => setBlogSlug(e.target.value)}
                placeholder="auto-filled from title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Excerpt</label>
              <Textarea
                value={blogExcerpt}
                onChange={(e) => setBlogExcerpt(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Body</label>
              <Textarea
                value={blogBody}
                onChange={(e) => setBlogBody(e.target.value)}
                className="mt-1 min-h-[200px]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">
                Cover photo (optional)
              </label>
              <input
                id="blog-cover-file"
                type="file"
                accept="image/*"
                onChange={(e) => setBlogCover(e.target.files?.[0] ?? null)}
                className="sr-only"
              />
              <div className="mt-2 flex items-center gap-3">
                <label
                  htmlFor="blog-cover-file"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-slate-800"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload image
                </label>
                {blogCover ? (
                  <span className="truncate text-sm text-slate-500">
                    {blogCover.name}
                  </span>
                ) : null}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">
                Attachment (optional)
              </label>
              <input
                id="blog-attachment-file"
                type="file"
                onChange={(e) => setBlogFile(e.target.files?.[0] ?? null)}
                className="sr-only"
              />
              <div className="mt-2 flex items-center gap-3">
                <label
                  htmlFor="blog-attachment-file"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-slate-800"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload file
                </label>
                {blogFile ? (
                  <span className="truncate text-sm text-slate-500">
                    {blogFile.name}
                  </span>
                ) : null}
              </div>
            </div>
            {blogMsg ? (
              <p
                className={`text-sm ${
                  /published|created|updated/i.test(blogMsg)
                    ? "text-emerald-700"
                    : "text-red-600"
                }`}
              >
                {blogMsg}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" loading={blogLoading}>
                {blogEditingId ? "Save changes" : "Publish blog"}
              </Button>
              {blogEditingId ? (
                <Button type="button" variant="secondary" onClick={cancelBlogEdit}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-navy">Published blogs</h2>
            {blogListBusy ? (
              <p className="mt-4 text-sm text-slate-500">Loading…</p>
            ) : blogList.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No blogs published yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {blogList.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/blogs/${b.slug}`}
                        target="_blank"
                        className="block truncate text-sm font-semibold text-navy hover:underline"
                      >
                        {b.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {b.author} · {formatDateTime(b.published_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startBlogEdit(b)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-slate-200"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleBlogDelete(b)}
                        disabled={blogDeletingId === b.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {blogDeletingId === b.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          </div>
        ) : null}

        {tab === "testimonials" ? (
          <div className="space-y-6">
            <form
              onSubmit={(e) => void handleTestimonialAdd(e)}
              className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg"
            >
              <div>
                <h2 className="text-xl font-bold text-navy">
                  {tEditingId ? "Edit testimonial" : "Add testimonial"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {tEditingId
                    ? "Changes go live on the homepage as soon as you save."
                    : "Goes live on the homepage immediately — no review step."}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Name</label>
                  <Input
                    required
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    placeholder="e.g. Amina R."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Label (optional)
                  </label>
                  <Input
                    value={tRole}
                    onChange={(e) => setTRole(e.target.value)}
                    placeholder="e.g. A-Level student, Parent"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Testimonial
                </label>
                <Textarea
                  required
                  rows={3}
                  value={tContent}
                  onChange={(e) => setTContent(e.target.value)}
                  placeholder="What did they say about SJ Academy?"
                  className="mt-1"
                />
              </div>
              {tAddMsg ? (
                <p
                  className={`text-sm ${
                    /added|updated/i.test(tAddMsg)
                      ? "text-emerald-700"
                      : "text-red-600"
                  }`}
                >
                  {tAddMsg}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" loading={tAddLoading}>
                  {tEditingId ? "Save changes" : "Add testimonial"}
                </Button>
                {tEditingId ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={cancelTestimonialEdit}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">Pending testimonials</h2>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Submitted from the homepage &ldquo;Share your experience&rdquo;. Approve to show on
                  the site, reject to decline, or remove to delete the row.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => void loadPending()}
                loading={testLoading}
              >
                Refresh
              </Button>
            </div>
            {pending.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
                No pending testimonials.
              </p>
            ) : (
              <ul className="space-y-4">
                {pending.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg"
                  >
                    <p className="font-semibold text-navy">{t.name}</p>
                    {t.role ? (
                      <p className="text-xs text-amber-600">{t.role}</p>
                    ) : null}
                    <p className="mt-3 text-sm text-slate-700">{t.content}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="button" onClick={() => void approveTestimonial(t.id)}>
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void rejectTestimonial(t.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs text-slate-500"
                        onClick={() => void removeTestimonial(t.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-navy">
                Approved testimonials
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                These are live in &ldquo;What families say&rdquo; on the homepage.
              </p>
              {approvedTBusy ? (
                <p className="mt-4 text-sm text-slate-500">Loading…</p>
              ) : approvedT.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No approved testimonials yet.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {approvedT.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-start justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy">
                          {t.name}
                          {t.role ? (
                            <span className="ml-2 text-xs font-medium text-amber-600">
                              {t.role}
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {t.content}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDateTime(t.created_at)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startTestimonialEdit(t)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-slate-200"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleApprovedTestimonialDelete(t.id)}
                          disabled={tDeletingId === t.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {tDeletingId === t.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : null}

        {tab === "demo_requests" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">Demo session requests</h2>
                <p className="mt-1 text-sm text-slate-600">
                  From the Tuitions page &ldquo;Free Demo Session&rdquo; form. Approve when you
                  have contacted the family, or reject to archive.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => void loadDemoRequests()}
                loading={demoBusy}
              >
                Refresh
              </Button>
            </div>
            {demoRequests.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
                No pending demo requests.
              </p>
            ) : (
              <ul className="space-y-4">
                {demoRequests.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-navy">{r.full_name}</p>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        {formatDateTime(r.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">
                      <a
                        href={`mailto:${r.email}`}
                        className="font-medium text-amber-700 underline-offset-2 hover:underline"
                      >
                        {r.email}
                      </a>
                      {r.phone ? (
                        <span className="text-slate-600"> · {r.phone}</span>
                      ) : null}
                    </p>
                    {r.message ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                        {r.message}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={() => void setEnrollmentStatus(r.id, "approved", "demo")}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void setEnrollmentStatus(r.id, "rejected", "demo")}
                      >
                        Reject
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {tab === "enrol_requests" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">Course enrolment requests</h2>
                <p className="mt-1 text-sm text-slate-600">
                  From home subject cards &ldquo;Enrol Now&rdquo;. Subject is stored on each row.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => void loadEnrolRequests()}
                loading={enrolBusy}
              >
                Refresh
              </Button>
            </div>
            {enrolRequests.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
                No pending enrolment requests.
              </p>
            ) : (
              <ul className="space-y-4">
                {enrolRequests.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-navy">{r.full_name}</p>
                        {r.subject ? (
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            {r.subject}
                          </p>
                        ) : null}
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        {formatDateTime(r.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">
                      <a
                        href={`mailto:${r.email}`}
                        className="font-medium text-amber-700 underline-offset-2 hover:underline"
                      >
                        {r.email}
                      </a>
                      {r.phone ? (
                        <span className="text-slate-600"> · {r.phone}</span>
                      ) : null}
                    </p>
                    {r.message ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                        {r.message}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={() => void setEnrollmentStatus(r.id, "approved", "enrol")}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void setEnrollmentStatus(r.id, "rejected", "enrol")}
                      >
                        Reject
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Enrolled students */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-navy">Enrolled students</h3>
                  <p className="mt-0.5 text-sm text-slate-500">Approved course enrolments.</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void loadEnrolledStudents()}
                  loading={enrolledBusy}
                >
                  Refresh
                </Button>
              </div>
              {enrolledStudents.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
                  No enrolled students yet.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-lg">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Email</th>
                        <th className="px-5 py-3">Phone</th>
                        <th className="px-5 py-3">Course</th>
                        <th className="px-5 py-3">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enrolledStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-medium text-navy">{s.full_name}</td>
                          <td className="px-5 py-3">
                            <a
                              href={`mailto:${s.email}`}
                              className="text-amber-700 underline-offset-2 hover:underline"
                            >
                              {s.email}
                            </a>
                          </td>
                          <td className="px-5 py-3 text-slate-600">{s.phone ?? "—"}</td>
                          <td className="px-5 py-3">
                            {s.subject ? (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                                {s.subject}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-5 py-3 text-slate-500">
                            {formatDateTime(s.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {tab === "workshops" ? (
          <div className="space-y-10">
            {/* Create form */}
            <form
              onSubmit={(e) => void handleWorkshopSubmit(e)}
              className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-navy">Create workshop</h2>
              <div>
                <label className="text-xs font-semibold text-slate-600">Workshop name</label>
                <Input
                  required
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  placeholder="e.g. English Essay Writing Intensive"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Date &amp; time</label>
                <Input
                  required
                  type="datetime-local"
                  value={workshopDateTime}
                  onChange={(e) => setWorkshopDateTime(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Course</label>
                <select
                  value={workshopCourse}
                  onChange={(e) => setWorkshopCourse(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option>English</option>
                  <option>Sociology</option>
                  <option>General</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Details <span className="text-slate-400">(short summary)</span>
                </label>
                <Textarea
                  value={workshopDetails}
                  onChange={(e) => setWorkshopDetails(e.target.value)}
                  placeholder="Key topics covered, prerequisites, etc."
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Description <span className="text-slate-400">(longer content)</span>
                </label>
                <Textarea
                  value={workshopDescription}
                  onChange={(e) => setWorkshopDescription(e.target.value)}
                  placeholder="Full description of what students will learn..."
                  className="mt-1"
                />
              </div>
              {workshopMsg ? (
                <p
                  className={`text-sm ${workshopMsg.startsWith("Could") ? "text-red-600" : "text-emerald-700"}`}
                >
                  {workshopMsg}
                </p>
              ) : null}
              <Button type="submit" loading={workshopLoading}>
                Create workshop
              </Button>
            </form>

            {/* Workshop list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy">All workshops</h2>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void loadWorkshopList()}
                  loading={workshopListBusy}
                >
                  Refresh
                </Button>
              </div>
              {workshopList.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
                  No workshops yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {workshopList.map((w) => (
                    <li
                      key={w.id}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-navy">{w.name}</p>
                          <p className="mt-0.5 text-xs font-semibold text-amber-600">
                            {w.course}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {formatDateTime(w.date_time)}
                        </span>
                      </div>
                      {w.details ? (
                        <p className="mt-2 text-sm text-slate-600">{w.details}</p>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant={w.is_active ? "secondary" : "primary"}
                          onClick={() => void toggleWorkshopActive(w.id, w.is_active)}
                        >
                          {w.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-xs text-red-500 hover:text-red-600"
                          onClick={() => void deleteWorkshop(w.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Workshop enrolment requests */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-navy">Workshop enrolment requests</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Pending requests submitted via the Workshops page enrolment form.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void loadWorkshopEnrolRequests()}
                  loading={workshopEnrolBusy}
                >
                  Refresh
                </Button>
              </div>
              {workshopEnrolRequests.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
                  No pending workshop enrolment requests.
                </p>
              ) : (
                <ul className="space-y-4">
                  {workshopEnrolRequests.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-navy">{r.full_name}</p>
                          {r.subject ? (
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
                              {r.subject}
                            </p>
                          ) : null}
                        </div>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          {formatDateTime(r.created_at)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">
                        <a
                          href={`mailto:${r.email}`}
                          className="font-medium text-amber-700 underline-offset-2 hover:underline"
                        >
                          {r.email}
                        </a>
                        {r.phone ? (
                          <span className="text-slate-600"> · {r.phone}</span>
                        ) : null}
                      </p>
                      {r.message ? (
                        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                          {r.message}
                        </p>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          onClick={() =>
                            void setEnrollmentStatus(r.id, "approved", "workshop")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            void setEnrollmentStatus(r.id, "rejected", "workshop")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Workshop enrolled students */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-navy">Workshop enrolled students</h3>
                  <p className="mt-0.5 text-sm text-slate-500">Approved workshop enrolments.</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void loadWorkshopEnrolledStudents()}
                  loading={workshopEnrolledBusy}
                >
                  Refresh
                </Button>
              </div>
              {workshopEnrolledStudents.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
                  No enrolled students yet.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-lg">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Email</th>
                        <th className="px-5 py-3">Phone</th>
                        <th className="px-5 py-3">Workshop</th>
                        <th className="px-5 py-3">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {workshopEnrolledStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-medium text-navy">{s.full_name}</td>
                          <td className="px-5 py-3">
                            <a
                              href={`mailto:${s.email}`}
                              className="text-amber-700 underline-offset-2 hover:underline"
                            >
                              {s.email}
                            </a>
                          </td>
                          <td className="px-5 py-3 text-slate-600">{s.phone ?? "—"}</td>
                          <td className="px-5 py-3">
                            {s.subject ? (
                              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                {s.subject}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-5 py-3 text-slate-500">
                            {formatDateTime(s.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
