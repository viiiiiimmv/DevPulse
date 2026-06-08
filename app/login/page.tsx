import { signIn } from "@/src/auth";

export default function LoginPage() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github",{
            redirectTo: "/dashboard",
        });
      }}
    >
      <button
        type="submit"
        className="border px-4 py-2 rounded"
      >
        Sign in with GitHub
      </button>
    </form>
  );
}