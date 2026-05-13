import { getResources } from "@/lib/data";
import { ResourcesGrid } from "@/components/resources/resources-grid";

export default async function ResourcesPage() {
  const resources = await getResources();
  return <ResourcesGrid resources={resources} />;
}
