import { getBlogs } from "@/lib/data";
import { BlogsExplorer } from "@/components/blogs/blogs-explorer";

export default async function BlogsPage() {
  const blogs = await getBlogs();
  return <BlogsExplorer blogs={blogs} />;
}
