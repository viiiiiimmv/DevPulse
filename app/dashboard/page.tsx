import { auth, signOut } from "@/src/auth";
import { getUserByEmail } from "@/src/server/user/user.service";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl || ""}
            alt="Profile Picture"
            className="w-20 h-20 rounded-full border"
          />

          <div>
            <h1 className="text-2xl font-bold">
              Welcome {user.name}
            </h1>

            <p className="text-gray-500">
              @{user.username}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>GitHub Username:</strong> {user.username}
          </p>

          <p>
            <strong>GitHub ID:</strong> {user.githubId}
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            className="px-4 py-2 rounded bg-black text-white"
          >
            Sync GitHub Data
          </button>

          <form
            action={async () => {
              "use server";
              await signOut({
                redirectTo: "/login",
              });
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 rounded border"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}