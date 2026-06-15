import { auth } from "@/src/auth";
import { getUserByEmail } from "@/src/services/user.service";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }

  return (
    <AnalyticsClient user={user} />
  );
}
