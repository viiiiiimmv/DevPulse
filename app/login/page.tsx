import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { LoginCard } from "./login-card";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <LoginCard />;
}