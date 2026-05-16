import { getActiveWorkshops } from "@/lib/data";
import { WorkshopsList } from "@/components/workshops/workshops-list";

export const metadata = {
  title: "Workshops | SJ Academy",
  description:
    "Live sessions and intensive workshops on English and Sociology at SJ Academy.",
};

export default async function WorkshopsPage() {
  const workshops = await getActiveWorkshops();
  return <WorkshopsList workshops={workshops} />;
}
