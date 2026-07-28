import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "./analytics-client";
import { getCurrentUser } from "@/src/services/session.service";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AnalyticsClient user={user} />
  );
}
