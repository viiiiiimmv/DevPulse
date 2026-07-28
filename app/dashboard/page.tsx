import { auth, signOut } from "@/src/auth";
import { getDashboardStats, getRecentActivity, getDashboardCommits } from "@/src/services/dashboard.service";
import { redirect } from "next/navigation";
import { DashboardContent } from "./dashboard-content";
import { getCurrentUser } from "@/src/services/session.service";

async function handleLogout() {
  "use server";
  await signOut({
    redirectTo: "/login",
  });
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch dashboard data on the server
  const [stats, activities, commits] = await Promise.all([
    getDashboardStats(user.id),
    getRecentActivity(user.id),
    getDashboardCommits(user.id, 100)
  ]);

  return (
    <DashboardContent 
      user={user} 
      stats={stats}
      activities={activities}
      commits={commits}
      onLogout={handleLogout} 
    />
  );
}
