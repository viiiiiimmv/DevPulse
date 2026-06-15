import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { 
  GitBranch, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export default async function Home() {
  const session = await auth();

  // Redirect to dashboard immediately if logged in
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col justify-between">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none dark:bg-indigo-500/5" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none dark:bg-violet-500/5" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[80px] pointer-events-none dark:bg-pink-500/5" />

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24 flex-1 flex flex-col items-center justify-center text-center">
        {/* Banner Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6 hover:bg-primary/10 transition-colors cursor-pointer select-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DevPulse v2.0 - Re-designed Developer Hub</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mb-6 leading-tight">
          Manage Your{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400">
            GitHub Presence
          </span>{" "}
          with Pulse
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
          Synchronize your profile data, track detailed commit activities, and monitor your repositories in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <FaGithub className="w-5 h-5" />
            <span>Sign In with GitHub</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border/40 bg-card/30 backdrop-blur-sm py-20 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">
              Designed for High-Performing Developers
            </h2>
            <p className="text-muted-foreground font-medium text-lg">
              Streamlined dashboard features to keep your GitHub presence up to date without effort.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl border border-border/40 bg-card/60 hover:bg-card hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                GitHub Sync
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Keep repositories, stars, forks, and profile details fully synchronized. Connect and fetch within seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl border border-border/40 bg-card/60 hover:bg-card hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Activity Tracking
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Track historical sync logs, repository modifications, and check activity indicators over time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl border border-border/40 bg-card/60 hover:bg-card hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Secure Authentication
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Your data is protected under robust encryption keys and official OAuth mechanisms. No credentials exposed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/10 py-10 text-center text-muted-foreground text-sm font-medium transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} DevPulse. Built with Next.js & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
