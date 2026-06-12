import { auth } from "@/src/auth";
import { getUserByEmail } from "@/src/server/user/user.service";
import { redirect } from "next/navigation";
import { GitHubProfileClient } from "./github-profile-client";

export default async function GitHubProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }

  return (
    <GitHubProfileClient user={user} />
  );
}
