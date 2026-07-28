import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { GitHubProfileClient } from "./github-profile-client";
import { getCurrentUser } from "@/src/services/session.service";

export default async function GitHubProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <GitHubProfileClient user={user} />
  );
}
