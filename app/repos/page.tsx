import { auth } from "@/src/auth";
import { getUserByEmail } from "@/src/services/user.service";
import { redirect } from "next/navigation";
import { ReposClient } from "./repos-client";

export default async function ReposPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }

  return (
    <ReposClient user={user} />
  );
}
