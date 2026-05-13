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
  file_url: string | null;
  published_at: string;
};

export type ResourceItem = {
  id: string;
  name: string;
  subject: string;
  file_url: string;
  created_at: string;
};

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
  return 120;
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
      .select("id,title,author,slug,excerpt,file_url,published_at")
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
      .select("id,name,subject,file_url,created_at")
      .order("created_at", { ascending: false });
    return (data as ResourceItem[]) ?? [];
  } catch {
    return [];
  }
}
