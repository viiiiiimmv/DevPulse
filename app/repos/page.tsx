import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { ReposClient } from "./repos-client";
import { getCurrentUser } from "@/src/services/session.service";

export default async function ReposPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ReposClient user={user} />
  );
}
