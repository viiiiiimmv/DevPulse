import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import {
  GitBranch,
  Activity,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BarChart3,
  FolderGit,
  Database,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute left-1/4 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/5" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[110px] dark:bg-violet-500/5" />

      <main className="relative">
        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 lg:px-8 lg:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            DevPulse developer intelligence
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Manage your GitHub presence with <span className="text-primary">pulse</span>.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Synchronize your GitHub activity, understand repository patterns, and see how your developer habits evolve over time.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <Link href="/login" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
              <FaGithub className="h-4 w-4" />
              Sign in with GitHub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 w-full max-w-5xl rounded-xl border border-border bg-card/85 p-4 shadow-sm sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-lg border border-border bg-secondary/25 p-4">
                <div className="mb-4 flex items-center justify-between gap-4 text-left">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Overview</p>
                    <h2 className="mt-1 text-xl font-bold text-foreground">GitHub activity</h2>
                  </div>
                  <span className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Live</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md border border-border bg-card p-3 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Commits</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">293</p>
                  </div>
                  <div className="rounded-md border border-border bg-card p-3 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Repos</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">41</p>
                  </div>
                  <div className="rounded-md border border-border bg-card p-3 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Score</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">50</p>
                  </div>
                </div>

                <div className="mt-5 h-28 rounded-md border border-border bg-card/70 p-3">
                  <div className="flex h-full items-end gap-2">
                    {[28, 48, 32, 58, 40, 62, 55, 70, 50, 76, 68, 82].map((value, index) => (
                      <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-primary/80 to-violet-400" style={{ height: `${value}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-border bg-secondary/25 p-4 text-left">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Top languages</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary">TypeScript</span>
                </div>

                <div className="space-y-3">
                  {[
                    ["TypeScript", 42],
                    ["JavaScript", 29],
                    ["CSS", 18],
                    ["Python", 11],
                  ].map(([name, value]) => (
                    <div key={name}>
                      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>{name}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-card">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-md border border-border bg-card p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Most active repo</p>
                  <p className="mt-2 text-sm font-bold text-foreground">Shiv-Assignments</p>
                  <p className="mt-1 text-xs text-muted-foreground">60 commits in focus.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-card/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="dp-label">Three core signals</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Built for the way developers work.</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <article className="rounded-xl border border-border bg-card/80 p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-500">
                  <GitBranch className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Sync</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Keep GitHub profile data, repositories, and commit history aligned without manual effort.</p>
              </article>

              <article className="rounded-xl border border-border bg-card/80 p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-violet-500/10 text-violet-500">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Analyze</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Explore contribution patterns, language mix, and repository activity in a dedicated workspace.</p>
              </article>

              <article className="rounded-xl border border-border bg-card/80 p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-pink-500/10 text-pink-500">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Pulse</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Interpret your current contribution rhythm and understand where your work is concentrated.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-xl border border-border bg-card/80 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="dp-label">Analytics view</p>
                <span className="rounded-full border border-border bg-secondary/70 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Weekly</span>
              </div>

              <div className="flex h-44 items-end gap-2">
                {[18, 24, 26, 42, 36, 54, 48, 72, 58, 80, 74, 92].map((value, index) => (
                  <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500/80 to-violet-400" style={{ height: `${value}%` }} />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card/80 p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <Database className="h-4 w-4 text-indigo-500" />
                  Repository intelligence
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">Track the repos driving your code, contribution consistency, and language composition in one place.</p>
              </div>

              <div className="rounded-xl border border-border bg-card/80 p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-violet-500" />
                  Secure by design
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">DevPulse keeps authentication and synchronization flow focused on data access, not noisy UI overlays.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-card/40 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="dp-label">Your code has a pulse.</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Start understanding it.</h2>
            <Link href="/login" className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
              Connect GitHub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

