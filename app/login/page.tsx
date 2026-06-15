import { signIn } from "@/src/auth";
import { FaGithub } from "react-icons/fa6";
import { Activity, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl p-8 sm:p-10 transition-colors duration-300">
        
        {/* Header/Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              DevPulse
            </span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">
            Log in to manage and sync your GitHub profile.
          </p>
        </div>

        {/* OAuth Form */}
        <form
          action={async () => {
            "use server";
            await signIn("github", {
              redirectTo: "/dashboard",
            });
          }}
          className="space-y-4"
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group"
          >
            <FaGithub className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>Sign In with GitHub</span>
          </button>
        </form>

        {/* Info/Warning Footer */}
        <div className="mt-8 pt-6 border-t border-border/40 flex items-start gap-2.5 text-xs text-muted-foreground font-medium leading-normal">
          <ShieldAlert className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <span>
            DevPulse is secured with secure GitHub OAuth. We do not store or access your credentials directly.
          </span>
        </div>
      </div>
    </div>
  );
}