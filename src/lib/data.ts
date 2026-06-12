import { createClient } from "@/lib/supabase/server";

export type Testimonial = {
  id: string;
  name: string;
  content: string;
  role: string | null;
  created_at: string;
};

export type BlogListItem = {
  id: string;
  title: string;
  author: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  file_url: string | null;
  published_at: string;
};

export type ResourceFile = { name: string; url: string };

export type ResourceItem = {
  id: string;
  name: string;
  subject: string;
  files: ResourceFile[];
  created_at: string;
};

type ResourceRowRaw = {
  id: string;
  name: string;
  subject: string;
  files: unknown;
  file_url: string | null;
  created_at: string;
};

function normalizeResourceFiles(
  raw: unknown,
  legacyUrl: string | null,
  name: string,
): ResourceFile[] {
  if (Array.isArray(raw)) {
    const files = raw
      .filter(
        (f): f is { name?: unknown; url: string } =>
          !!f &&
          typeof f === "object" &&
          typeof (f as { url?: unknown }).url === "string",
      )
      .map((f) => ({
        name: typeof f.name === "string" && f.name ? f.name : name,
        url: f.url,
      }));
    if (files.length > 0) return files;
  }
  if (legacyUrl) return [{ name, url: legacyUrl }];
  return [];
}

export async function getTotalStudents(): Promise<number> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_statistics")
      .select("total_students")
      .eq("id", 1)
      .maybeSingle();
    if (data?.total_students != null) return data.total_students;
  } catch {
    /* missing env or network */
  }
  return 2000;
}

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("id,name,content,role,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(12);
    return (data as Testimonial[]) ?? [];
  } catch {
    return [];
  }
}

export async function getBlogs(): Promise<BlogListItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blogs")
      .select("id,title,author,slug,excerpt,cover_url,file_url,published_at")
      .order("published_at", { ascending: false });
    return (data as BlogListItem[]) ?? [];
  } catch {
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function getResources(): Promise<ResourceItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("resources")
      .select("id,name,subject,files,file_url,created_at")
      .order("created_at", { ascending: false });
    return ((data as ResourceRowRaw[] | null) ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      subject: r.subject,
      created_at: r.created_at,
      files: normalizeResourceFiles(r.files, r.file_url, r.name),
    }));
  } catch {
    return [];
  }
}

export type Notice = {
  id: string;
  title: string;
  body: string | null;
  is_active: boolean;
  created_at: string;
};

export async function getActiveNotices(): Promise<Notice[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("notices")
      .select("id,title,body,is_active,created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    return (data as Notice[]) ?? [];
  } catch {
    return [];
  }
}

export type Workshop = {
  id: string;
  name: string;
  date_time: string;
  details: string | null;
  description: string | null;
  course: string;
  is_active: boolean;
  created_at: string;
};

export async function getActiveWorkshops(): Promise<Workshop[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("workshops")
      .select("id,name,date_time,details,description,course,is_active,created_at")
      .eq("is_active", true)
      .order("date_time", { ascending: true });
    return (data as Workshop[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllWorkshops(): Promise<Workshop[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("workshops")
      .select("id,name,date_time,details,description,course,is_active,created_at")
      .order("created_at", { ascending: false });
    return (data as Workshop[]) ?? [];
  } catch {
    return [];
  }
}
